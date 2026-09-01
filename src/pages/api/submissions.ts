import type { NextApiRequest, NextApiResponse } from "next";
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

type UserData = {
  [key: string]: SubmissionData[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | UserData>
) {
  try {
    // Create a reference to the user's collection
    const userCollectionRef = firestore.collection("data");

    // Get all documents in the collection
    const snapshot = await userCollectionRef.get();

    // Create an object to hold the user data
    const userData: UserData = {};

    // Loop through each document and add its data to the userData object
    snapshot.forEach((doc) => {
      const user = doc.id;
      const data = doc.data() as SubmissionData;
      if (!userData[user]) {
        userData[user] = [];
      }
      userData[user]?.push(data);
    });

    return res.status(200).json(userData); // return the userData object
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get data" });
  }
}
