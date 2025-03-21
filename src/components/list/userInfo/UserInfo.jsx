import "./userInfo.css";

const UserInfo = () => {
    return (
        <div className="userInfo">
            <div className="user">
                <img src = "./avatar.png" alt = "user" />
                <div className="userDetails">
                    <h3>John Doe</h3>
                </div>
             </div>
            <div className="icons"> 
            <img src = "./more.png" alt = "more" />
            <img src = "./video.png" alt = "search" />
            <img src = "./edit.png" alt = "notification" />
            </div>
        </div>
    );
    }

export default UserInfo;