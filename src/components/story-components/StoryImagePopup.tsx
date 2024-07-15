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
  const [transformOriginPosition, setTransformOriginPosition] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [dragging, setDragging] = useState(false);
  const [scaleLevel, setScaleLevel] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  /* created window event listener to be able to set when viewport is mobile width */
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
      setScaleLevel(prevScaleLevel  => prevScaleLevel + 2);
    }
  }
  };

  //zoom and look feature(ask to keep it , was something quick i figured out)
  const handleImageDrag = (e: MouseEvent<HTMLImageElement>) => {
    !dragging && setDragging(true);
    const divTarget = e.target as HTMLImageElement;
    const x = e.clientX - divTarget.offsetLeft;
    const y = e.clientY - divTarget.offsetTop;
    setTransformOriginPosition({ x, y });
  };

  //style values
  const transformOriginValue =
    transformOriginPosition.x !== null
      ? `${transformOriginPosition.x}px ${transformOriginPosition.y}px` : 'center center'
      

  const transformValue = imageClicked ? `scale(${scaleLevel})` : "none";

    // transdform origin for zoom and look feature, if mobile device, cursor will be default, if it it will either show zoom in or zoom out
  const imageStyles = {
    transformOrigin: transformOriginValue,
    transform: transformValue,
    cursor : isMobile
    ? 'default'
    : scaleLevel === 1
    ? 'zoom-in'
    : 'zoom-out'
    
  };

  return (
    
    <div
      className={`fixed left-1/2 top-1/2 z-50 flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center border border-solid border-slate-800 bg-white hover:cursor-pointer`}
      onClick={handleClick}
    >

        {/* container for content inside popup */}
      <div className="  flex flex-wrap justify-center items-center  z-0 border-solid">

          
            {/* image container */}
            <div className = '  max-w-[95%] w-[700px]  max-h-[700px] '>
        <img
          src={src}
          className={` w-full ml-auto block relative  max-h-[700px] object-contain border border-solid border-sciquelHover`}
          ref={imageRef}
          onClick={handlePopUpImageClick}
          onMouseMove={handleImageDrag}
          alt={alt}
          style={imageStyles}
        />
       
        </div>
 
        {/* caption - hide the caption when the image is clicked*/}
        { <p className = {` w-[30%] text-center text-wrap cursor-default ${imageClicked ? 'hidden' : ''}`} ref = {captionRef} > {children} </p>}
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
