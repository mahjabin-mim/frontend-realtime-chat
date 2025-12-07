"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface ShowChat {
  id: number;
  message: string;
  sender: string;
  receiver: string;
}

interface DecodedToken {
  email: string;
  sub: number;
  iat: number;
  exp: number;
}

import { Suspense } from 'react';

const ChatContent = () => {
  const [data, setData] = useState<{ message: string; receiver: string | null }>({ message: "", receiver: null });
  const [chatdata, setChatData] = useState<ShowChat[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get('userEmail');
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState('');
  
  useEffect(() => {
    if (userEmail) {
      setData((prevData) => ({ ...prevData, receiver: userEmail }));

      const fetchUserName = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/finduser?value=${userEmail}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          });

          if (response.ok) {
            const user = await response.json();
            setReceiverName(user.name);
          } else {
            throw new Error('Failed to fetch user name');
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      };

      fetchUserName();
    }
  }, [userEmail]);

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/singlechat/getChat`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (handleResponse(res)) {
          const result = await res.json();
          console.log("Fetched messages:", result);
          console.log("loggedInUserEmail:", loggedInUserEmail); 
          console.log("data.receiver:", data.receiver); 
          console.log(receiverName);
          const filteredMessages = result.filter((message: ShowChat) =>
            (message.sender === loggedInUserEmail && message.receiver === data.receiver) ||
            (message.sender === data.receiver && message.receiver === loggedInUserEmail)
          );
          setChatData(filteredMessages);
        } else {
          alert("Login Expired");
          router.push('/userLogin');
        }
      } catch (error) {
        alert("Error fetching chat data");
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 1000); 
    return () => clearInterval(interval); 
  }, [loggedInUserEmail, data.receiver]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = Cookies.get('authToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/singlechat/newMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: data.message, receiver: data.receiver }),
      });
      if (res.ok) {
        const newMessage = await res.json();
        setChatData((prev) => [...prev, newMessage]);
        //setData({ message: "" });
        setData((prevData) => ({ ...prevData, message: "", receiver: userEmail || "" }));
      } else {
        alert("Error sending message");
      }
    } catch (error) {
      alert("Error sending message");
    }
  };

  return (
    <>
    <div className="max-w-md mx-auto">
      <div className='bg-white shadow-md rounded-lg h-10 mb-1 flex items-center'>
        <p className="ml-4 font-semibold text-lg font-sans tracking-wide">{receiverName}</p>
      </div>
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col h-96 p-4 overflow-y-auto">
            {chatdata.length > 0 ? (
                chatdata.map((chat) => (
                    <div key={chat.id} className={`flex ${chat.sender === loggedInUserEmail ? 'justify-end mt-1' : 'justify-start mt-1'}`}>
                        <div className={`rounded-lg p-2 ${chat.sender === loggedInUserEmail ? 'bg-fuchsia-900 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <p className="text-sm font-sans tracking-wide">{chat.message}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center">No messages yet</p>
            )}
        </div>
        <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                    type="text"
                    name="message"
                    value={data.message}
                    onChange={handleChange}
                    required
                    placeholder="Write messages..."
                    className="flex-grow p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                    Send
                </button>
            </form>
        </div>
    </div>
    </div>
    </>
  );
};

const Chat = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatContent />
        </Suspense>
    );
};

export default Chat;
