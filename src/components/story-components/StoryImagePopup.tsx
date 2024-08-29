import {
  MouseEvent,
  PropsWithChildren,
  RefObject,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
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
  const [isSmallScreen, setisSmallScreen] = useState(window.innerWidth <= 768);
  const [isMediumScreen, setisMediumScreen] = useState(window.innerWidth <= 1024)
  const [isMobile, setIsMobile] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isImageReady, setIsImageReady] = useState(false);


  const invisibleDivRef = useRef<HTMLDivElement>(null) // this ref is for the placeholder element in the div that will only display when image needs to be centered

  /* need to resize images while keeping aspect ratio
     going to make max height 750px and max width 700px
     we want to get natural image height and natural image width
     the aspect ratio would be width/height
     if image is more than 750px tall or wider than 700px resize down
     if image is 500 or less each try to resize up
     if resizing would not maintain aspect ratio without going over maxes, keep default */


  // Function to resize the image while maintaining the aspect ratio
  const resizeImage = () => {
      //max sizes
    const MAX_WIDTH = isSmallScreen ? window.innerWidth * 0.95 : isMediumScreen ? 700 : 800;
    const MAX_HEIGHT = isSmallScreen ? 550 : isMediumScreen ? 700 : window.innerHeight * 0.97;

    const MIN_SIZE = 500;

    if (imageRef.current) {
      const img = imageRef.current;
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




      const commonWidth = Math.min(newWidth, MAX_WIDTH);
      newWidth = commonWidth;


      setImageDimensions({ width: newWidth, height: newHeight });
      setIsImageReady(true);
    }
  };




  
   //check if user is on mobile device on mount
  useEffect(() => {
   
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setIsMobile(isMobile)

    //disable overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'scroll'
    }
  }, [])


  //functions is attached to window resize event listener, 
  const handleResize = () => {
      resizeImage()
    setisSmallScreen(window.innerWidth <= 768);
    setisMediumScreen(window.innerWidth <= 1024)
// calculateItemShouldCenter();
  };

  const handleImageLoad = () => {
    resizeImage()
    // calculateItemShouldCenter()
  }
  // Use layout effect to handle resizing and centering calculations before the browser paints
  useLayoutEffect(() => {
    window.addEventListener('resize', handleResize);

    if (imageRef.current) {
      imageRef.current.addEventListener('load', handleImageLoad)

    }

    // Initial calls to have correct layout on mount
    if (imageRef.current && imageRef.current.complete) {
      handleImageLoad();

    }

    // calculateItemShouldCenter();

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('resize', handleResize)
      if (imageRef.current) {
        imageRef.current.removeEventListener('load', handleImageLoad)

      }
    };
  }, [imageRef, isMediumScreen, isSmallScreen]);

  // Handle image click to toggle zoom levels
  const handlePopUpImageClick = () => {
    //remove invisible item so item can look centered if it is not already


    if (!isMobile) {
      if (scaleLevel === 3) {
        setScaleLevel(1);
        setImageClicked(false)
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

  const imageTrasnform = {
    transformOrigin: transformOriginValue,
    transform: transformValue
  }
  const imageStyles = {

    cursor: isMobile ? 'default' : scaleLevel === 1 ? 'zoom-in' : 'zoom-out',
    display: isImageReady ? 'block' : 'none',

  };

  return (
    <div
      className={`fixed  left-1/2 top-1/2 z-50 flex h-[100dvh] w-screen -translate-x-1/2 -translate-y-1/2 transform flex-col justify-center   bg-white hover:cursor-pointer`}
      onClick={handleClick}
    >


      {/* container for content */}
      <div className={`  flex-col sm:flex-col  lg:flex-row max-h-full w-full flex items-center justify-center  z-0  ${imageClicked && 'justify-center'}`}>
        {/* Invisible item that will help format the image to look centered completely, shows only on large screen */}
        {!imageClicked && (
          <div className='  basis-[10px] invisible bg-black h-[100px] flex-grow hidden lg:block lg:mx-5'> </div>

        )}


        {/* Image container */}
        <div className="   max-w-full  h-sm:max-h-[80%] h-md:max-h-[85%] h-lg:max-h-[97%]   h-sm:w-auto    "
          style={{ width: imageDimensions?.width, height: imageDimensions?.height, ...imageStyles }}>
          <img
            src={src}
            className={`object-contain h-full w-full `}
            ref={imageRef}
            onClick={handlePopUpImageClick}
            onMouseMove={handleImageDrag}
            alt={alt}
            style={imageTrasnform}

          />
        </div>


        <p className={` lg:text-lg lg:min-w-[300px]  lg:flex-grow basis-0 px-auto break-words  lg:mx-5  text-center  cursor-default  ${imageClicked ? 'hidden' : ''}`} ref={captionRef}>
          {children}
        </p>


      </div>
      <button aria-label="close popup" className="absolute right-0 top-0 mr-5 mt-1 text-3xl">
        &times;
      </button>
    </div>
  );
};

export default StoryImagePopup;
