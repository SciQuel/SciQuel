import React, { useState } from "react";

type Props = {
  // function to add a new contributor field
  addContributor: (contributor: string) => void;
};

/**
 * NewContributor Component
 *
 * This component allows users to add a new contributor to the list by typing the name and pressing Enter.
 *
 * @param {function} addContributor - Function to add a new contributor to the list.
 * @returns The rendered component as a JSX eleent.
 */
export default function NewContributor({ addContributor }: Props) {
  const [newContributor, setNewContributor] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newContributor.trim() !== "") {
      e.preventDefault();
      addContributor(newContributor);
      setNewContributor(""); // clear field after hitting enter
    }
  };

  // creates the contributor component
  return (
    <div className="my-5 flex flex-col">
      <label className="flex flex-col">
        Contributor Name
        <input
          type="text"
          value={newContributor}
          onChange={(e) => setNewContributor(e.target.value)} // update with input value
          onKeyPress={handleKeyPress}
          placeholder="Contributer Name"
          className="custom_input mt-1" // css styling
        />
      </label>
    </div>
  );
}
