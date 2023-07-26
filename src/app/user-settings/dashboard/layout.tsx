export default async function Layout(props: {
  greeting: React.ReactNode;
  quiz_history: React.ReactNode;
  article_cards: React.ReactNode;
}) {
  return (
    <div className="relative flex grow flex-col pt-6 md:pl-56">
      {props.greeting}
      {props.quiz_history}
      {props.article_cards}
    </div>
  );
}
