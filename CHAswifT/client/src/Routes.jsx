import { useContext } from "react";
import RegisterAndLogin from "./RegisterandLogin.jsx";
import { UserContext } from "./UserContext.jsx";

export default function Routes() {
  const {username, id} = useContext(UserContext);

  if(username){
    return 'logged in as ' + username;
  }
  return (
    <RegisterAndLogin/>
  );
}