"use client";

import {
  isFileNameInUse,
  singleImgUpload,
  uploadImage,
} from "@/components/EditorDashboard/StoryInfoForm/actions/actions";
import { type GetFilesResponse } from "@google-cloud/storage";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [img, setImg] = useState<File | null>(null);
  const fileName = "bobtail-squid-ink.jpg";
  const [availablility, setAvailablility] = useState<undefined | boolean>(
    undefined,
  );
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");

  async function checkFile(name: string, img: File) {
    try {
      const imgType = img.type;
      const extension =
        imgType === "image/jpeg"
          ? "jpg"
          : imgType === "image/png"
          ? "png"
          : "gif";
      const fullName = `${name}.${extension}`;
      const inUse = await isFileNameInUse(fullName);
      setAvailablility(inUse);
    } catch (err) {
      setAvailablility(undefined);
    }
  }

  async function uploadNewImage() {
    if (!img || !newName) {
      return;
    }
    try {
      const imgType = img.type;
      const extension =
        imgType === "image/jpeg"
          ? "jpg"
          : imgType === "image/png"
          ? "png"
          : "gif";
      const fullName = `${name}.${extension}`;
      const inUse = await isFileNameInUse(fullName);
      if (inUse) {
        setAvailablility(true);
      }
      const formData = new FormData();
      formData.append("data", img);
      formData.append("name", newName);
      const result = await singleImgUpload(formData);
      if (result.error) {
        console.error(result.error);
      } else if (result.url) {
        setNewUrl(result.url ?? "");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold text-teal-950">{newUrl}</h2>
      <input
        type="file"
        onChange={(e) => {
          setImg(e.target.files?.[0] ?? null);
        }}
        accept="image/jpeg, image/png, image/gif"
      />
      <div>
        {img ? (
          <img
            className="h-[50vh] w-full object-contain"
            alt="preview"
            src={URL.createObjectURL(img)}
          />
        ) : (
          <></>
        )}
      </div>

      <p>check file name:</p>
      <input
        className="block rounded border-2"
        type="text"
        value={newName}
        onChange={(e) => {
          setNewName(e.target.value);
        }}
      />
      <div className="flex flex-col items-start gap-2 py-2">
        <button
          className="rounded border-2"
          onClick={() => {
            if (newName && img) {
              checkFile(newName, img)
                .then(() => {})
                .catch((err) => {
                  setAvailablility(undefined);
                });
            }
          }}
        >
          Check File Name Availablility
        </button>
        <button
          className="rounded border-2"
          onClick={() => {
            uploadNewImage()
              .then(() => {
                console.log("uploaded");
              })
              .catch((err) => {
                console.error(err);
              });
          }}
        >
          Upload file
        </button>
      </div>
      <div>
        {availablility ? (
          <>Name In Use</>
        ) : availablility === false ? (
          <>Name Not In Use</>
        ) : (
          <>loading</>
        )}
      </div>
    </div>
  );
}
