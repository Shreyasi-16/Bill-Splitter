import React, { useState } from "react";

const CreateGroup = ({ setShowAddMembers, setGroupName }) => {
  const [groupName, setLocalGroupName] = useState("");

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    setGroupName(groupName);
    setShowAddMembers(true);

    // wait for AddMembers to render, then scroll
    setTimeout(() => {
      document
        .getElementById("add-members")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <div
      id="create-group"
      className="w-full h-screen flex flex-col justify-center items-center px-6"
    >
      <h2 className="text-3xl font-bold text-blue-900 tracking-wide">
        Start a Group to Manage Payments and Settlements Easily
      </h2>

      <div className="mt-20 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-blue-900 text-center">
          Create a Group
        </h2>

        <p className="text-sm text-gray-600 text-center">
          Give your group a name to start splitting expenses.
        </p>

        <input
          type="text"
          placeholder="e.g. Goa Trip"
          value={groupName}
          onChange={(e) => setLocalGroupName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          onClick={handleCreateGroup}
          className="bg-orange-500 text-white py-2 rounded-full font-medium hover:bg-orange-600 transition"
        >
          Create Group →
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;
