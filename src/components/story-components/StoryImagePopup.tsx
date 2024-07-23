import {
  MouseEvent,
  PropsWithChildren,
  RefObject,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";

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
  const [isImageReady, setIsImageReady] = useState(false);
  const [shouldImageCenter, setShouldImageCenter] = useState(false);
  const invisibleDivRef = useRef<HTMLDivElement> (null) // this ref is for the placeholder element in the div that will only display when image needs to be centered

  /* need to resize images while keeping aspect ratio
     going to make max height 750px and max width 700px
     we want to get natural image height and natural image width
     the aspect ratio would be width/height
     if image is more than 750px tall or wider than 700px resize down
     if image is 500 or less each try to resize up
     if resizing would not maintain aspect ratio without going over maxes, keep default */
 

  // Function to resize the image while maintaining the aspect ratio
  const resizeImage = useCallback(() => {
    const MAX_WIDTH = isMobile ? 550 : 700;
    const MAX_HEIGHT = isMobile ? 550 : 700;
    const MIN_SIZE = 500;
  
    if (imageRef.current) {
      const img = imageRef.current;
      console.log(img.clientHeight, img.clientWidth)
      const { naturalWidth: width, naturalHeight: height } = img;
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

      // Make sure it fits within the max constraints
      if (newWidth > MAX_WIDTH) {
        newWidth = MAX_WIDTH;
        newHeight = (height / width) * newWidth;
      }
      if (newHeight > MAX_HEIGHT) {
        newHeight = MAX_HEIGHT;
        newWidth = (width / height) * newHeight;
      }

      setImageDimensions({ width: newWidth, height: newHeight });
      setIsImageReady(true);
    }
  },[isMobile]);

  // Function to calculate if the image should be centered
  const calculateItemShouldCenter = useCallback(() => {
    const imageRect = imageRef.current?.getBoundingClientRect();
    const spaceToRight = window.innerWidth - (imageRect?.right ?? 0);
    console.log(shouldImageCenter)
    if(!shouldImageCenter){

    
    if (spaceToRight > (imageRef.current?.height ?? 0) / 2) {
      setShouldImageCenter(true);
    
    } 
  }if(shouldImageCenter){
    
    /* if the div has a small width, it means that the image is nearing the left viewport, and the invis div should dissapear to fix layout
    if the space to the right of image if small, do the same
*/      const invisibleDivWidth = invisibleDivRef.current?.clientWidth ?? 0;

    if(invisibleDivWidth  <=5 ||  spaceToRight <= 100){
      setShouldImageCenter(false)
    }
  }
  }, [shouldImageCenter]);
  
  

  // Use layout effect to handle resizing and centering calculations before the browser paints
  useLayoutEffect(() => {
    const handleResize = () => {
      resizeImage()
      setIsMobile(window.innerWidth <= 768);
      calculateItemShouldCenter();
    };

    window.addEventListener('resize', handleResize);

    if (imageRef.current) {
      imageRef.current.addEventListener('load', () => {
        resizeImage();
        calculateItemShouldCenter();
      });
    }

    // Initial calls to have correct layout on mount
    resizeImage();
    // calculateItemShouldCenter();

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('resize', handleResize)
      if (imageRef.current) {
        imageRef.current.removeEventListener('load', () => {
          resizeImage();
          // calculateItemShouldCenter();
        });
      }
    };
  }, [imageRef, isMobile, shouldImageCenter]);

  // Handle image click to toggle zoom levels
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

  // Handle image drag to update transform origin
  const handleImageDrag = (e: MouseEvent<HTMLImageElement>) => {
    if (!dragging) setDragging(true);
    const divTarget = e.target as HTMLImageElement;
    const x = e.clientX - divTarget.offsetLeft;
    const y = e.clientY - divTarget.offsetTop;
    setTransformOriginPosition({ x, y });
  };

  // Logic to retrieve transform styles
  const transformOriginValue = transformOriginPosition.x !== null ? `${transformOriginPosition.x}px ${transformOriginPosition.y}px` : 'center center';
  const transformValue = imageClicked ? `scale(${scaleLevel})` : "none";

  // CSS styles that control the cursor for image, and the scale origin and value
  const imageStyles = {
    transformOrigin: transformOriginValue,
    transform: transformValue,
    cursor: isMobile ? 'default' : scaleLevel === 1 ? 'zoom-in' : 'zoom-out',
    display: isImageReady ? 'block' : 'none'
  };

  return (
    <div
      className={`fixed left-1/2 top-1/2 z-50 flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 transform flex-col justify-center border border-solid border-slate-800 bg-white hover:cursor-pointer`}
      onClick={handleClick}
    >
      <div className={` ${shouldImageCenter ? 'justify-between' : 'justify-center'}  w-full ml-auto flex flex-wrap items-center xl:gap-16 z-0 border-solid`}>
        {/* Invisible item that will help format the image to look centered completely */}
        <div className={` ${!shouldImageCenter ? 'hidden': 'block'}   w-[200px] h-[100px] flex-grow basis-0`} ref = {invisibleDivRef}> </div>
        {/* Image container */}
        <div className={`max-h-[750px] ${isMobile && 'mx-5'} ${isImageReady ? 'block' : 'hidden'}`}>
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
        <p className={` flex-grow basis-0  md:w-[20%] min-w-[200px] mr-6 text-center text-wrap cursor-default ${imageClicked ? 'invisible' : ''}`} ref={captionRef}>
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
