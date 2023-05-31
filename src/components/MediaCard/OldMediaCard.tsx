import React, { Component } from "react";
import "./MediaCard.css";
import { TopicTag } from "../TopicTag/TopicTag";
import WaveSurfer from "wavesurfer.js";
import ReactPlayer from "react-player";

// determine whether the media for the card is audio or video
function getMediaType(mediaUrl) {
  const ext = mediaUrl
    .split(".")
    .pop()
    .toLowerCase();

  if (ext === "mp3" || ext === "wav" || ext === "ogg") {
    return "podcast";
  } else if (ext === "mp4" || ext === "avi" || ext === "mov") {
    return "video";
  } else {
    return null;
  }
}

/**
 * This is the MediaCard that the Home will primary used.
 * This handle both podcast and video cards.
 */
class MediaCard extends Component {
  constructor(props) {
    super(props);

    // Ref for audio
    this.waverer = React.createRef();

    // Ref for video
    this.videoRef = React.createRef();

    // Ref for subtitle
    this.subtitle = React.createRef();

    this.state = {
      audioPlay: false,
      videoPlay: false,
      mediaType: getMediaType(this.props.media),
      lineCount: 1,
    };
    //audioPlay determine if the podcast should play
    //videoPlay determine if the video should play
    //mediaType is the type of media the component will display
  }

  componentDidMount() {

    // When the mediaType is podcast use the WaveSurfer JS to create the
    // sound wave.
    if (this.state.mediaType === "podcast") {
      this.waverer.current = WaveSurfer.create({
        hideScrollbar: true,
        container: "#" + this.props.id,
        waveColor: "white",
        progressColor: "#84b59f",
        cursorColor: "white",
        barWidth: 3,
        responsive: true,
        barGap: 3,
        height: 70,
        barRadius: 2,
        minPxPerSec: 10,
        partialRender: true,
      });

      this.waverer.current.load(this.props.media);
    }

    // Using the width of the media card, determine the line height of the cards.
    let resizeMiddle = new ResizeObserver((entries) => {
      const container = entries[0].target;
      const lineHeight = parseInt(window.getComputedStyle(container).width);
      let newLineCount = Math.floor(lineHeight / 125); // 125 a random number that just fit the model.

      this.setState({
        lineCount: newLineCount,
      });
    });

    resizeMiddle.observe(this.subtitle.current);
  }

  openArticle = () => {
    window.open(this.props.href, "_self");
  };

  // Handle podcast play and pause
  handlePlay = () => {
    this.waverer.current.playPause();

    this.setState({
      audioPlay: !this.state.audioPlay,
    });
  };

  // Handle vide play and pause
  handleVideoPlay = () => {
    if (this.state.videoPlay) {
      this.videoRef.current.pause();
    } else {
      this.videoRef.current.play();
    }

    this.setState({
      videoPlay: !this.state.videoPlay,
    });
  };

  render() {
    /**
     * This render the podcast or the video section of the cards
     * @param {*} mediaType, either podcast or video or it is not supported
     * @returns, JSX
     */
    const renderMedia = (mediaType) => {
      if (mediaType === "podcast") {
        return (
          <div className="podcast-player">
            <div className="track">
              <button className="play-btn" onClick={this.handlePlay}>
                {this.state.audioPlay ? (
                  <img
                    className="playpause"
                    src={require("../../pages/Home/assets/pause_icon.png")}
                    alt="playPause"
                  />
                ) : (
                  <img
                    className="playpause"
                    src={require("../../pages/Home/assets/play_icon.png")}
                    alt="playPause"
                  />
                )}
              </button>
              <div id={this.props.id} className="audio"></div>
            </div>
          </div>
        );
      } else if (mediaType === "video") {
        return (
          <div className="video-container">
            <div className="video-player">
              <ReactPlayer
                url={this.props.media}
                className="react-player"
                width="100%"
                height="100%"
                playing
                playIcon={
                  <button className="play-btn">
                    <img
                      src={require("../../pages/Home/assets/play_icon.png")}
                      alt="Button"
                    />
                  </button>
                }
                light="https://www.sciquel.org/bobtail.png"
                controls
              />
            </div>
          </div>
        );
      } else {
        return (
          // Render a generic error message if the file type is not supported
          <div>Unsupported file type</div>
        );
      }
    };

    // Render the media card with the appropriate styling and content
    return (
      <div
        className="media-outer"
        onClick={this.openArticle}
        style={this.props.style}
      >
        <div className="media-content">
          <div className="media-top-section">
            <TopicTag name={this.props.topic} />
            <p className="media-articleSignifier">{this.state.mediaType}</p>
          </div>
          <div className="media-middle-content">
            <h1
              className="media-articleTitle"
              style={{
                WebkitLineClamp: this.state.titleLineClamp,
                lineClamp: this.state.titleLineClamp,
              }}
            >
              {this.props.title}
            </h1>
            <p
              ref={this.subtitle}
              style={{
                height: (this.state.lineCount - 1) + "rem",
                WebkitLineClamp: this.state.lineCount,
                lineClamp: this.state.lineCount,
              }}
              className="media-articleSubtitle"
            >
              {this.props.subtitle}
            </p>
          </div>
          <p className="media-authorDate">
            {this.props.series}, episode {this.props.episode}
            <span style={{ float: "right" }}>{this.props.date}</span>
          </p>
        </div>
        {renderMedia(this.state.mediaType)}
      </div>
    );
  }
}

export default MediaCard;
