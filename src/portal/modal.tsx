/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useSession } from "next-auth/react";
import { XIcon, UploadIcon } from "@heroicons/react/solid";

interface Props {
  showModal: boolean;
  setShowModal: (arg0: boolean) => void;
  teamName: string;
  showConfetti: (arg0: boolean) => void;
}

const Modal: React.FC<Props> = ({
  showModal,
  setShowModal,
  teamName,
  showConfetti,
}) => {
  const { data: session } = useSession();
  //Get all stored states from local storage
  const teamMember = localStorage.getItem("TEAM_MEMBER");
  const started = localStorage.getItem("STARTED");
  const q1 = localStorage.getItem("Q1");
  const q2 = localStorage.getItem("Q2");
  const q3 = localStorage.getItem("Q3");
  const q4 = localStorage.getItem("Q4");
  const q5 = localStorage.getItem("Q5");
  const q6 = localStorage.getItem("Q6");
  const q7 = localStorage.getItem("Q7");
  const q8 = localStorage.getItem("Q8");
  const q9 = localStorage.getItem("Q9");
  const q10 = localStorage.getItem("Q10");
  const q11 = localStorage.getItem("Q11");
  const q12 = localStorage.getItem("Q12");
  const q13 = localStorage.getItem("Q13");
  const q14 = localStorage.getItem("Q14");
  const q15 = localStorage.getItem("Q15");
  const q16 = localStorage.getItem("Q16");
  const q17 = localStorage.getItem("Q17");
  const q18 = localStorage.getItem("Q18");
  const q19 = localStorage.getItem("Q19");
  const q20 = localStorage.getItem("Q20");
  const q21 = localStorage.getItem("Q21");
  const q22 = localStorage.getItem("Q22");
  const q23 = localStorage.getItem("Q23");
  const q24 = localStorage.getItem("Q24");
  const q25 = localStorage.getItem("Q25");

  const submissionHandler = async () => {
    setShowModal(false);
    showConfetti(true);
    //Submit to database
    await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamMember: teamMember,
        teamName: teamName,
        started: started,
        q1: q1,
        q2: q2,
        q3: q3,
        q4: q4,
        q5: q5,
        q6: q6,
        q7: q7,
        q8: q8,
        q9: q9,
        q10: q10,
        q11: q11,
        q12: q12,
        q13: q13,
        q14: q14,
        q15: q15,
        q16: q16,
        q17: q17,
        q18: q18,
        q19: q19,
        q20: q20,
        q21: q21,
        q22: q22,
        q23: q23,
        q24: q24,
        q25: q25,
        username: session?.user.name || "",
        email: session?.user.email || "",
        image: session?.user.image || "",
      }),
    }).then((res) => res.json());

    setTimeout(() => {
      showConfetti(false);
    }, 2000);
  };

  type Member = {
    name: string;
  };

  return (
    <>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 mx-4 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none md:mx-0">
            <div className="relative my-6 mx-auto w-auto max-w-3xl xl:max-w-4xl">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-2xl border-0 bg-white shadow-lg outline-none duration-150 focus:outline-none dark:bg-gray-700">
                {/*header*/}
                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5 duration-150 dark:border-slate-800">
                  <h3 className="text-2xl font-semibold xl:text-3xl">
                    Ready to Submit?
                  </h3>
                  <button
                    className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <XIcon className="block h-6 w-6 bg-transparent text-2xl text-slate-900 outline-none focus:outline-none dark:text-slate-300" />
                  </button>
                </div>
                {/*body*/}
                <div className="relative flex-auto p-6 py-4">
                  <div className="my-3 text-lg leading-relaxed text-slate-500 duration-150 dark:text-slate-400">
                    <p> You will be able to submit another set of answers.</p>
                    <p className="mt-2 text-base">
                      Submitting for Team {teamName}:
                    </p>{" "}
                    <div className="mt-2 flex flex-row gap-2">
                      {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                        JSON.parse(teamMember!).map((member: Member) => (
                          <p
                            className="rounded-lg bg-gray-200 px-2 py-1 text-sm dark:bg-gray-800"
                            key={member.name}
                          >
                            {member.name}
                          </p>
                        ))
                      }
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6 duration-150 dark:border-slate-800">
                  <button
                    className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear hover:text-red-600 focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="mr-1 mb-1 flex flex-row items-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:bg-emerald-600 hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="submit"
                    onClick={() => submissionHandler()}
                  >
                    <UploadIcon className="mr-2 h-5 w-5 " /> Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=" fixed inset-0 z-40 bg-black opacity-40 "></div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
