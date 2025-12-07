"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import LogoutButton from '@/app/(components)/logoutButton/page';

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

const Landing = () => {
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

    const handleConversation = () => {
      router.push("/conversation");
    };

    return (
      <>
      <div className='flex justify-end items-center space-x-4 mt-10 mr-10'>
        <p className="text-blue-600">welcome {loggedInUserEmail}</p>
        <LogoutButton/>
      </div>
      <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="hover:bg-gray-100">
                <td className="px-4 py-2 text-left">{user.name}</td>
                <td className="px-4 py-2 text-left">{user.email}</td>
                <td className="px-4 py-2 text-left">{user.address}</td>
                <td className="px-4 py-2 text-left">{user.role}</td>
                {/* <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleStartChat(user.email)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Send message
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={() => handleConversation()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          All Conversations
        </button>
      </div>
    </div>
    </>
    );
};

export default Landing