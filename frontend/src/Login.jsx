import { GoogleLogin , googleLogout } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode"
import axios from "axios"
import { useState } from "react";
import "./index.css";
import userIcon from "./images/userIcon.webp";
function Login(){
    const [user,setUser]=useState(null);

    const handleSuccess = async (credentialResponse)=>{
        const decoded= jwtDecode(credentialResponse.credential);
        setUser(decoded);

        try{
            const res= await axios.post(
                "http://localhost:5000/auth/google",
                {
                    token:credentialResponse.credential,
                }
            );
        }
        catch(error){
            console.log("Backend Error ", error);
        }
    }


    const handleLogout= ()=>{
        googleLogout();
        setUser(null);
    }


    return(
        <>
        {!user &&(
            <GoogleLogin onSuccess={handleSuccess}
            onError={()=>{console.log("Login failed")}}
            />
        )}

        {user && (
            <div className="userLogin">
                <img className="userIcon" src={userIcon} alt={user.name}/>
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <button onClick={handleLogout} className="logout">Logout</button>
            </div>
        )}
        </>
    )
}

export default Login;