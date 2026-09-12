import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChartSquareBarIcon, UserCircleIcon } from "@heroicons/react/solid";
import Head from "next/head";

import Navbar from "./components/navbar";
import Error from "./404";

interface TeamMember {
  name: string;
  age: string;
  grade: string;
  school: string;
}

interface Team {
  teamName: string;
  teamMembers: string; // This will be parsed into an array of TeamMember
  q11: string;
  q10: string;
  q13: string;
  q12: string;
  q15: string;
  q14: string;
  q17: string;
  q16: string;
  q19: string;
  q18: string;
  email: string;
  q1: string;
  image: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
  started: string;
  q20: string;
  q22: string;
  q21: string;
  q24: string;
  q23: string;
  q25: string;
  username: string;
}

type TeamsData = Record<string, Team[]>;

const SubmissionsTable = () => {
  const { data: session, status } = useSession();
  const [allowed, setAllowed] = useState(false);
  const [submissions, setSubmissions] = useState<TeamsData>({});
  const [emails, setEmails] = useState<string>("");

  useEffect(() => {
    setAllowed(false);
    setSubmissions({});
    setEmails("");
    if (status !== "authenticated") return;
    const controller = new AbortController();
    const load = async () => {
      try {
        const [submissionsRes, emailsRes] = await Promise.all([
          fetch("/api/submissions?scope=all", { signal: controller.signal, cache: "no-store" }),
          fetch("/api/emails", { signal: controller.signal, cache: "no-store" }),
        ]);
        if (!submissionsRes.ok || !emailsRes.ok) return;
        const data: unknown = await submissionsRes.json();
        const emailData: unknown = await emailsRes.json();
        if (!data || typeof data !== "object" || Array.isArray(data) ||
            !Object.values(data).every(Array.isArray)) return;
        if (!emailData || typeof emailData !== "object" || !("Test_Emails" in emailData) ||
            typeof emailData.Test_Emails !== "string") return;
        if (controller.signal.aborted) return;
        setSubmissions(data as TeamsData);
        setEmails(emailData.Test_Emails);
        setAllowed(true);
      } catch {
        // Do not render privileged data after a failed or cancelled request.
      }
    };
    void load();
    return () => controller.abort();
  }, [status, session?.user?.id]);

  const parseMembers = (value: string): TeamMember[] => {
    try {
      const parsed: unknown = JSON.parse(value);
      if (!Array.isArray(parsed)) return [];
      return (parsed as unknown[]).filter((member): member is TeamMember => {
        if (!member || typeof member !== "object") return false;
        const record = member as Record<string, unknown>;
        return ["name", "age", "grade", "school"].every((key) => typeof record[key] === "string");
      });
    } catch { return []; }
  };

  const totalCorrect = (
    q1: string,
    q2: string,
    q3: string,
    q4: string,
    q5: string,
    q6: string,
    q7: string,
    q8: string,
    q9: string,
    q10: string,
    q11: string,
    q12: string,
    q13: string,
    q14: string,
    q15: string,
    q16: string,
    q17: string,
    q18: string,
    q19: string,
    q20: string,
    q21: string,
    q22: string,
    q23: string,
    q24: string,
    q25: string
  ) => {
    let totalCorrect = 0;

    if (q1 === '"4077"') {
      totalCorrect = totalCorrect + 1;
    }

    if (q2 === '"72"') {
      totalCorrect = totalCorrect + 1;
    }

    if (q3 === '"240"') {
      totalCorrect = totalCorrect + 1;
    }

    if (q4 === '"47618"') {
      totalCorrect = totalCorrect + 1;
    }

    if (q5 === '"16"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q6 === '"4/9"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q7 === '"1/8"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q8 === '"42"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q9 === '"242"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q10 === '"91"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q11 === '"45"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q12 === '"24/143"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q13 === '"30"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q14 === '"12"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q15 === '"33"') {
      totalCorrect = totalCorrect + 1;
    }

    if (q16 === '"3780"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q17 === '"1/4"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q18 === '"363"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q19 === '"688"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q20 === '"98"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q21 === '"223588"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q22 === '"23/47"') {
      totalCorrect = totalCorrect + 1;
    }

    if (q23 === '"49299"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q24 === '"3786602707"') {
      totalCorrect = totalCorrect + 1;
    }
    if (q25 === '"819"') {
      totalCorrect = totalCorrect + 1;
    }

    return `Total correct: ${totalCorrect}`;
  };

  // Get the number of teams
  const getTeams = Object.keys(submissions).length;

  // Calculate the total number of team members
  const getTotalTeamMembers = Object.values(submissions).reduce(
    (total, teams) => {
      return (
        total +
        teams.reduce((teamTotal, team) => {
          const members: TeamMember[] = parseMembers(team.teamMembers);
          return teamTotal + members.length;
        }, 0)
      );
    },
    0
  );

  const getNumberOfUserAccounts = (emails: string): number => {
    return emails.trim() ? emails.trim().split(/\s+/).length : 0;
  };

  const getAllEmails = (emails: string): string => {
    return emails.replace(/\s+/g, ", ");
  };

  return (
    <>
      {allowed ? (
        <>
          <Head>
            <title>User Submissions</title>
          </Head>
          <main className="min-h-[100vh] overflow-hidden bg-gray-400 font-satoshi duration-150 dark:bg-gray-900">
            <Navbar />
            <div className="z-2 pattern-cross absolute h-[calc(100vh-3.7rem)] w-full duration-150 pattern-bg-gray-300 pattern-gray-500 pattern-opacity-20 pattern-size-8 dark:pattern-gray-700 dark:pattern-bg-gray-900"></div>

            <div className="scrollbar relative z-10 h-[calc(100vh-3.7rem)] overflow-scroll p-4">
              <div className="mb-4 grid w-full border-collapse gap-2 overflow-hidden rounded-2xl bg-gray-200 p-4 dark:divide-gray-800 dark:bg-gray-700 md:grid-cols-2 md:gap-4">
                <div>
                  <h1 className="flex items-center gap-1 text-lg font-semibold">
                    <ChartSquareBarIcon className="h-8 w-8" /> TEST STATISTICS
                  </h1>
                  <div className="mt-2 flex gap-2">
                    <div className="rounded-md bg-gray-300 px-2 py-1 dark:bg-gray-800">
                      Total User Accounts: {getNumberOfUserAccounts(emails)}
                    </div>
                    <div className="rounded-md bg-gray-300 px-2 py-1 dark:bg-gray-800">
                      Total Number of Teams: {getTeams}
                    </div>
                    <div className="rounded-md bg-gray-300 px-2 py-1 dark:bg-gray-800">
                      Total Number of Team Members: {getTotalTeamMembers}
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-md bg-gray-300 shadow-inner dark:bg-gray-800">
                  <p className="scrollbar h-20 overflow-y-scroll p-3 text-sm">
                    {getAllEmails(emails)}
                  </p>
                </div>
              </div>

              <table className="w-full border-collapse divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-300 dark:divide-gray-800 dark:border-gray-600">
                <thead className="bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                      Team Members
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                      Team Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Started?
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                      Total Correct
                    </th>
                    {Array.from({ length: 25 }, (_, i) => i + 1).map((q) => (
                      <th
                        key={"question" + q.toString()}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider "
                      >
                        Q{q}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200  dark:divide-gray-700 ">
                  {Object.entries(submissions).map(([user, teams]) =>
                    teams.map((team) => {
                      const members: TeamMember[] = parseMembers(team.teamMembers || "[]");
                      return (
                        <tr
                          key={team.username}
                          className="odd:bg-gray-100 even:bg-gray-200 dark:odd:bg-[#2d394a] dark:even:bg-gray-800"
                        >
                          <td className="flex flex-row items-center gap-4 whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {team.image ? (
                              <Image
                                alt="Profile picture"
                                src={team.image}
                                className="inline rounded-full"
                                height={50}
                                width={50}
                              />
                            ) : (
                              <UserCircleIcon className="h-[50px] w-[50px]" />
                            )}
                            <div className="flex flex-col">
                              <div className="text-lg">{team.username}</div>
                              <div>{team.email}</div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-100">
                            {members.map((member) => (
                              <div
                                key={member.name}
                                className="my-1 rounded-xl bg-gray-300 px-2 py-1 dark:bg-gray-500"
                              >
                                <p>
                                  <span className="font-semibold">Name:</span>{" "}
                                  {member.name}
                                </p>
                                <p>
                                  <span className="font-semibold">Age:</span>{" "}
                                  {member.age}
                                </p>
                                <p>
                                  <span className="font-semibold">Grade:</span>{" "}
                                  {member.grade}
                                </p>
                                <p>
                                  <span className="font-semibold">School:</span>{" "}
                                  {member.school}
                                </p>
                              </div>
                            ))}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-100">
                            {team.teamName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-100">
                            {team.started ? "✓" : "✘"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-100">
                            {totalCorrect(
                              team.q1,
                              team.q2,
                              team.q3,
                              team.q4,
                              team.q5,
                              team.q6,
                              team.q7,
                              team.q8,
                              team.q9,
                              team.q10,
                              team.q11,
                              team.q12,
                              team.q13,
                              team.q14,
                              team.q15,
                              team.q16,
                              team.q17,
                              team.q18,
                              team.q19,
                              team.q20,
                              team.q21,
                              team.q22,
                              team.q23,
                              team.q24,
                              team.q25
                            )}
                            /25
                          </td>
                          {Array.from({ length: 25 }, (_, i) => i + 1).map(
                            (q) => {
                              const questionKey = `q${q}` as keyof Team; // Ensure the key exists on the Team type
                              const questionValue = team[questionKey]; // Safely access the value

                              return (
                                <td
                                  key={`${team.teamName}-${questionKey}`}
                                  className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-100"
                                >
                                  {typeof questionValue === "string"
                                    ? questionValue.replace(/"/g, "") // Remove quotes if it's a string
                                    : ""}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </>
      ) : (
        <Error />
      )}
    </>
  );
};
export default SubmissionsTable;
