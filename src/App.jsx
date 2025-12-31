import React, { useState } from "react";
import Home from "./components/Home";
import CreateGroup from "./components/CreateGroup";
import AddMembers from "./components/AddMembers";
import BillEntry from "./components/BillEntry";

const App = () => {
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showBillEntry, setShowBillEntry] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);

  return (
    <div className="w-full min-h-screen">
      <Home />

      <CreateGroup
        setShowAddMembers={setShowAddMembers}
        setGroupName={setGroupName}
      />

      {showAddMembers && (
        <AddMembers
          groupName={groupName}
          setShowBillEntry={setShowBillEntry}
          setMembers={setMembers}
        />
      )}

      {showBillEntry && (
        <BillEntry groupName={groupName} members={members} />
      )}
    </div>
  );
};

export default App;
