"use client";

import BeakerGraphBox from "@/components/UserDashboard/BeakerGraphBox";
import CommentsBox from "@/components/UserDashboard/CommentsBox";
// import HighlightsBox from "@/components/UserDashboard/HighlightsBox";
import BrainedArticleBox from "@/components/UserDashboard/BrainedArticlesBox";
// import TrendingReadsBox from "@/components/UserDashboard/TrendingReadsBox";

import SavedDefinitionsBox from "@/components/UserDashboard/SavedDefinitionsBox";
import BookmarksBox from "@/components/UserDashboard/BookmarksBox";
import { useSession } from "next-auth/react";

export default function TopFlex() {
  function timeOfDay() {
    let temp = (new Date()).getHours();

    if (temp >= 6 && temp < 12) {
      return 'Morning';
    } else if (temp >= 12 && temp < 18) {
      return 'Afternoon';
    } else {
      return 'Evening';
    }
  }

  const session = useSession();

  return (
    <div className="flex flex-col max-h-screen px-8">

      <h1 className="text-2xl font-semibold text-[#52928E] my-10 ml-3">Good {timeOfDay()}, {session.data?.user.firstName}!</h1>

      <div className="h-fit">
        <div className="flex">
          <BeakerGraphBox/>

        <div className="flex flex-col">
          <div className="flex h-full">
            <CommentsBox/>
            <BrainedArticleBox/>
          </div>

          <div className="flex h-full">
            <SavedDefinitionsBox/>
            <BookmarksBox/>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}