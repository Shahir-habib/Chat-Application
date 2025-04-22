
import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
const ChatList = () => {
  const [addMode, setAddMode] = useState(false)
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();
  // console.log(chatId);
  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };//chats ,user who received the message
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleGroupSelect = async (group) => {
    try {
      // Validate the group object
      if (!group || !group.id) {
        console.error("Invalid group object or missing group.id:", group);
        return;
      }
  
      // Get the chat document with same ID as the group
      const chatDocRef = doc(db, "chats", group.id);
      const chatDocSnap = await getDoc(chatDocRef);
  
      if (chatDocSnap.exists()) {
        const chatData = chatDocSnap.data();
        const messages = chatData.messages || [];
  
        // Sort messages by timestamp (newest first)
        const sortedMessages = messages.sort((a, b) => 
          b.timestamp?.toMillis() - a.timestamp?.toMillis()
        );
  
        console.log("Group messages:", sortedMessages);
        setChats(sortedMessages);
        changeChat(group.id,currentUser);
      } else {
        console.log("No messages found for this group");
        setChats([]); // Set empty array if no messages exist
      }
    } catch (err) {
      console.error("Error fetching group messages:", err);
      setChats([]); // Reset on error
    }
  };

  const handleSelect = async (chat) => {

    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const [groupsList, setGroupsList] = useState([]);
  useEffect(() => {
    if (!currentUser || !currentUser.id) return; // Ensure currentUser and currentUser.id are defined

    const fetchGroups = async () => {
      try {
        const groupRef = collection(db, "groups");
        const groupQuery = query(groupRef, where("members", "array-contains", currentUser.id)); // Groups where current user is a member
        const groupSnapshot = await getDocs(groupQuery);
        const groups = groupSnapshot.docs.map((doc) => ({ ...doc.data(), isGroup: true, id: doc.id }));
        setGroupsList(groups);
        console.log(groups);
      } catch (e) {
        console.error("Error fetching chat list: ", e);
      }
    };


    fetchGroups();
  }, [currentUser]);

  const filteredChats = chats.filter((c) =>
    c.user?.username?.toLowerCase().includes(input.toLowerCase())
  );
  //console.log(chats)
  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="search" />
          <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)} />

        </div>
        <img src={addMode ? "./minus.png" : "./plus.png"} alt="edit"
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {groupsList.map((group, index) => (
        <div className="item" key={group.id || index}
          onClick={() => handleGroupSelect(group)}
        >
          <img src={group.avatar || "./group.jpg"} alt="avatar" />
          <div className="texts">
            <span>{group.name}</span>
            <p>{"Group"}</p>
          </div>
        </div>
      ))}

      {filteredChats.map((chat) => <div className="item" key={chat.chatId}
        onClick={() => handleSelect(chat)}
        style={{ backgroundColor: chat?.isSeen ? "transparent" : "lightpink" }}>
        <img src={"./avatar.png"} alt="avatar" />
        <div className="texts">
          <span>{chat?.user?.username}</span>
          <p>{chat?.lastMessage}</p>
        </div>
      </div>
      )}
      {addMode && < AddUser />}
    </div>
  )

}

export default ChatList