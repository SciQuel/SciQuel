import { useState } from "react";

//TODO DO ALL PROPTYPES AND INTERFACES
const StoryImagePopup = ({ src, children, handleClick, imageRef }) => {
  const [imageClicked, setImageClicked] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: null, y: null });
  const [dragging, setDragging] = useState(false);
  const [scaleLevel, setScaleLevel] = useState(1.5);

  const handleImageClick = () => {
    console.log(scaleLevel);
    if (scaleLevel === 3) {
      setImageClicked(false);
      console.log(imageClicked);
      setScaleLevel(1.5);
      return;
    }

    if (!imageClicked) {
      setImageClicked(true);
    } else {
      setScaleLevel(scaleLevel + 1.5);
    }
  };

  //zoom and look feature
  const handleImageDrag = (e) => {
    !dragging && setDragging(true);
    const x = e.clientX - e.target.offsetLeft;
    const y = e.clientY - e.target.offsetTop;
    setImagePosition({ x, y });
  };

  return (
    <div
      className={`fixed left-1/2 top-1/2 z-50 flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center border border-solid border-slate-800 bg-white hover:cursor-pointer`}
      onClick={handleClick}
    >
      <div className={`h-auto w-auto border border-solid border-slate-700 `}>
        <img
          src={src}
          className={`relative mx-auto max-h-[700px] ${
            scaleLevel < 3 ? "hover:cursor-zoom-in" : "hover:cursor-zoom-out"
          }  `}
          ref={imageRef}
          onClick={handleImageClick}
          onMouseMove={handleImageDrag}
          style={{
            transformOrigin: `${
              imagePosition.x !== null
                ? `${imagePosition.x}px ${imagePosition.y}px`
                : "center center"
            }`,
            transform: imageClicked ? `scale(${scaleLevel})` : "none",
          }}
        />
      </div>

      <p> {children} </p>
      <p> {scaleLevel} </p>

      <button className="absolute right-0 top-0 mr-5 mt-3 text-3xl">x</button>
    </div>
  );
};

export default StoryImagePopup;
