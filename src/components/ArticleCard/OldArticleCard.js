//@eslint-ignore
import React, { Component } from "react";
import "./ArticleCard.css";
import { TopicTag } from "../TopicTag/TopicTag";

class OldArticleCard extends Component {
  constructor(props) {
    super(props);
    this.titleRef = React.createRef();
    this.middleRef = React.createRef();
    //creating a ref so we can get updates on height of title header and space for header

    this.state = {
      lineClamp: null,
      titleHeight: 90,
      maxTitleHeight: 90,
      titleLineClamp: 3,
    };
    //line clamp will determine number of lines to show of subheader
    //lineClamp:null will make the subheader disappear
    //titleLineClamp is for title, should always be 3, 2, or 1
    //maxTitleHeightshould always be 90, 60, or 30
    //titleHeight should be current height of title
  }

  componentDidMount() {
    //the component exists, so now we can see how big the title is
    //one line should be height 30 always
    //so num lines are height of title/30

    //using this resizeObserver to grab title height
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          // console.log(
          //   "Height of",
          //   this.props.topic,
          //   "? ",
          //   entry.contentRect.height
          // );
          if (entry.contentRect.height !== this.state.titleHeight) {
            this.setState({ titleHeight: entry.contentRect.height });
          }

          //this runs anytime the title resizes
          //just changes the lineClamp state if we need a diff number of lines visible
          let height = entry.contentRect.height / 30;
          // console.log("height of ", this.props.topic, "title? ", height);
          // console.log("current max title height? ", this.state.maxTitleHeight);
          // console.log("current line clamp? ", this.state.lineClamp);
          if (
            height >= 2.5 ||
            (this.state.maxTitleHeight === 60 && height > 1.5)
          ) {
            //if title is 3 lines long, no subtitle
            if (this.state.lineClamp !== null) {
              this.setState({ lineClamp: null });
            }

            // console.log("setting lineClamp to null");
          } else if (
            (height >= 1.5 && this.state.maxTitleHeight === 90) ||
            (this.state.maxTitleHeight > entry.contentRect.height &&
              this.state.maxTitleHeight < 90)
          ) {
            // if title is 2 lines long with 3 lines max
            // or 1 line long with 2 lines max
            // subtitle is one line
            if (this.state.lineClamp !== 1) {
              this.setState({ lineClamp: 1 });
              // console.log("setting lineClamp to 1");
            }
          } else if (
            this.state.lineClamp !== 2 &&
            height < 1.5 &&
            this.state.maxTitleHeight === 90
          ) {
            // finally, if title is 1 line long and 3 lines max
            // set subtitle to two lines
            // console.log("setting line clamp to 2");
            this.setState({ lineClamp: 2 });
          }
        }
      }
    });
    this.resizeObserver.observe(this.titleRef.current);
    // console.log("lines in componentDidMount", titleLines);

    //this grabs middleContent div's height
    this.resizeObserverMiddle = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          // console.log("middle is: ", entry.contentRect.height, " tall");
          // console.log(
          //   "Current line clamp for",
          //   this.props.topic,
          //   "title is ",
          //   this.state.titleLineClamp
          // );
          if (entry.contentRect.height < 60) {
            //if middle can't fit two lines,
            //give title one line and remove subtitle
            if (this.state.maxTitleHeight !== 30) {
              // console.log("setting title clamp to 1");
              this.setState({
                maxTitleHeight: 30,
                titleLineClamp: 1,
                lineClamp: null,
              });
            }
          } else if (entry.contentRect.height < 95) {
            //if middle can't fit 3 lines
            //give title two lines and no lines for subtitle
            //if title ends up taking up one line, the other resizeObserver will fix this
            if (this.state.maxTitleHeight !== 60) {
              if (this.state.titleHeight < 45) {
                this.setState({
                  maxTitleHeight: 60,
                  titleLineClamp: 2,
                  lineClamp: 1,
                });
              } else {
                this.setState({
                  maxTitleHeight: 60,
                  titleLineClamp: 2,
                  lineClamp: null,
                });
              }
              // console.log("setting title clamp to 2");
              // console.log("current title height: ", this.state.titleHeight);
            }
          } else if (
            entry.contentRect.height >= 95 &&
            this.state.maxTitleHeight !== 90
          ) {
            //lastly, if we have space, give title 3 lines
            // console.log("Setting title clamp to 3");
            // console.log("current title height? ", this.state.titleHeight);
            // this.setState({ maxTitleHeight: 90, titleLineClamp: 3 });
            if (this.state.titleHeight !== 90) {
              if (this.state.titleHeight >= 59) {
                this.setState({
                  maxTitleHeight: 90,
                  titleLineClamp: 3,
                  lineClamp: 1,
                });
              } else if (this.state.titleHeight <= 35) {
                this.setState({
                  maxTitleHeight: 90,
                  titleLineClamp: 3,
                  lineClamp: 2,
                });
              }
            }
          }
        }
      }
    });
    this.resizeObserverMiddle.observe(this.middleRef.current);
  }

  componentDidUpdate() {
    // under specific resizing circumstances, the heights get out of sync
    //so this just checks and fixes it

    // console.log("we are in componentdidupdate of ", this.props.topic);
    // console.log("current state is: ", this.state);
    if (
      this.state.titleHeight === this.state.maxTitleHeight &&
      this.state.lineClamp !== null
    ) {
      // console.log("setting line clamp to null in componentdidupdate");
      this.setState({ lineClamp: null });
    } else if (
      this.state.maxTitleHeight - this.state.titleHeight === 30 &&
      this.state.lineClamp !== 1
    ) {
      // console.log("setting lineClamp to 1 in componentdidupdate");
      this.setState({ lineClamp: 1 });
    } else if (
      this.state.maxTitleHeight - this.state.titleHeight === 60 &&
      this.state.lineClamp !== 2
    ) {
      // console.log("setting lineClamp to 2 in componentdidupdate");
      this.setState({ lineClamp: 2 });
    }
  }
  componentWillUnmount() {
    //get rid of resize observers on unmount
    this.resizeObserver.disconnect();
    this.resizeObserverMiddle.disconnect();
  }

  openArticle = () => {
    window.open(this.props.href, "_self");
  };

  render() {
    const subtitleHeight =
      "calc(calc(20px * " + this.state.lineClamp + ") + 1.25rem )";

    return (
      <div className="article-card-outer" onClick={this.openArticle}>
        <div className="article-card-content">
          <div className="article-card-top-section">
            <TopicTag name={this.props.topic} />
            <p className="article-card-articleSignifier">ARTICLE</p>
          </div>
          <div className="article-card-middle-content" ref={this.middleRef}>
            <div
              className="articleTitleContent"
              style={{
                height: this.state.titleHeight,
                minHeight: 30,
              }}
            >
              <h1
                className="article-card-articleTitle"
                style={{
                  WebkitLineClamp: this.state.titleLineClamp,
                  lineClamp: this.state.titleLineClamp,
                }}
                ref={this.titleRef}
              >
                {this.props.title}
              </h1>
            </div>
            <div className="articleSubTitleContent">
              {this.state.lineClamp ? (
                <p
                  className=".article-card-articleSubtitle"
                  style={{
                    WebkitLineClamp: this.state.lineClamp,
                    lineClamp: this.state.lineClamp,
                    maxHeight: subtitleHeight,
                  }}
                >
                  {this.props.subtitle}
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>
          <p className="article-card-authorDate">
            By {this.props.author}
            <span style={{ float: "right" }}>{this.props.date}</span>
          </p>
        </div>

        <img className="article-card-img" src={this.props.src} alt=""></img>
      </div>
    );
  }
}

export default OldArticleCard;
