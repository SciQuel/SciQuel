"use client";

import { type DictionaryDefinition } from "@prisma/client";
import { useState } from "react";
import ListItemForm from "./ListItemForm";

interface Props {
  definition: DictionaryDefinition;
}

export default function DictionaryListItem({ definition }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <h3 className="flex flex-row flex-wrap justify-between">
        {definition.word}
        <button
          onClick={() => {
            setIsEditing((state) => !state);
          }}
          className={`mx-2 rounded bg-sciquelTeal px-2
            py-1 text-white`}
          type="button"
        >
          {isEditing ? "stop editing without saving" : "Edit word"}
        </button>
      </h3>
      {isEditing ? (
        <ListItemForm
          closeForm={() => {
            setIsEditing(false);
          }}
          item={definition}
        />
      ) : (
        <>
          <p>
            <strong>Definition:</strong> {definition.definition}
          </p>
          <p>
            <strong>Example sentences:</strong>
          </p>
          <ul className={`list-inside list-disc`}>
            {definition.exampleSentences.map((sentence, sIndex) => (
              <li key={`${sentence}-${sIndex}`}>{sentence}</li>
            ))}
          </ul>
          <p>
            <strong>Alt spellings</strong>
          </p>
          <ul className={`list-inside list-disc`}>
            {definition.alternativeSpellings.map((spelling, sIndex) => (
              <li key={`${spelling}-${sIndex}`}>{spelling}</li>
            ))}
          </ul>
          <p>
            <strong>Audio</strong>
          </p>
          {definition.wordAudioUrl ? (
            <figure>
              <figcaption>{definition.word} pronounciation</figcaption>
              <audio controls src={definition.wordAudioUrl} />
            </figure>
          ) : (
            <p>No pronounciation audio</p>
          )}
          {definition.definitionAudioUrl ? (
            <figure>
              <figcaption>Definition sentence audio</figcaption>
              <audio controls src={definition.definitionAudioUrl} />
            </figure>
          ) : (
            <p>No definition sentence audio.</p>
          )}
          {definition.useAudioUrl ? (
            <figure>
              <figcaption>In-context usage audio</figcaption>
              <audio controls src={definition.useAudioUrl} />
            </figure>
          ) : (
            <p>No in-context usage audio.</p>
          )}
        </>
      )}
    </>
  );
}
