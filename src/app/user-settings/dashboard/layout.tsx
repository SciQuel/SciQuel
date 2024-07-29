export default function Layout(props: {
  greeting: React.ReactNode;
  quiz_history: React.ReactNode;
  article_cards: React.ReactNode;
  quiz_summary: React.ReactNode;
  brained_article_carousel: React.ReactNode;
  top_flex: React.ReactNode;
  bottom_flex: React.ReactNode;
}) {
  // const smallerViewHeight: React.CSSProperties = {
  //   height: '.75vh'
  // }

  return (
    <div className="relative flex grow flex-col pt-6 max-h-screen">
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
