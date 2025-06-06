import BookmarksBox from "@/components/UserDashboard/BookmarksBox";
import NotesBox from "@/components/UserDashboard/NotesBox";
import SavedDefinitionsBox from "@/components/UserDashboard/SavedDefinitionsBox";

export default function BottomFlex() {
  return (
    <div className="flex">
      <SavedDefinitionsBox />
      <NotesBox />
      <BookmarksBox />
    </div>
  );
}
