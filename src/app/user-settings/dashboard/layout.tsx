import { type ReactNode } from "react";

export default function Layout(props: {
  greeting: ReactNode;
  quiz_history: ReactNode;
  article_cards: ReactNode;
}) {
  return (
    <div className="relative flex grow flex-col pt-6 md:pl-56">
      {props.greeting}
      {props.quiz_history}
      {props.article_cards}
    </div>
  );
}
