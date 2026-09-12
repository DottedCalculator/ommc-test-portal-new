import type { NextApiRequest, NextApiResponse } from "next";
import firestore from "../../firebase";
import { allowMethod, requireUser, setNoStore } from "~/server/security";

type ApiResponse = { Test_Emails: string } | { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  setNoStore(res);
  if (!allowMethod(req, res, "GET")) return;
  try {
    const session = await requireUser(req, res, true);
    if (!session) return;
    const snapshot = await firestore.collection("users").get();
    const emails = new Set<string>();
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (typeof data.email === "string" && data.email.trim()) emails.add(data.email.trim());
    });
    return res.status(200).json({ Test_Emails: [...emails].join(" ") });
  } catch {
    return res.status(500).json({ message: "Failed to get emails" });
  }
}
