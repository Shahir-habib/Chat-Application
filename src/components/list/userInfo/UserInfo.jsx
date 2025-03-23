import "./userInfo.css"
import { useUserStore } from "../../../lib/userStore";
import { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const Userinfo = () => {

  const { currentUser } = useUserStore();

  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState("");

  const handleGroupSubmit = () => {
    console.log("Group Name:", groupName);
    console.log("Users:", users);
    // Add logic to create a group chat
    setShowGroupPopup(false);
    setGroupName("");
    setUsers("");
  };

  return (
    <div className='userInfo'>
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
            <input 
              type="text" 
              placeholder="Add Users (comma-separated)" 
              value={users} 
              onChange={(e) => setUsers(e.target.value)} 
            />
            <button className="buttonGroup" onClick={handleGroupSubmit}>Create</button>
            <button className="buttonGroup"  onClick={() => setShowGroupPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Userinfo