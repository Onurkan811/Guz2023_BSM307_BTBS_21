import { useContext, useState } from "react";
import axios from 'axios';
import { UserContext } from "./UserContext";
import Icon from "./Icon";

export default function RegisterAndLogin() {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
    const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);
    async function handleSubmit(ev) {
        const url = isLoginOrRegister === 'register' ? 'register' : 'login';
        ev.preventDefault();
        const {data} = await axios.post(url, {username,password});
        setLoggedInUsername(username);
        setId(data.id);
    }

    return(
        <div className="h-screen flex justify-center items-center bg-cover" style={{"backgroundImage": "url('../src/assets/wallpaper.png"}}>
            <form className="w-72 mx-auto mb-20 bg-slate-900 border border-slate-800 rounded-md p-8 shadow-xl backdrop-blur-sm bg-opacity-30" onSubmit={handleSubmit}>

                <p className="text-white mb-10 text-4xl font-bold text-center">CHAswifT</p>
                <input value={username} 
                    onChange={ev => setUsername(ev.target.value)} 
                    type="text" placeholder="Kullanıcı Adı" 
                    className="block w-full py-2.3 text-4x1 font-bold text-sm text-white text-center mb-6 bg-transparent border-0 border-b-2 border-gray-300 apperance-none dark:focus:border-blue-900 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 "/>

                <input value={password} 
                    onChange={ev => setPassword(ev.target.value)} 
                    type="password" placeholder="Şifre" 
                    className="block w-full py-2.3 text-4x1 font-bold text-sm text-white text-center mb-6 bg-transparent border-0 border-b-2 border-gray-300 apperance-none dark:focus:border-blue-900 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 "/>

                <button className="bg-blue-950 text-white font-bold text-4x1 block w-full rounded-md p-2 border hover:bg-opacity-50 hover:border-opacity-20   " >
                    {isLoginOrRegister === 'register' ? 'KAYIT OL': 'GİRİŞ YAP'}
                </button>

                <div className="text-center text-xs mt-8 text-gray-400 font-bold">
                    {isLoginOrRegister === 'register' && (
                       <div>
                        Zaten üye misiniz ?&nbsp; 
                        <button onClick={() => setIsLoginOrRegister('login')}>GİRİŞ YAP!</button>
                       </div> 
                       
                    )}
                {isLoginOrRegister == 'login' && (
                         <div>
                         Üye değil misiniz ?&nbsp;
                         <button onClick={() => setIsLoginOrRegister('register')}>KAYIT OL!</button>
                        </div> 
                )}
                </div>
            </form>
        </div>
    );
}