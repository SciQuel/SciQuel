import React, { useState } from "react";

type Props = {
  addContributor: (contributor: string) => void;
};

export default function NewContributor({ addContributor }: Props) {
  const [newContributor, setNewContributor] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newContributor.trim() !== "") {
      e.preventDefault();
      addContributor(newContributor);
      setNewContributor("");
    }
  };

  return (
    <div className="my-5 flex flex-col">
      <label className="flex flex-col">
        Contributor Name
        <input
          type="text"
          value={newContributor}
          onChange={(e) => setNewContributor(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter contributor name..."
          className="custom_input mt-1"
        />
      </label>
    </div>
  );
}
