import { useContext } from "react";
import RegisterAndLogin from "./RegisterandLogin.jsx";
import { UserContext } from "./UserContext.jsx";
import Chat from "./chat.jsx";

export default function Routes() {
  const {username, id} = useContext(UserContext);

  if(username){
    return <Chat/>;
  }
  return (
    <RegisterAndLogin/>
  );
}