import type { NextApiRequest, NextApiResponse } from "next";
import firestore from "../../firebase";
import { allowMethod, requireUser, setNoStore, submissionDocId } from "~/server/security";

type Submission = Record<string, string>;
type ApiResponse = { message: string } | Submission[] | Record<string, Submission[]>;

function publicSubmission(data: Record<string, unknown>): Submission {
  const result: Submission = {};
  for (const key of ["username", "email", "image", "teamName", "teamMembers", "started",
    ...Array.from({ length: 25 }, (_, i) => `q${i + 1}`)]) {
    const value = data[key];
    result[key] = typeof value === "string" ? value : key === "teamMembers" ? "[]" : "";
  }
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  setNoStore(res);
  if (!allowMethod(req, res, "GET")) return;
  const scope = req.query.scope ?? "all";
  if (scope !== "mine" && scope !== "all") {
    return res.status(400).json({ message: "Invalid submissions scope" });
  }
  try {
    const session = await requireUser(req, res, scope === "all");
    if (!session) return;
    const collection = firestore.collection("data");
    if (scope === "mine") {
      const doc = await collection.doc(submissionDocId(session.user.id)).get();
      const data = doc.data();
      // Legacy email/name fields were supplied by clients and are not proof of ownership.
      if (!data || data.ownerId !== session.user.id) return res.status(200).json([]);
      return res.status(200).json([publicSubmission(data)]);
    }
    const snapshot = await collection.get();
    // fromEntries safely handles legacy document IDs such as "__proto__".
    const result = Object.fromEntries(snapshot.docs.map((doc) =>
      [doc.id, [publicSubmission(doc.data())]]
    ));
    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ message: "Failed to get submissions" });
  }
}
