"use client"
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    email: string;
    sub: number;
    iat: number;
    exp: number;
}

const LoggedInUser = () => {
    const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const token = Cookies.get('authToken');
        console.log("Token from cookies:", token); 
        if (token) {
          try {
            const decodedToken: DecodedToken = jwtDecode(token);
            console.log("Decoded token:", decodedToken); 
            if (decodedToken.email) {
              setLoggedInUserEmail(decodedToken.email);
            } else {
              console.error('Email field not found in token');
            }
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
    }, [loggedInUserEmail])
    
    return(
        <>
            <p className="text-blue-600">{loggedInUserEmail}</p>
        </>
    )
}

export default LoggedInUser
