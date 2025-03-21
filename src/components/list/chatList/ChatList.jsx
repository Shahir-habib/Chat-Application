
import { useState } from "react";
import "./ChatList.css";
import AddUser from "./addUser/AddUser";
const ChatList = () => {
    const [addMode, setAddMode] = useState(false)
    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="search" />
                    <input type="text" placeholder="Search" />

                </div>
                <img src={addMode ? "./minus.png" : "./plus.png"} alt="edit"
                    className="add"
                    onClick={() => setAddMode((prev) => !prev)}
                />
            </div>
            <div className="item">
                <img src="./avatar.png" alt="avatar" />
                <div className="texts">
                    <span>John Doe</span>
                    <p>Hey there! I am using WhatsApp.</p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="avatar" />
                <div className="texts">
                    <span>John Doe</span>
                    <p>Hey there! I am using WhatsApp.</p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="avatar" />
                <div className="texts">
                    <span>John Doe</span>
                    <p>Hey there! I am using WhatsApp.</p>
                </div>
            </div>
            {addMode  && < AddUser />}
        </div>
    )

}

export default ChatList