"use client";

import BeakerGraphBox from "@/components/UserDashboard/BeakerGraphBox";
import BookmarksBox from "@/components/UserDashboard/BookmarksBox";
// import HighlightsBox from "@/components/UserDashboard/HighlightsBox";
import BrainedArticleBox from "@/components/UserDashboard/BrainedArticlesBox";
// import TrendingReadsBox from "@/components/UserDashboard/TrendingReadsBox";
import CommentsBox from "@/components/UserDashboard/CommentsBox";
import SavedDefinitionsBox from "@/components/UserDashboard/SavedDefinitionsBox";
import { useSession } from "next-auth/react";

export default function TopFlex() {
  // 📝: originally/according to the figma, there was supposed to be a bottom row, which may or may not be implemented
  //     depending on if the backend is properly constructed for the features edward wanted. so this being called "TopFlex" is an artifact of this.
  //     TopFlex() is passed to the `layout.tsx` in the /dashboard as a prop. this is just to alter the layout of the various boxes of the "TopFlex".

  function timeOfDay() {
    const temp = new Date().getHours();

    if (temp >= 6 && temp < 12) {
      return "Morning";
    } else if (temp >= 12 && temp < 18) {
      return "Afternoon";
    } else {
      return "Evening";
    }
  }

  const session = useSession();

  return (
    <div className="max-h-screen flex-col px-8">
      {/* N.B.: pulls from session info and the user's time of day to create a customized greeting */}
      <h1 className="my-10 ml-3 text-2xl font-semibold text-[#52928E]">
        Good {timeOfDay()}, {session.data?.user.firstName}!
      </h1>

      <div className="h-fit">
        <div className="flex">
          <div className="flex flex-col">
            <div className="flex h-full">
              <BeakerGraphBox />
              <CommentsBox />
              <BrainedArticleBox />
            </div>

            <div className="flex h-full">
              <SavedDefinitionsBox />
              <BookmarksBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
