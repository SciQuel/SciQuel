"use client";

import { type DictionaryDefinition } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  item: DictionaryDefinition;
  closeForm: () => void;
}

export default function ListItemForm({ item, closeForm }: Props) {
  const [wordName, setWordName] = useState<string>(item.word);
  const [wordDef, setWordDef] = useState<string>(item.definition);

  const [currExSentence, setCurrExSentence] = useState("");
  const [exSentences, setExSentences] = useState(item.exampleSentences);

  const [altSpells, setAltSpells] = useState(item.alternativeSpellings);
  const [currentAltSpells, setCurrentAltSpells] = useState("");

  const [wordUpload, setWordUpload] = useState<File | null>(null);
  const [defUpload, setDefUpload] = useState<File | null>(null);
  const [inContextUpload, setInContextUpload] = useState<File | null>(null);

  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className={`[&>label]:block`}
      onSubmit={(e) => {
        e.preventDefault();
        if (dirty) {
          startTransition(async () => {
            try {
              const newFormData = new FormData();
              newFormData.append("definitionId", item.id);

              if (wordName != item.word) {
                newFormData.append("word", wordName);
              }

              if (wordDef != item.definition) {
                newFormData.append("definition", wordDef);
              }

              if (wordUpload) {
                newFormData.append("wordAudio", wordUpload);
              }

              if (defUpload) {
                newFormData.append("definitionAudio", defUpload);
              }

              if (inContextUpload) {
                newFormData.append("usageAudio", inContextUpload);
              }

              newFormData.append(
                "exampleSentences",
                JSON.stringify(exSentences),
              );

              newFormData.append(
                "alternativeSpellings",
                JSON.stringify(altSpells),
              );

              const result = await axios.patch(
                "/api/stories/definitions",
                newFormData,
              );

              console.log(result);

              if (result.status == 200) {
                setError("");
                setDirty(false);
                closeForm();
                router.refresh();
              } else {
                setError(`error ${result.status}. Please try again later.`);
              }
            } catch (err) {
              setError(`unknown error. Please try again later.`);
              console.error(err);
            }
          });
        } else {
          setError("No unsaved changes");
        }
      }}
    >
      {dirty ? (
        <p
          className={`my-2 rounded border-2
        border-red-800 bg-red-100 px-3 py-2 text-red-950`}
        >
          You may have unsaved changes
        </p>
      ) : null}
      <label>
        <strong>Name: </strong>
        <input
          className={`m-1 rounded border-2 border-slate-600 px-1 invalid:border-red-600`}
          type="text"
          required
          minLength={1}
          value={wordName}
          onChange={(e) => {
            setDirty(true);
            setWordName(e.target.value);
          }}
        />
      </label>
      <label>
        <strong>Definition:</strong>
        <textarea
          required
          value={wordDef}
          className={`m-1 block w-full rounded 
          border-2 border-slate-600
          px-1 invalid:border-red-600`}
          onChange={(e) => {
            setWordDef(e.target.value);
            setDirty(true);
          }}
        />
      </label>
      <label>
        <strong>Add example sentence:</strong>
        <textarea
          className={`m-1 block w-full rounded 
          border-2 border-slate-600
          px-1 invalid:border-red-600`}
          value={currExSentence}
          onChange={(e) => {
            setCurrExSentence(e.target.value);
          }}
        />
      </label>
      <button
        type="button"
        className={`my-2 w-fit rounded bg-sciquelTeal px-2 py-1 text-white`}
        onClick={() => {
          if (currExSentence.length > 0) {
            setExSentences((state) => {
              return [...state, currExSentence];
            });
            setCurrExSentence("");
            setDirty(true);
          }
        }}
      >
        Add new example sentence
      </button>
      <p>
        <strong>Example sentences:</strong>
      </p>
      <ul className={`list-inside list-disc`}>
        {exSentences.map((sentence, sIndex) => (
          <li
            key={`${sentence}-${sIndex}`}
            className="mb-2 flex flex-row flex-wrap justify-between"
          >
            {sentence}
            <button
              type="button"
              onClick={() => {
                setExSentences((state) => {
                  const temp = [...state];
                  temp.splice(sIndex, 1);
                  return temp;
                });
              }}
              className={`rounded bg-red-900 px-2 py-1 font-bold text-white`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <label>
        <strong>Add alternate spelling:</strong>
        <textarea
          className={`m-1 block w-full rounded 
          border-2 border-slate-600
          px-1 invalid:border-red-600`}
          value={currentAltSpells}
          onChange={(e) => {
            setCurrentAltSpells(e.target.value);
          }}
        />
      </label>
      <button
        type="button"
        className={`my-2 w-fit rounded bg-sciquelTeal px-2 py-1 text-white`}
        onClick={() => {
          if (currentAltSpells.length > 0) {
            setAltSpells((state) => {
              return [...state, currentAltSpells];
            });
            setCurrentAltSpells("");
            setDirty(true);
          }
        }}
      >
        Add new alternate spelling
      </button>
      <p>
        <strong>Alt spellings</strong>
      </p>
      <ul className={`list-inside list-disc`}>
        {altSpells.map((spelling, sIndex) => (
          <li
            key={`${spelling}-${sIndex}`}
            className="mb-2 flex flex-row flex-wrap justify-between"
          >
            {spelling}{" "}
            <button
              type="button"
              className={`rounded bg-red-900 px-2 py-1 font-bold text-white`}
              onClick={() => {
                setAltSpells((state) => {
                  const temp = [...state];
                  temp.splice(sIndex, 1);
                  return temp;
                });
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>
        <strong>Audio</strong>
      </p>
      <div className="border-b-2 border-slate-500 pb-3">
        {" "}
        {item.wordAudioUrl ? (
          <figure>
            <figcaption>{item.word} pronounciation (current)</figcaption>
            <audio controls src={item.wordAudioUrl} />
          </figure>
        ) : (
          <p>No current pronounciation audio</p>
        )}
        <label className="mb-4 mt-2">
          Upload new pronounciation audio?
          <input
            type="file"
            accept=".mp4"
            onChange={(e) => {
              setWordUpload(e.target.files?.[0] ?? null);
              setDirty(true);
            }}
          />
        </label>
        {wordUpload ? (
          <figure className="">
            <figcaption>New word pronounciation file:</figcaption>
            <audio controls src={URL.createObjectURL(wordUpload)} />
          </figure>
        ) : null}
      </div>
      <div className="border-b-2 border-slate-500 pb-3">
        {item.definitionAudioUrl ? (
          <figure>
            <figcaption>Definition sentence audio (current)</figcaption>
            <audio controls src={item.definitionAudioUrl} />
          </figure>
        ) : (
          <p>No current definition sentence audio.</p>
        )}
        <label className="mb-4 mt-2">
          Upload new definition audio?
          <input
            type="file"
            accept=".mp4"
            onChange={(e) => {
              setDefUpload(e.target.files?.[0] ?? null);
              setDirty(true);
            }}
          />
        </label>
        {defUpload ? (
          <figure className="">
            <figcaption>New definition audio file:</figcaption>
            <audio controls src={URL.createObjectURL(defUpload)} />
          </figure>
        ) : null}
      </div>
      <div className="border-b-2 border-slate-500 pb-3">
        {item.useAudioUrl ? (
          <figure>
            <figcaption>In-context sentence audio (current)</figcaption>
            <audio controls src={item.useAudioUrl} />
          </figure>
        ) : (
          <p>No current in-context sentence audio.</p>
        )}
        <label className="mb-4 mt-2">
          Upload new in-context sentence(s) audio?
          <input
            type="file"
            accept=".mp4"
            onChange={(e) => {
              setInContextUpload(e.target.files?.[0] ?? null);
              setDirty(true);
            }}
          />
        </label>
        {inContextUpload ? (
          <figure className="">
            <figcaption>New in-context sentence audio file:</figcaption>
            <audio controls src={URL.createObjectURL(inContextUpload)} />
          </figure>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className={`mt-4 rounded bg-sciquelTeal px-2 py-1 text-white 
          disabled:opacity-60`}
      >
        Update definition
      </button>
    </form>
  );
}
