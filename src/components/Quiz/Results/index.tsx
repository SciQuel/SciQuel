import { type QuizHistory } from "@/app/user-settings/actions/getQuizHistory";
import env from "@/lib/env";
import axios from "axios";
import { useEffect } from "react";

export default function Results() {
  async function getQuizRecord(): Promise<QuizHistory | null> {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api/quiz-record`, {
        next: { revalidate: 60 },
      });
      console.log("res", res);
      console.log("getQuizRecord", res);

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();

      if (!data) {
        return null;
      }

      return data as QuizHistory;
    } catch (error) {
      console.error("Error fetching quiz record:", error);
      return null;
    }
  }
  useEffect(() => {
    getQuizRecord();
  }, []);
  return (
    <div className="text-black">
      <p className="mb-6 text-center ">
        <strong className="font-quicksand mb-1 text-2xl font-bold">
          Your score:
        </strong>
      </p>
    </div>
  );
}
