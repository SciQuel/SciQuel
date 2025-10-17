"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type PropsWithChildren } from "react";

interface Props {
  id: string;
}

interface SentenceProps {
  deleteFunc: () => void;
}

const SentenceBox = ({
  children,
  deleteFunc,
}: PropsWithChildren<SentenceProps>) => {
  return (
    <p className="rounded border-2 border-slate-400 p-1">
      {children}
      <button className="px-2" type="button" onClick={deleteFunc}>
        X
      </button>
    </p>
  );
};

export default function DictionaryDefinitionForm({ id }: Props) {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");

  const [currentExSentence, setCurrentExSentence] = useState("");
  const [exSentences, setExSentences] = useState<string[]>([]);

  const [currentAltSpells, setCurrentAltSpells] = useState("");
  const [altSpells, setAltSpells] = useState<string[]>([]);

  const [wordAudio, setWordAudio] = useState<File | string | null>();
  const wordRef = useRef<HTMLInputElement>(null);

  const defRef = useRef<HTMLInputElement>(null);
  const [defAudio, setDefAudio] = useState<File | string | null>();

  const usageRef = useRef<HTMLInputElement>(null);
  const [useAudio, setUseAudio] = useState<File | string | null>();

  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return done ? (
    <div>
      <p>Thank you for your submission.</p>
      <button
        onClick={() => {
          setWord("");
          setDefinition("");

          setCurrentExSentence("");
          setExSentences([]);

          setCurrentAltSpells("");
          setAltSpells([]);

          setWordAudio(null);
          setDefAudio(null);
          setUseAudio(null);

          setError("");
          setDone(false);
        }}
      >
        New Submission
      </button>
    </div>
  ) : (
    <div className="flex flex-row flex-wrap gap-5">
      <form
        className="flex flex-col gap-2 rounded border-2 border-slate-400 p-2 lg:max-w-[50%]"
        onSubmit={(e) => {
          e.preventDefault();

          if (
            !word ||
            !definition ||
            exSentences.length < 1 ||
            !(wordAudio instanceof File) ||
            !(defAudio instanceof File) ||
            !(useAudio instanceof File)
          ) {
            setError(
              "Please add all required fields (word, definition, at least one example sentence, and all files).",
            );
          } else {
            startTransition(async () => {
              const formData = new FormData();
              formData.append("word", word);
              formData.append("definition", definition);
              formData.append("exampleSentences", JSON.stringify(exSentences));
              formData.append(
                "alternativeSpellings",
                JSON.stringify(altSpells),
              );
              formData.append("storyId", id);

              formData.append("wordAudio", wordAudio, wordAudio.name);
              formData.append("definitionAudio", defAudio, defAudio.name);
              formData.append("usageAudio", useAudio, useAudio.name);

              const res = await axios.post(
                "/api/stories/definitions",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                },
              );

              if (res.status != 201) {
                setError(`Error code: ${res.status}`);
              } else {
                setDone(true);
                setError("");
                router.refresh();
              }
            });
          }
        }}
      >
        <h2 className="text-2xl font-semibold">Add Dictionary Words</h2>
        <label>
          Word:{" "}
          <input
            className="rounded border-2 border-slate-500"
            type="text"
            value={word}
            onChange={(e) => {
              setWord(e.target.value);
            }}
          />
        </label>
        <label>
          Definition:{" "}
          <textarea
            className="block w-full rounded border-2 border-slate-500"
            value={definition}
            onChange={(e) => {
              setDefinition(e.target.value);
            }}
          />
        </label>

        <label>
          Word Audio:{" "}
          <input
            onChange={(e) => {
              setWordAudio(e.target.files?.[0] ?? null);
            }}
            ref={wordRef}
            accept=".mp4"
            type="file"
          />
        </label>

        <label>
          Definition Audio:{" "}
          <input
            onChange={(e) => {
              setDefAudio(e.target.files?.[0] ?? null);
            }}
            ref={defRef}
            accept=".mp4"
            type="file"
          />
        </label>

        <label>
          Usage Example Sentence Audio:{" "}
          <input
            onChange={(e) => {
              setUseAudio(e.target.files?.[0] ?? null);
            }}
            ref={usageRef}
            accept=".mp4"
            type="file"
          />
        </label>

        <label>
          Add Example Sentences:{" "}
          <input
            className="rounded border-2 border-slate-500"
            type="text"
            value={currentExSentence}
            onChange={(e) => {
              setCurrentExSentence(e.target.value);
            }}
          />
        </label>
        <button
          type="button"
          className="w-fit rounded border-2 border-slate-900 bg-sciquelTeal p-1 text-white"
          onClick={() => {
            setExSentences((state) => {
              const newState = [...state];
              newState.push(currentExSentence);
              return newState;
            });
            setCurrentExSentence("");
          }}
        >
          Add sentence
        </button>
        <div className="flex flex-row flex-wrap gap-3">
          {exSentences.map((sentence, sIndex) => (
            <SentenceBox
              deleteFunc={() => {
                const newList = [...exSentences];
                newList.splice(sIndex, 1);
                setExSentences(newList);
              }}
              key={`ex-sentence-${sentence}`}
            >
              {sentence}
            </SentenceBox>
          ))}
        </div>
        <label>
          Add Alt Spellings:{" "}
          <input
            className="rounded border-2 border-slate-500"
            type="text"
            value={currentAltSpells}
            onChange={(e) => {
              setCurrentAltSpells(e.target.value);
            }}
          />
        </label>
        <button
          className="w-fit rounded border-2 border-slate-900 bg-sciquelTeal p-1 text-white"
          type="button"
          onClick={() => {
            setAltSpells((state) => {
              const newState = [...state];
              newState.push(currentAltSpells);
              return newState;
            });
            setCurrentAltSpells("");
          }}
        >
          Add spelling
        </button>
        <div className="flex flex-row flex-wrap gap-3">
          {altSpells.map((sentence, sIndex) => (
            <SentenceBox
              deleteFunc={() => {
                const newList = [...altSpells];
                newList.splice(sIndex, 1);
                setAltSpells(newList);
              }}
              key={`alt-spellings-${sentence}`}
            >
              {sentence}
            </SentenceBox>
          ))}
        </div>
        <div>
          {error ? (
            <p className="rounded border-2 border-red-900 bg-red-200">
              {error}
            </p>
          ) : (
            <></>
          )}
        </div>
        {isPending ? <p>Uploading definition...</p> : null}
        <button
          disabled={isPending}
          type="submit"
          className={`w-full rounded border-2
             border-slate-900 bg-sciquelTeal
              p-1 text-white disabled:opacity-60`}
        >
          Submit Form
        </button>
      </form>
      <div className="flex flex-1 flex-col gap-2 rounded border-2 border-slate-400 p-2">
        <h2 className="text-2xl font-semibold">Preview of New Word:</h2>
        <h3>
          <strong>Name:</strong> {word}
        </h3>
        <p>
          <strong>Definition: </strong> {definition}
        </p>
        <h4 className="font-bold">Example sentences</h4>
        <ol className={`flex list-inside list-decimal flex-col gap-2 pl-4`}>
          {exSentences.map((sentence, sIndex) => (
            <li key={`${sentence}-${sIndex}`}>
              {sentence}{" "}
              <button
                type="button"
                onClick={() => {
                  const newSentenceList = [...exSentences];
                  newSentenceList.splice(sIndex, 1);
                  setExSentences(newSentenceList);
                }}
                className={`mx-2 rounded-lg bg-sciquelTeal
                 px-3 py-1 font-bold text-white`}
              >
                X{" "}
                <span className="sr-only">
                  Remove this sentence: {sentence}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <h4 className="font-bold">Alternate spellings:</h4>
        <ol className={`flex list-inside list-decimal flex-col gap-2 pl-4`}>
          {altSpells.map((spelling, sIndex) => (
            <li key={`${spelling}-${sIndex}`}>
              {spelling}{" "}
              <button
                type="button"
                onClick={() => {
                  const newSentenceList = [...altSpells];
                  newSentenceList.splice(sIndex, 1);
                  setAltSpells(newSentenceList);
                }}
                className={`mx-2 rounded-lg bg-sciquelTeal
                 px-3 py-1 font-bold text-white`}
              >
                X{" "}
                <span className="sr-only">
                  Remove this spelling: {spelling}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <h4 className="font-bold">Audio</h4>
        {wordAudio instanceof File ? (
          <figure>
            <figcaption>
              <strong>Word audio</strong>
            </figcaption>
            <audio controls src={URL.createObjectURL(wordAudio)}></audio>
          </figure>
        ) : (
          <p>No word audio</p>
        )}
        {defAudio instanceof File ? (
          <figure>
            <figcaption>
              <strong>Definition audio</strong>
            </figcaption>
            <audio controls src={URL.createObjectURL(defAudio)}></audio>
          </figure>
        ) : (
          <p>No definition audio</p>
        )}
        {useAudio instanceof File ? (
          <figure>
            <figcaption>
              <strong>Example sentence audio</strong>
            </figcaption>
            <audio controls src={URL.createObjectURL(useAudio)}></audio>
          </figure>
        ) : (
          <p>No example sentence audio</p>
        )}
      </div>
    </div>
  );
}
