import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
    const [user, setUser] = useState(null);
    const { currentUser } = useUserStore();
    const handleSearch = async (e) => {
        e.preventDefault();
        setUser(null);
        const formData = new FormData(e.target);
        const username = formData.get("username");
        //console.log(username + " Input");
        try {
            const userRef = collection(db, "users");
            //Create a query 
            let q;
            if (username) {
                q = query(userRef, where("username", ">=", username), where("username", "<=", username + "\uf8ff"));
            }
            let querySnapshot = await getDocs(q);
            
            if (querySnapshot.size == 0) {
                {
                    q = query(userRef); // Fetch all users if no username is provided
                    querySnapshot = await getDocs(q);
                }
            }
            querySnapshot.forEach((doc) => {
                //console.log(doc.id, " => ", doc.data());
                if(doc.data().id != currentUser.id)
                    setUser((prevUser) => prevUser ? [...prevUser, doc.data()] : [doc.data()]);
            });

        }
        catch (e) {
            console.log(e);
        }
    }

    const handleAdd = async (user) => {
        //console.log(user);
        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");
    
        try {
          const newChatRef = doc(chatRef);
    
          await setDoc(newChatRef, {
            createdAt: serverTimestamp(),
            messages: [],
          });
    
          await updateDoc(doc(userChatsRef, user.id), {
            chats: arrayUnion({
              chatId: newChatRef.id,
              lastMessage: "",
              receiverId: currentUser.id,
              updatedAt: Date.now(),
            }),
          });//adding a dummy chat by the user who is being added
    
          await updateDoc(doc(userChatsRef, currentUser.id), {
            chats: arrayUnion({
              chatId: newChatRef.id,
              lastMessage: "",
              receiverId: user.id,
              updatedAt: Date.now(),
            }),
          });//adding a dummy chat by the user who is adding          
        } catch (err) {
          console.log(err);
        }
      };
    
    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Enter username" name="username" />
                <button type="submit">Search</button>
            </form>
            {user && user.length > 0 && (
                <div className="users">
                    {user.map((u, index) => (
                        <div className="user" key={index}>
                            <div className="detail">
                                <img src={u.avatar || "./avatar.png"} alt="User Avatar" />
                                <span>{u.username || "Unknown User"}</span>
                            </div>
                            <button onClick={() => handleAdd(u)}>Add</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AddUser;