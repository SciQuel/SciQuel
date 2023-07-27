import axios from "axios";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import AvatarEditorCanvas from "react-avatar-editor";
import Avatar from ".";
import Alert from "../Alert";

interface Props {
  labelId: string;
  descriptionId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function AvatarEditorModal({
  labelId,
  descriptionId,
  setIsOpen,
  setLoading: setOuterLoading,
}: Props) {
  const session = useSession();
  const [selected, setSelected] = useState<"default" | "database" | "custom">(
    session?.data?.user.image ? "database" : "default",
  );
  const [uploadOpen, setUploadOpen] = useState(false);
  const [image, setImage] = useState<string | File>("");
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef<AvatarEditorCanvas>(null);

  const combinedSetLoading = useCallback(
    (value: boolean) => {
      setLoading(value);
      setOuterLoading(value);
    },
    [setLoading, setOuterLoading],
  );

  const submitHandler = useCallback(() => {
    if (editorRef.current && selected === "custom") {
      combinedSetLoading(true);
      const scaledCanvas = editorRef.current.getImageScaledToCanvas();
      scaledCanvas.toBlob((blob) => {
        if (blob) {
          const formData = new FormData();
          const file = new File([blob], "image.png");
          formData.append("file", file, file.name);
          axios
            .put("/api/user/profile/image", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.status === 201) {
                setIsOpen(false);
              }
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              combinedSetLoading(false);
            });
        }
      });
    } else {
      setIsOpen(false);
    }
  }, []);

  const willDisplayWarning =
    session.data?.user.image && selected !== "database";

  return (
    <div className={clsx(loading && "pointer-events-none opacity-40")}>
      <div className="flex flex-col p-4">
        <h2 id={labelId} className="text-lg font-semibold">
          Edit your profile picture
        </h2>
        <p id={descriptionId}>
          Choose the default avatar or upload your own image
        </p>
      </div>
      <hr />
      <div className="flex flex-col p-4">
        <div className="flex flex-row gap-3">
          <Avatar
            label={session.data?.user.firstName[0]}
            className={clsx(
              "ring-4",
              selected === "default"
                ? "ring-cyan-500"
                : "cursor-pointer ring-transparent hover:ring-cyan-300",
            )}
            onClick={() => {
              setSelected("default");
              setUploadOpen(false);
            }}
          />
          <Avatar
            imageUrl={session.data?.user.image ?? undefined}
            className={clsx(
              "ring-4",
              selected === "database"
                ? "ring-cyan-500"
                : "cursor-pointer ring-transparent hover:ring-cyan-300",
            )}
            onClick={() => {
              setSelected("database");
              setUploadOpen(false);
            }}
          />
          <Avatar
            label="+"
            className={clsx(
              "bg-blue-500 pb-[0.1rem] text-white ring-4",
              selected === "custom"
                ? "ring-cyan-500"
                : "cursor-pointer ring-transparent hover:ring-cyan-300",
            )}
            onClick={() => {
              setSelected("custom");
              setUploadOpen(true);
            }}
          />
        </div>
      </div>
      <div className="px-4">
        <div
          className={clsx(
            "overflow-hidden transition-all duration-300",
            willDisplayWarning ? "pb-4" : "p-0",
          )}
        >
          <div
            className={clsx(
              "transition-all duration-300",
              willDisplayWarning ? "h-8" : "h-0",
            )}
          >
            <Alert type="warn">
              Your old photo will be permanently deleted when you submit!
            </Alert>
          </div>
        </div>
      </div>
      <hr
        className={clsx(
          "delay-250 transition-all",
          uploadOpen ? "border-t" : "border-0",
        )}
      />
      <div className="px-4">
        <div
          className={clsx(
            "overflow-hidden transition-all duration-300",
            uploadOpen ? "py-4" : "p-0",
          )}
        >
          <div
            className={clsx(
              "flex flex-col gap-2 transition-all duration-300",
              uploadOpen ? "h-96" : "h-0",
            )}
          >
            <div className="flex flex-row gap-4">
              <AvatarEditorCanvas
                ref={editorRef}
                width={288}
                height={288}
                image={image}
                scale={scale}
                rotate={rotation}
                borderRadius={144}
              />
              <div className="flex w-full flex-col">
                <label htmlFor="image-scale">Scale: {scale}x</label>
                <input
                  id="image-scale"
                  type="range"
                  value={scale}
                  min={0.1}
                  step={0.1}
                  max={4}
                  onChange={(e) => setScale(e.target.valueAsNumber)}
                />
                <label htmlFor="rotate-scale">Rotation: {rotation}&deg;</label>
                <input
                  id="rotate-scale"
                  type="range"
                  value={rotation}
                  min={0}
                  step={1}
                  max={359}
                  onChange={(e) => setRotation(e.target.valueAsNumber)}
                />
              </div>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(event) => setImage(event.target.files?.[0] ?? "")}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-row gap-2 p-4">
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-md bg-red-500 px-3 py-2 font-semibold text-white hover:bg-red-600"
        >
          Cancel
        </button>
        <button
          onClick={submitHandler}
          className={`rounded-md bg-blue-500 px-3 py-2 font-semibold text-white
            hover:bg-blue-600 disabled:pointer-events-none disabled:opacity-40`}
          disabled={selected === "custom" && image === ""}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
