import FormInput from "@/components/Form/FormInput"; // Adjust the import path as needed
import clsx from "clsx";
import React, { useRef } from "react";

type Props = {
  image: File | string | null;
  setImage: (image: File | string | null) => void;
  caption: string;
  setCaption: (caption: string) => void;
  loading: boolean;
  setDirty: (dirty: boolean) => void;
};

const BackgroundImageForm: React.FC<Props> = ({
  image,
  setImage,
  caption,
  setCaption,
  loading,
  setDirty,
}) => {
  const fileUploadRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-5">
      <h3 className="mb-2">Background Image</h3>
      <label
        className={clsx(
          "cursor-pointer select-none rounded-md bg-teal-600 px-2 py-1 font-semibold text-white hover:bg-teal-700",
          loading && "pointer-events-none opacity-50",
        )}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            fileUploadRef.current?.click();
          }
        }}
        tabIndex={loading ? undefined : 0}
      >
        <input
          type="file"
          className="hidden"
          ref={fileUploadRef}
          onChange={(e) => {
            setDirty(true);
            setImage(e.target.files?.[0] ?? null);
          }}
          accept="image/jpeg, image/png, image/gif"
        />
        Select file to upload
      </label>
      <div className="my-5 rounded-md border bg-white p-2">
        <h3 className="mb-3 text-xl font-semibold">Image Preview</h3>
        {image && typeof image !== "string" ? (
          <>
            <p>Uploaded file: {image.name}</p>
            <div className="h-96">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(image)}
                className="h-full object-contain"
              />
            </div>
          </>
        ) : typeof image === "string" ? (
          <>
            <p>Image URL: {image}</p>
            <div className="h-96">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} className="h-full object-contain" />
            </div>
          </>
        ) : (
          <p className="italic">No image uploaded</p>
        )}
      </div>
      <FormInput
        title="Image Caption"
        required
        indicateRequired
        value={caption}
        onChange={(e) => {
          setDirty(true);
          setCaption(e.target.value);
        }}
        disabled={loading}
      />
    </div>
  );
};

export default BackgroundImageForm;
