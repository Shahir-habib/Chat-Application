import "./addUser.css";

import { useState } from "react";

const AddUser = () => {
    return (
        <div className="addUser">
            <form action="">
                <input type="text" placeholder="username" name="username" />
                <button> Search</button>
            </form>
            <div className="user">
                <div className="detail">
                    <img src="./avatar.png" alt="" />
                    <span>John Doe</span>
                </div>
                <button>Add</button>
            </div>
        </div>
    )
}

export default AddUser;