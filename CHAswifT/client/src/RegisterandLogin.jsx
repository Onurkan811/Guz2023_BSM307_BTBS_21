import { useContext, useState } from "react";
import axios from 'axios';
import { UserContext } from "./UserContext";

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
        <div className="bg-white h-screen flex items-center">
            <form className="w-64 mx-auto mb-20" onSubmit={handleSubmit}>

                <p className="mb-4 text-4xl">ChaSwifT</p>

                <input value={username} 
                    onChange={ev => setUsername(ev.target.value)} 
                    type="text" placeholder="Kullanıcı Adı" 
                    className="block w-full rounded-sm p-2 mb-2 border"/>

                <input value={password} 
                    onChange={ev => setPassword(ev.target.value)} 
                    type="password" placeholder="Şifre" 
                    className="block w-full rounded-sm p-2 mb-2 border"/>

                <button className="bg-blue-950 text-white block w-full rounded-sm p-2" >
                    {isLoginOrRegister === 'register' ? 'KAYIT OL': 'GİRİŞ YAP'}
                </button>

                <div className="text-center mt-2">
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