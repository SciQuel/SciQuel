import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type PropsWithChildren,
  type RefObject,
} from "react";

interface Props {
  src: string;
  handleClick: (e: MouseEvent<HTMLDivElement>) => void;
  alt?: string;
  captionRef: RefObject<HTMLParagraphElement>;
  isClicked: boolean;
  setIsClicked: (isClicked: boolean) => void;
  isMobile: boolean;
  isSmallMargin: boolean;
}

const StoryImagePopup = ({
  src,
  children,
  captionRef,
  alt,
  isClicked,
  setIsClicked,
  isMobile,
}: PropsWithChildren<Props>) => {
  const [imageClicked, setImageClicked] = useState(false);
  const [transformOriginPosition, setTransformOriginPosition] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [dragging, setDragging] = useState(false);
  const [scaleLevel, setScaleLevel] = useState(1);
  const [isSmallScreen, setisSmallScreen] = useState(window.innerWidth <= 768);
  const [isMediumScreen, setisMediumScreen] = useState(
    window.innerWidth <= 1024,
  );
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isImageReady, setIsImageReady] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const wasDragged = useRef(false);

  const resizeImage = () => {
    const MAX_WIDTH = isSmallScreen
      ? window.innerWidth * 0.95
      : isMediumScreen
      ? 700
      : 800;
    const MAX_HEIGHT = isSmallScreen
      ? 630
      : isMediumScreen
      ? 700
      : window.innerHeight * 0.97;

    const MIN_SIZE = window.innerWidth * 0.98;

    if (imageRef.current) {
      const img = imageRef.current;
      const { naturalWidth: width, naturalHeight: height } = img;
      let newWidth = width;
      let newHeight = height;

      if (height > MAX_HEIGHT || width > MAX_WIDTH) {
        const heightRatio = MAX_HEIGHT / height;
        const widthRatio = MAX_WIDTH / width;
        const resizeRatio = Math.min(heightRatio, widthRatio);

        newWidth = width * resizeRatio;
        newHeight = height * resizeRatio;
      } else if (width <= MIN_SIZE || height <= MIN_SIZE) {
        const widthRatio = MAX_WIDTH / width;
        const heightRatio = MAX_HEIGHT / height;
        const resizeRatio = Math.min(widthRatio, heightRatio);

        newWidth = width * resizeRatio;
        newHeight = height * resizeRatio;
      }

      const commonWidth = Math.min(newWidth, MAX_WIDTH);
      newWidth = commonWidth;

      setImageDimensions({ width: newWidth, height: newHeight });
      setIsImageReady(true);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsClicked(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "scroll";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsClicked]);

  const handleResize = () => {
    resizeImage();
    setisSmallScreen(window.innerWidth <= 768);
    setisMediumScreen(window.innerWidth <= 1024);
  };

  const handleImageLoad = () => {
    resizeImage();
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", handleResize);

    if (imageRef.current) {
      imageRef.current.addEventListener("load", handleImageLoad);
    }

    if (imageRef.current && imageRef.current.complete) {
      handleImageLoad();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (imageRef.current) {
        imageRef.current.removeEventListener("load", handleImageLoad);
      }
    };
  }, [imageRef, isMediumScreen, isSmallScreen]);

  const handlePopUpImageClick = () => {
    if (!isMobile && !wasDragged.current) {
      setScaleLevel(3);
      setImageClicked(true);
    }
    wasDragged.current = false; // Reset wasDragged after click
  };

  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
    const divTarget = e.target as HTMLDivElement;
    if (isClicked) {
      if (
        imageRef.current &&
        !imageRef.current.contains(divTarget) &&
        captionRef.current &&
        !captionRef.current.contains(divTarget)
      ) {
        setIsClicked(false);
      }
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => {
    if (imageClicked) {
      setDragging(true);
      wasDragged.current = false; // Reset wasDragged on mouse down
      const divTarget = e.target as HTMLImageElement;
      const x = e.clientX - divTarget.offsetLeft;
      const y = e.clientY - divTarget.offsetTop;
      setTransformOriginPosition({ x, y });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    if (dragging) {
      wasDragged.current = true; // Set wasDragged to true on mouse move
      const divTarget = e.target as HTMLImageElement;
      const x = e.clientX - divTarget.offsetLeft;
      const y = e.clientY - divTarget.offsetTop;
      setTransformOriginPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
      setScaleLevel(1);
      setTransformOriginPosition({ x: null, y: null });

      // Delay setting imageClicked to false to avoid immediate onClick
      setTimeout(() => {
        setImageClicked(false);
      }, 0);
    }
  };

  const transformOriginValue =
    transformOriginPosition.x !== null
      ? `${transformOriginPosition.x}px ${transformOriginPosition.y}px`
      : "center center";
  const transformValue = imageClicked ? `scale(${scaleLevel})` : "none";

  const imageTransform = {
    transformOrigin: transformOriginValue,
    transform: transformValue,
  };
  const imageStyles = {
    cursor: imageClicked ? (dragging ? "grabbing" : "grab") : "zoom-in",
    display: isImageReady ? "block" : "none",
  };

  return (
    <div
      className={`fixed left-1/2 top-1/2  z-50 flex h-[100dvh] w-screen -translate-x-1/2 -translate-y-1/2 transform flex-col justify-center overflow-hidden bg-white py-3    hover:cursor-pointer`}
      onClick={handleOutsideClick}
    >
      <div
        className={`z-0 mx-7 flex h-full max-h-full w-auto flex-col  items-center justify-center  sm:py-5 lg:flex-row lg:py-0     ${
          imageClicked && "justify-center"
        }`}
      >
        {!imageClicked && (
          <div className="  invisible hidden h-[100px] flex-grow basis-[10px] bg-black lg:mx-5 lg:block">
            {" "}
          </div>
        )}

        <div
          className="bg-red h-md:max-h-full flex max-h-[100%] max-w-full  justify-center   "
          style={{
            width: imageDimensions?.width,
            height: imageDimensions?.height,
          }}
        >
          <Image
            src={src}
            alt={alt || ""}
            unoptimized
            width={1}
            height={1}
            sizes="100vw"
            className="max-h-full max-w-full object-contain"
            ref={imageRef}
            onClick={handlePopUpImageClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDragStart={(e) => e.preventDefault()}
            style={{ ...imageStyles, ...imageTransform }}
          />
        </div>

        <p
          className={`px-auto mx-5  flex-shrink basis-0 cursor-text break-words  text-left  lg:mx-5 lg:w-auto  lg:flex-grow  lg:text-lg  ${
            imageClicked ? "hidden" : ""
          }`}
          ref={captionRef}
        >
          {children}
        </p>
      </div>
      <button
        aria-label="close popup"
        className="absolute right-0 top-0 z-[-1] mr-2 mt-[-0.3rem] text-3xl"
      >
        &times;
      </button>
    </div>
  );
};

export default StoryImagePopup;
