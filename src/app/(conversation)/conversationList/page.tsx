"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  name: string;
  email: string;
  address?: string;
  role?: string;
}

interface DecodedToken {
  email: string;
  sub: number;
  iat: number;
  exp: number;
}

const ConversationList = () => {
    const [users, setUsers] = useState<User[]>([]);
    //const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>(null);

    const handleResponse = (res: Response) => {
        if (res.status === 401) {
          Cookies.remove('authToken');
          router.push('/userLogin');
          return false;
        }
        return res.ok;
      };

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

        const fetchData = async () => {
          try {
            const token = Cookies.get('authToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/findall`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            });
            if (handleResponse(res)) {
              const result = await res.json();
              console.log("Fetched users:", result);
              if (loggedInUserEmail) {
                const filteredUsers = result.filter((user: User) => user.email !== loggedInUserEmail);
                setUsers(filteredUsers);
              } else {
                console.log("loggedInUser not found");
              }
            } else {
              alert("Login Expired");
              router.push('/userLogin');
            }
          } catch (error) {
            console.error('Error fetching users:', error);
          } 
        //   finally {
        //     setLoading(false);
        //   }
        };
        //fetchLoggedInUser()
        fetchData();
      }, [loggedInUserEmail]);
      
    //   if (loading) {
    //     return <div>Loading...</div>;
    //   }

    // const handleStartChat = async (userId: number) => {
    //     try {
    //       const token = Cookies.get('authToken');
    //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversation/create`, {
    //         method: 'POST',
    //         headers: {
    //           'Authorization': `Bearer ${token}`,
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //           name : "",
    //           users: [userId]
    //         })
    //       });

    //       if (handleResponse(res)) {
    //         const conversation = await res.json();
    //         console.log('Conversation created:', conversation);
    //         alert("Conversation created");
    //       } else {
    //         alert("Failed to start chat");
    //       }
    //     } catch (error) {
    //       console.error('Error starting chat:', error);
    //     }
    // };

    const handleStartChat = (userEmail: string) => {
      router.push(`/chat?userEmail=${userEmail}`);
    };

    const handleConversationClick = (userEmail: string) => {
        router.push(`/conversation?userEmail=${userEmail}`);
      };

    return (
    <>
        <div className="container mx-auto p-4 min-w-80">
            <h1 className="text-2xl font-bold mb-4 ml-4">Chat</h1>
            {/* <div className="container mx-auto p-4 min-w-80 flex items-center">
                <h1 className="text-2xl font-bold mr-4">Chat</h1>
                <div className="flex-grow">
                    <input
                    type="text"
                    placeholder="Search"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
            </div> */}
            <div className="overflow-y-auto h-96">
                <ul>
                {users.map((user) => (
                    <li
                    key={user.email}
                    className="p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleConversationClick(user.email)}
                    >
                    <div className="font-bold">{user.name}</div>
                    <div className="text-gray-600">{user.email}</div>
                    </li>
                ))}
                </ul>
            </div>
        </div>
    </>
    );
};

export default ConversationList