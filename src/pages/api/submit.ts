/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
// import { getSession } from "next-auth/react";
import firestore from "../../firebase";

type Data =
  | {
      data: unknown;
    }
  | {
      message: string;
    };

type SubmissionData = {
  teamMember: string;
  teamName: string;
  started: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
  q10: string;
  q11: string;
  q12: string;
  q13: string;
  q14: string;
  q15: string;
  q16: string;
  q17: string;
  q18: string;
  q19: string;
  q20: string;
  q21: string;
  q22: string;
  q23: string;
  q24: string;
  q25: string;
  username: string;
  email: string;
  image: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const data: SubmissionData = {
      ...req.body,
    };

    // Create a reference to the user's document
    const userDocRef = firestore.collection("data").doc(data.username);

    // Add the new submission to the user's document
    const userDocData = {
      username: data.username,
      teamName: data.teamName,
      started: data.started,
      q1: data.q1,
      q2: data.q2,
      q3: data.q3,
      q4: data.q4,
      q5: data.q5,
      q6: data.q6,
      q7: data.q7,
      q8: data.q8,
      q9: data.q9,
      q10: data.q10,
      q11: data.q11,
      q12: data.q12,
      q13: data.q13,
      q14: data.q14,
      q15: data.q15,
      q16: data.q16,
      q17: data.q17,
      q18: data.q18,
      q19: data.q19,
      q20: data.q20,
      q21: data.q21,
      q22: data.q22,
      q23: data.q23,
      q24: data.q24,
      q25: data.q25,
      teamMembers: data.teamMember,
      email: data.email,
      image: data.image,
    };
    await userDocRef.set(userDocData, { merge: true });

    return res.status(200).json({ message: "Data submitted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to submit data" });
  }
}
