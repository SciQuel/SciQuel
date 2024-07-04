import { MouseEvent, PropsWithChildren, RefObject, useState, useEffect} from "react";

interface Props {
  src: string;
  handleClick: (e: MouseEvent<HTMLDivElement>) => void;
  alt?: string;
  imageRef: RefObject<HTMLImageElement>;
  captionRef: RefObject<HTMLParagraphElement>;
}


const StoryImagePopup = ({
  src,
  children,
  handleClick,
  imageRef,
  captionRef,
  alt,
}: PropsWithChildren<Props>) => {
  const [imageClicked, setImageClicked] = useState(false);
  const [imagePosition, setImagePosition] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [dragging, setDragging] = useState(false);
  const [scaleLevel, setScaleLevel] = useState(1);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  //handler for when you click on popup image, clicking once will get rid of caption and focus on image, clicking another will zoom in
  const handlePopUpImageClick = () => {
    if(!isMobile){

    
    if (scaleLevel === 3) {
   
      setScaleLevel(1);
      return;
    }

    if (!imageClicked) {
      setImageClicked(true);
    } else {
      setScaleLevel(scaleLevel + 2);
    }
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
  
  const cursorStyles = isMobile && 'default'

  return (
    
    <div
      className={`fixed left-1/2 top-1/2 z-50 flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center border border-solid border-slate-800 bg-white hover:cursor-pointer`}
      onClick={handleClick}
    >

        {/* container for content inside popup */}
      <div className=" max-w-[100%] flex flex-wrap items-center justify-center gap-4 z-0">

            {/* image container */}
            <div className = 'max-w-[95%] w-[700px]  max-h-[700px] '>
        <img
          src={src}
          className={` w-full block relative mx-auto max-h-[700px] object-contain     ${
            scaleLevel === 1 ? "hover:cursor-zoom-in" : "hover:cursor-zoom-out"
          }`}
          ref={imageRef}
          onClick={handlePopUpImageClick}
          onMouseMove={handleImageDrag}
          alt={alt}
          style={{...imageStyles, cursor: cursorStyles}}
        />
       
        </div>
 
        {!imageClicked && <p className = 'text-center text-wrap mx-5' ref = {captionRef} > {children} </p>}
      </div>

      <button
        aria-label="close popup"
        className="absolute right-0 top-0 mr-5 mt-3 text-3xl"
      >
        &times;
      </button>
    </div>
  );
};

export default StoryImagePopup;
