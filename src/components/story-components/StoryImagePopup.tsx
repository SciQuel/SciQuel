import { MouseEvent, PropsWithChildren, RefObject, useState } from "react";

interface Props {
  src: string;
  handleClick: (e: MouseEvent<HTMLDivElement>) => void;
  alt?: string;
  imageRef: RefObject<HTMLImageElement>;
}

//TODO DO ALL PROPTYPES AND INTERFACES
const StoryImagePopup = ({
  src,
  children,
  handleClick,
  imageRef,
  alt,
}: PropsWithChildren<Props>) => {
  const [imageClicked, setImageClicked] = useState(false);
  const [imagePosition, setImagePosition] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [dragging, setDragging] = useState(false);
  const [scaleLevel, setScaleLevel] = useState(1);

  
  const handleImageClick = () => {
    if (scaleLevel === 3) {
      setImageClicked(false);
      setScaleLevel(1);
      return;
    }

    if (!imageClicked) {
      setImageClicked(true);
    } else {
      setScaleLevel(scaleLevel + 2);
    }
  };

  //zoom and look feature(ask to keep it , was something quick i figured out)
  const handleImageDrag = (e: MouseEvent<HTMLImageElement>) => {
    !dragging && setDragging(true);
    const divTarget = e.target as HTMLImageElement;
    const x = e.clientX - divTarget.offsetLeft;
    const y = e.clientY - divTarget.offsetTop;
    setImagePosition({ x, y });
  };

  //style values
  const transformOriginValue =
    imagePosition.x !== null
      ? `${imagePosition.x}px ${imagePosition.y}px`
      : "center center";

  const transformValue = imageClicked ? `scale(${scaleLevel})` : "none";

  const imageStyles = {
    transformOrigin: transformOriginValue,
    transform: transformValue,
  };

  return (
    <div
      className={`fixed left-1/2 top-1/2 z-50 flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center border border-solid border-slate-800 bg-white hover:cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex flex-wrap items-center justify-center gap-4 z-0">
        <img
          src={src}
          className={` relative mx-auto max-h-[700px] min-w-[400px]  z-50  ${
            scaleLevel === 1 ? "hover:cursor-zoom-in" : "hover:cursor-zoom-out"
          }`}
          ref={imageRef}
          onClick={handleImageClick}
          onMouseMove={handleImageDrag}
          alt={alt}
          style={imageStyles}
        />

        {!imageClicked && <p className = 'text-center'> {children} </p>}
      </div>

      <button
        aria-label="close popup"
        className="absolute right-0 top-0 mr-5 mt-3 text-3xl"
      >
        x
      </button>
    </div>
  );
};

export default StoryImagePopup;
