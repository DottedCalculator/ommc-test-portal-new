import type { NextApiRequest, NextApiResponse } from "next";
import firestore from "../../firebase";
import { allowMethod, allowSameOriginJson, requireUser, setNoStore, submissionDocId } from "~/server/security";

export const config = { api: { bodyParser: { sizeLimit: "32kb" } } };
type ApiResponse = { message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}


// Preserve the original client's JSON-encoded answer strings for the existing grader.
// Only explicitly selected fields are persisted; supplied identity fields are ignored.
function validateSubmission(input: unknown): Record<string, string> | null {
  if (!isRecord(input)) return null;
  if (typeof input.teamName !== "string" || !input.teamName.trim() || input.teamName.length > 200) return null;
  let members: unknown = input.teamMember;
  if (typeof members === "string") {
    if (members.length > 8000) return null;
    try { members = JSON.parse(members) as unknown; } catch { return null; }
  }
  if (!Array.isArray(members) || members.length < 1 || members.length > 4) return null;
  const cleanedMembers: Record<string, string>[] = [];
  for (const member of members as unknown[]) {
    if (!isRecord(member)) return null;
    const cleaned: Record<string, string> = {};
    for (const key of ["name", "age", "grade", "school"]) {
      const value = member[key];
      if (typeof value !== "string" || !value.trim() || value.length > 300) return null;
      cleaned[key] = value;
    }
    cleanedMembers.push(cleaned);
  }
  const started = input.started;
  if (started !== true && started !== false && started !== "true" && started !== "false") return null;
  const data: Record<string, string> = {
    teamName: input.teamName,
    teamMembers: JSON.stringify(cleanedMembers),
    started: String(started),
  };
  for (let i = 1; i <= 25; i++) {
    const key = `q${i}`;
    const value = input[key];
    if (value != null && (typeof value !== "string" || value.length > 200)) return null;
    data[key] = typeof value === "string" ? value : "";
  }
  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  setNoStore(res);
  if (!allowMethod(req, res, "POST")) return;
  try {
    const SUBMISSION_DEADLINE = Date.parse("2026-09-20T07:00:00Z");

    if (Date.now() >= SUBMISSION_DEADLINE) {
      return res.status(403).json({
        message: "Submissions are closed",
      });
    }
    const session = await requireUser(req, res);
    if (!session) return;
    if (!allowSameOriginJson(req, res)) return;
    const data = validateSubmission(req.body);
    if (!data) return res.status(400).json({ message: "Invalid submission data" });
    const ref = firestore.collection("data").doc(submissionDocId(session.user.id));
    const written = await firestore.runTransaction(async (transaction) => {
      const existing = await transaction.get(ref);
      // Do not claim or overwrite an old record just because its name/email matches.
      if (existing.exists && existing.data()?.ownerId !== session.user.id) return false;
      transaction.set(ref, {
        ...data,
        ownerId: session.user.id,
        username: session.user.name ?? session.user.email ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? "",
      });
      return true;
    });
    if (!written) return res.status(409).json({ message: "Record ownership requires administrator review" });
    return res.status(200).json({ message: "Data submitted successfully" });
  } catch {
    return res.status(500).json({ message: "Failed to submit data" });
  }
}
