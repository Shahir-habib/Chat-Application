import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const Userinfo = () => {
  const { currentUser } = useUserStore();
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Handle search for users
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    try {
      const userRef = collection(db, "users");
      const q = query(
        userRef,
        where("username", ">=", searchQuery),
        where("username", "<=", searchQuery + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const usersList = [];

      querySnapshot.forEach((doc) => {
        if (doc.data().id !== currentUser.id) {
          usersList.push(doc.data());
        }
      });

      setSearchResults(usersList);
    } catch (e) {
      console.log(e);
    }
  };

  // Add a user to the selected members list
  const handleAddUser = (user) => {
    if (!selectedMembers.some((member) => member.id === user.id)) {
      setSelectedMembers((prevMembers) => [...prevMembers, user]);
    }
  };

  // Remove a user from the selected members list
  const handleRemoveUser = (userId) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== userId)
    );
  };

  // Handle group creation
  const handleGroupSubmit = async () => {
    if (!groupName || selectedMembers.length === 0) {
      alert("Please provide a group name and select at least one member.");
      return;
    }

    try {
      const groupRef = collection(db, "groups");
      const newGroup = {
        name: groupName,
        members: [currentUser.id, ...selectedMembers.map((member) => member.id)], // Include current user and selected members
        createdAt: new Date(),
        avatar: "./group.jpg",
      };

      await addDoc(groupRef, newGroup);
      alert("Group created successfully!");
      setShowGroupPopup(false);
      setGroupName("");
      setSearchQuery("");
      setSearchResults([]);
      setSelectedMembers([]);
    } catch (e) {
      console.error("Error creating group: ", e);
    }
  };

  return (
    <div className="userInfo">
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img
          src="./group.jpg"
          alt=""
          onClick={() => setShowGroupPopup(true)}
          style={{ cursor: "pointer" }}
        />
      </div>

      {showGroupPopup && (
        <div className="groupPopup">
          <div className="popupContent">
            <h3 className="popupHeader">Create Group</h3>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            {/* Search for users */}
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search users by username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            {/* Display search results */}
            {searchResults.length > 0 && (
              <div className="searchResults">
                {searchResults.map((user) => (
                  <div key={user.id} className="userResult">
                    <img src={user.avatar || "./avatar.png"} alt="User Avatar" />
                    <span>{user.username}</span>
                    <button onClick={() => handleAddUser(user)}>Add</button>
                  </div>
                ))}
              </div>
            )}

            {/* Display selected members */}
            {selectedMembers.length > 0 && (
              <div className="selectedMembers">
                <h4>Selected Members:</h4>
                <hr />
                {selectedMembers.map((member) => (
                  <div key={member.id} className="selectedMember">
                    <img src={member.avatar || "./avatar.png"} alt="User Avatar" />
                    <span>{member.username}</span>
                    <button onClick={() => handleRemoveUser(member.id)}>Remove</button>
                  </div>
                ))}
              </div>
            )}

            {/* Group creation buttons */}
            <button className="buttonGroup" onClick={handleGroupSubmit}>
              Create Group
            </button>
            <button className="buttonGroup" onClick={() => setShowGroupPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userinfo;