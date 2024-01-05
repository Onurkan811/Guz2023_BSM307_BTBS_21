import axios from "axios";
import {UserContextProvider } from "./UserContext";
import Routes from "./Routes";

function App() {
  axios.defaults.baseURL= "https://guz2023-bsm-307-btbs-21-api.vercel.app"
  axios.defaults.withCredentials= true;
  return (
    <UserContextProvider>
    <Routes/>
    </UserContextProvider>
  )
}

export default App
