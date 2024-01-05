import { useContext, useEffect, useState, useRef } from "react"
import Contact from "./Contact";
import Avatar from "./Avatar";
import Icon from "./Icon";
import { UserContext } from "./UserContext";
import _ from "lodash"
import axios from "axios";
import cookiejs from "js-cookie";

export default function Chat(){
    const [ws,setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId ] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const {username, id, setId, setUsername} = useContext(UserContext);
    const divUnderMessages = useRef();

    useEffect(() => {
        connectToWs();
    },[selectedUserId]);

    function connectToWs() {
        const ws = new WebSocket('ws://localhost:4040');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
          setTimeout(() => {
            console.log('Disconnected. Trying to reconnect...no');
            connectToWs();
          }, 1000);
        });
    }
      
    function showOnlinePeople(peopleArray){
        const people = {};
        peopleArray.forEach(({userId,username}) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
    }

    function handleMessage(ev){
        const messageData = JSON.parse(ev.data);
        if('online' in messageData){
            showOnlinePeople(messageData.online);
        } else if('text' in messageData) {
            if(messageData.sender == selectedUserId){
                setMessages(prev => ([...prev, {...messageData}]));
            }
        }
    }

    function logout() {
        axios.post('/logout').then(() => {
          setWs(null);
          cookiejs.remove('token');
          window.location.reload(true);
        });
      }

    const removeToken = async () => {
        try {
            await AsyncStorage.removeItem("token");
        } catch (error) {
            console.log("Renove authentication token failed :", error?.message);
        }
    };

    function sendMessage(ev){
        ev.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText,
        }));
        setNewMessageText('');
        setMessages(prev => ([...prev, {
            text:newMessageText, 
            sender: id,
            recipient: selectedUserId,
            _id: Date.now(),
        }]));
    }

    useEffect(() => {
        const div = divUnderMessages.current;
        if (div) {
            div.scrollIntoView({behaviour:'smooth', block:'end'});
        }
    },[messages]);

    useEffect(() => {
        axios.get('/people').then(res => {
          const offlinePeopleArr = res.data
            .filter(p => p._id !== id)
            .filter(p => !Object.keys(onlinePeople).includes(p._id));
          const offlinePeople = {};
          offlinePeopleArr.forEach(p => {
            offlinePeople[p._id] = p;
          });
          setOfflinePeople(offlinePeople);
        });
      }, [onlinePeople]);

    useEffect(() => {
        if (selectedUserId) {
            axios.get('/messages/'+selectedUserId).then(res =>{
                setMessages(res.data);
            });
        }
    }, [selectedUserId] );


    const excludeMainUser = {...onlinePeople};
    delete excludeMainUser[id];

    const messagesWithoutDupes = _.uniqBy(messages, '_id');

    return(
        <div className="flex h-screen bg-cover" style={{"backgroundImage": "url('../src/assets/wallpaper.png"}} >
        
        {/* Showing online users  */}
        <div className="bg-white w-1/3 flex flex-col shadow-xl rounded-xl">
            <Icon name={'logo'}/>
            <div className="flex-grow">

            {Object.keys(excludeMainUser).map(userId => (
                <Contact
                    key={userId}
                    id={userId}
                    online={true}
                    username={excludeMainUser[userId]}
                    onClick={() => {setSelectedUserId(userId);console.log({userId})}}
                    selected={userId === selectedUserId} />
          ))}
            {Object.keys(offlinePeople).map(userId => (
                <Contact
                    key={userId}
                    id={userId}
                    online={false}
                    username={offlinePeople[userId].username}
                    onClick={() => setSelectedUserId(userId)}
                    selected={userId === selectedUserId} />
          ))}
            </div>

            <div className="p-2 text-center flex items-center justify-center">
                <span className="mr-2 text-l p-1 font-bold bg-slate-800 text-white rounded-md flex">
                    <span className="mr-2 text-grey-600 flex">
                    <Icon name={'user'}/>
                    {username}
                    </span>
                </span>
                <button 
                onClick={logout}
                className="text-sm bg-slate-800 py-2 px-4 text-white font-bold rounded-md hover:bg-opacity-90">Çıkış Yap</button>
            </div>
        </div>

        <div className="flex flex-col bg-slate-900 w-2/3 p-2 bg-opacity-30 shadow-xl backdrop-blur-sm  ">
            <div className="flex-grow">
                {!selectedUserId && (
                    <div className="flex h-full flex-grow items-center justify-center">
                        <div className="text-white font-bold text-4x1">&larr; Mesajlaşmak için bir kullanıcı seçin</div>
                    </div>
                )}</div>
                {!!selectedUserId &&(

                <div className="relative h-full">
                <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                    {messagesWithoutDupes.map(message =>(
                    <div key={message._id} className={(message.sender === id ? 'text-right': 'text-left')}>
                        <div className={"text-left inline-block p-2 my-2 rounded-md text-sm "+(message.sender === id ? 'bg-slate-800 text-white':'bg-white text-slate-800')}>
                            {message.text}
                        </div>
                    </div>
                    ))}
                    <div ref={divUnderMessages}></div>
                </div>
                </div>
               
                    

                )}
            {!!selectedUserId && (
            <form className="flex gap-2 " onSubmit={sendMessage}>
                <input type="text"
                    value={newMessageText}
                    onChange={ev => setNewMessageText(ev.target.value)}
                    placeholder="Mesajınızı buraya yazın"
                    className="bg-slate-800 flex-grow rounded-md p-2 bg-transparent border-0 border-b-2 border-gray-300 apperance-none dark:focus:border-blue-900 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 hadow-xl backdrop-blur-sm bg-opacity-50 " />
                <button type="submit" className="bg-slate-800 p-2 text-white rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                </button>
            </form>                

            )}    

        </div>  
        </div>
    )
}
