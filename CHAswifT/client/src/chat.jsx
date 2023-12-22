import { useContext, useEffect, useState } from "react"
import Avatar from "./Avatar";
import { UserContext } from "./UserContext";

export default function Chat(){
    const [ws,setWs] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [selectedUserId, setSelectedUserId ] = useState(null);
    const {username, id} = useContext(UserContext);
    useEffect(() =>{
        const ws = new WebSocket('ws://localhost:4040');
        setWs(ws);
        ws.addEventListener('message', handleMessage)
    },[]);

    function showOnlineUsers(usersArray){
        const users = {};
        usersArray.forEach(({userId,username}) => {
            users[userId] = username;
        });
        setOnlineUsers(users);
    }
    function handleMessage(e){
        const messageData = JSON.parse(e.data);
        if('online' in messageData){
            showOnlineUsers(messageData.online);
        }
    }

    function selectContact(userId){
        setSelectedUserId
    }

    const excludeMainUser = {...onlineUsers};
    delete excludeMainUser[id];

    return(
        <div className="flex h-screen" >
        
        {/* Showing online users  */}
        <div className="bg-white w-1/3">
            <div className="text-blue-950 font-bold flex gap-2 mb-4 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                CHAswifT
                
            </div>
            {Object.keys(excludeMainUser).map(userId =>(
                <div key={userId} onClick={() => setSelectedUserId(userId)} 
                className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer"+(userId === selectedUserId ? 'bg-blue-50': '')}>
                    {userId === selectedUserId && (
                        <div className="w-1 h-12 bg-blue-500 rounded-r-md"></div>
                    )}
                    <div className="flex gap-2 py-2 pl-4 items-center">
                        <Avatar username={onlineUsers[userId]} userId={userId}/>
                        <span className="text-gray-800">{onlineUsers[userId]}</span>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex flex-col bg-blue-50 w-2/3 p-2">
            <div className="flex-grow">
                {!selectedUserId && (
                    <div className="flex h-full flex-grow items-center justify-center">
                        <div className="text-gray-400">&larr; Mesajlaşmak için bir kullanıcı seçin</div>
                    </div>
                )}</div>
            <div className="flex gap-2 ">
                <input type="text"
                placeholder="Mesajınızı buraya yazın"
                className="bg-white flex-grow border rounded-sm p-2" />
                <button className="bg-blue-500 p-2 text-white rounded-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
</svg>
</button>
            </div>
        </div>  
        </div>
    )
}
