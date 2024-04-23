"use client";

import axios from "axios";
import React, { useRef, useState, type PropsWithChildren } from "react";

interface Props {
  id: string;
}

const SentenceBox = ({ children }: PropsWithChildren) => {
  return <span className="rounded border-2 p-1">{children}</span>;
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
        new submission
      </button>
    </div>
  ) : (
    <form
      className="flex flex-col gap-2 rounded border-2 border-slate-400 p-2"
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
          const formData = new FormData();
          formData.append("word", word);
          formData.append("definition", definition);
          formData.append("exampleSentences", JSON.stringify(exSentences));
          formData.append("alternativeSpellings", JSON.stringify(altSpells));
          formData.append("storyId", id);

          formData.append("wordAudio", wordAudio, wordAudio.name);
          formData.append("definitionAudio", defAudio, defAudio.name);
          formData.append("usageAudio", useAudio, useAudio.name);

          axios
            .post("/api/stories/definitions", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              console.log(response);
              setDone(true);
            })
            .catch((err) => {
              console.error(err);
              setError("something went wrong");
            });
        }
      }}
    >
      <h1 className="text-2xl font-semibold">Add Dictionary Words</h1>
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
        <input
          className="rounded border-2 border-slate-500"
          type="text"
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
        className="w-fit rounded border-2 border-slate-900 bg-white p-1"
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
      <div>
        {exSentences.map((sentence) => (
          <SentenceBox key={`ex-sentence-${sentence}`}>{sentence}</SentenceBox>
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
        className="w-fit rounded border-2 border-slate-900 bg-white p-1"
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
      <div>
        {altSpells.map((sentence) => (
          <SentenceBox key={`alt-spellings-${sentence}`}>
            {sentence}
          </SentenceBox>
        ))}
      </div>
      <div>
        {error ? (
          <p className="rounded border-2 border-red-900 bg-red-200">{error}</p>
        ) : (
          <></>
        )}
      </div>

      <button
        type="submit"
        className="w-fit rounded border-2 border-slate-900 bg-white p-1"
      >
        Submit Form
      </button>
    </form>
  );
}
