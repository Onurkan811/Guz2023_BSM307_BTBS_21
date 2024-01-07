import axios from "axios";
import {UserContextProvider } from "./UserContext";
import Routes from "./Routes";

function App() {
  axios.defaults.baseURL = "https://chaswift-api.onrender.com/";
  axios.defaults.withCredentials= true;
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
  axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
  return (
    <UserContextProvider>
    <Routes/>
    </UserContextProvider>
  )
}

export default App
