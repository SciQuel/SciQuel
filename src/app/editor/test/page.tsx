import GenSubCreateTest from "./GenSubCreate";
import GenSubSearch from "./GenSubSearch";
import SubtopicSearch from "./SubtopicSearch";
import Test from "./Test";

export default function SubtopicTestPage() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <div className="rounded border-2">
        <h2 className="w-full text-center text-4xl">Subtopics</h2>
        <Test />
        <SubtopicSearch />
      </div>
      <div className="rounded border-2">
        <h2 className="w-full text-center text-4xl">General Subjects</h2>
        <GenSubCreateTest />
        <GenSubSearch />
      </div>
    </div>
  );
}
