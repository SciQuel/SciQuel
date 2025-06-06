export default function Layout(props: {
  greeting: React.ReactNode;
  quiz_history: React.ReactNode;
  article_cards: React.ReactNode;
  quiz_summary: React.ReactNode;
  brained_article_carousel: React.ReactNode;
  top_flex: React.ReactNode;
  bottom_flex: React.ReactNode;
}) {
  // 📝: this takes props and displays them on the dashboard's body (a.k.a. everything that's not the header, footer, or sidebar).
  //     lots of stuff is commented out and feel free to delete those,, they're artifacts from the previous iteration of the `user-dashboard`.

  return (
    <div className="max-h-screen grow flex-col pt-6">
      {props.top_flex}
      {/* {props.bottom_flex} */}
      {/* {props.test} */}
      {/* {props.brained_article_carousel} */}
      {/* {props.greeting} */}
      {/* {props.quiz_history} */}
      {/* {props.article_cards} */}
    </div>
  );
}
