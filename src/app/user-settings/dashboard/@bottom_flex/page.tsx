import SavedDefinitionsBox from "@/components/UserDashboard/SavedDefinitionsBox";
import NotesBox from "@/components/UserDashboard/NotesBox";
import BookmarksBox from "@/components/UserDashboard/BookmarksBox";

export default async function BottomFlex() {
  return (
    <div className="flex">
      <SavedDefinitionsBox/>
      <NotesBox/>
      <BookmarksBox/>
    </div>
  )
}