import { MouseEvent, PropsWithChildren, RefObject, useState, useEffect } from "react";
/*TODO I am trying to get image to be in the direct center when there is enough space on the right for the caption,
i need to find a way to determine when to move it and how to move it. I tried Make the caption absolute when the space
to the right of the caption is greater than the caption width.. 

*/
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
  const [transformOriginPosition, setTransformOriginPosition] = useState<{ x: number | null; y: number | null; }>({ x: null, y: null });
  const [dragging, setDragging] = useState(false);
  const [scaleLevel, setScaleLevel] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  //popup sometimes renders with image that is not sized right since use effect hook that controls sizing runs after render, have state that will determine when size is calculated
  const[isImageReady, setIsImageReady] = useState(false)

 
 /* need to resize images while keeping aspect ratio 
going ot make max height 750px and max width 700px 
 we want to get natural image height and natural image width
the aspect ratio would be width/height
if image is more than 750px tall or wider than 700px  resize down 
if image is 500 or less each try to resize up 
 if resizing would not maintain aspect raitio without going over maxes, keep default
*/
  // Resize constraints
  const MAX_WIDTH =  isMobile ? 550 : 700;
  const MAX_HEIGHT =  isMobile? 550 : 700;
  const MIN_SIZE = 500;

  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      const { naturalWidth: width, naturalHeight: height } = img;
      console.log(width, height);
      let newWidth = width;
      let newHeight = height;

      if (height > MAX_HEIGHT || width > MAX_WIDTH) {
        // Resize down
        const heightRatio = MAX_HEIGHT / height;
        const widthRatio = MAX_WIDTH / width;
        const resizeRatio = Math.min(heightRatio, widthRatio);

        newWidth = width * resizeRatio;
        newHeight = height * resizeRatio;
      } else if (width <= MIN_SIZE || height <= MIN_SIZE) {
        // Resize up if smaller than MIN_SIZE
        const widthRatio = MAX_WIDTH / width; 
        const heightRatio = MAX_HEIGHT / height; 
        const resizeRatio = Math.min(widthRatio, heightRatio);

        newWidth = width * resizeRatio;
        newHeight = height * resizeRatio;
      }

      // make sure it fits within the max constraints
      if (newWidth > MAX_WIDTH) {
        newWidth = MAX_WIDTH;
        newHeight = (height / width) * newWidth;
      }
      if (newHeight > MAX_HEIGHT) {
        newHeight = MAX_HEIGHT;
        newWidth = (width / height) * newHeight;
      }

      setImageDimensions({ width: newWidth, height: newHeight });
      setIsImageReady(true)
    }
  }, [imageRef]);


  useEffect(() => {

    const handleResize = () => {
       setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePopUpImageClick = () => {
    if (!isMobile) {
      if (scaleLevel === 3) {
        setScaleLevel(1);
        return;
      }
      if (!imageClicked) {
        setImageClicked(true);
      } else {
        setScaleLevel(prevScaleLevel => prevScaleLevel + 2);
      }
    }
  };

  const handleImageDrag = (e: MouseEvent<HTMLImageElement>) => {
    !dragging && setDragging(true);
    const divTarget = e.target as HTMLImageElement;
    const x = e.clientX - divTarget.offsetLeft;
    const y = e.clientY - divTarget.offsetTop;
    setTransformOriginPosition({ x, y });
  };

  //logic to retrieve trnasform styles 
  const transformOriginValue = transformOriginPosition.x !== null ? `${transformOriginPosition.x}px ${transformOriginPosition.y}px` : 'center center';
  const transformValue = imageClicked ? `scale(${scaleLevel})` : "none";

  //css styles that control the cursor for image, and the scale origin and value
  const imageStyles = {
    transformOrigin: transformOriginValue,
    transform: transformValue,
    cursor: isMobile ? 'default' : scaleLevel === 1 ? 'zoom-in' : 'zoom-out',
  };

  return (
    <div
      className={`fixed left-1/2 top-1/2 z-50 flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 transform flex-col justify-center border border-solid border-slate-800 bg-white hover:cursor-pointer`}
      onClick={handleClick}
    >
      <div className="    mx-auto flex flex-wrap items-center justify-center gap-4 xl:gap-16 z-0 border-solid">
        {/* image container */}
        <div className= {`max-h-[750px]  ${isMobile && 'mx-5'} `}>
          <img
            src={src}
            className="w-full block relative"
            ref={imageRef}
            onClick={handlePopUpImageClick}
            onMouseMove={handleImageDrag}
            alt={alt}
            style={{ width: imageDimensions?.width, height: imageDimensions?.height, ...imageStyles }}
          />
        </div>
        <p className={`  md:w-[20%]  xl:absolute xl:right-0 xl:top-1/2  text-center text-wrap cursor-default ${imageClicked ? 'hidden' : ''}`} ref={captionRef}>
          {children}
        </p>
      </div>
      <button aria-label="close popup" className="absolute right-0 top-0 mr-5 mt-3 text-3xl">
        &times;
      </button>
    </div>
  );
};

export default StoryImagePopup;
