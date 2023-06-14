import Sidebar from "@/components/UserSettings/Sidebar";

export default function Layout(props: {
  quiz_history: React.ReactNode;
  greeting: React.ReactNode;
  article_cards: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F8FF] px-8">
      <Sidebar />
      <div className="relative flex grow flex-col pt-6 md:pl-56">
        {props.greeting}
        {props.quiz_history}
        {props.article_cards}
      </div>
    </div>
  );
}
