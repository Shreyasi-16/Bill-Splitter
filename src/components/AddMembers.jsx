import React, { useState } from "react";

const AddMembers = ({ groupName, setShowBillEntry, setMembers }) => {
  const [memberName, setMemberName] = useState("");
  const [members, setLocalMembers] = useState([]);

  const addMember = () => {
    if (!memberName.trim()) return;
    setLocalMembers([...members, memberName.trim()]);
    setMemberName("");
  };

  const removeMember = (index) => {
    setLocalMembers(members.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (members.length < 2) {
      alert("Add at least 2 members");
      return;
    }

    setMembers(members);
    setShowBillEntry(true);

    setTimeout(() => {
      document
        .getElementById("bill-entry")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <div
      id="add-members"
      className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6"
    >
      <h2 className="text-3xl font-bold text-blue-900 mb-2">
        Group: {groupName}
      </h2>

      <p className="text-gray-600 mb-8">
        Add members to start splitting the bill.
      </p>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-5">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter member name"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
          />

          <button
            onClick={addMember}
            className="bg-orange-500 text-white px-4 rounded-lg"
          >
            Add
          </button>
        </div>

        {members.map((member, index) => (
          <div
            key={index}
            className="flex justify-between bg-gray-100 px-4 py-2 rounded-lg"
          >
            <span>{member}</span>
            <button
              onClick={() => removeMember(index)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={handleContinue}
          className="mt-4 bg-blue-900 text-white py-2 rounded-full"
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

export default AddMembers;
