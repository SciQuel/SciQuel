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
      console.log("New contributor added:", newContributor);
      setNewContributor(""); // clear field after hitting enter
    }
  };

  // maybe add a deleteContributor function !!

  // tried to make this work with FormInput but was having trouble with the fields
  // didn't want to change FormInput so left it like this
  return (
    <div className="my-5 flex flex-col">
      <label className="flex flex-col">
        Contributor Name
        <input
          type="text"
          value={newContributor}
          onChange={(e) => setNewContributor(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Contributor Name"
          className="custom_input mt-1"
        />
      </label>
    </div>
  );
}
