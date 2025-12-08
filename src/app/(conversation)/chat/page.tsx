"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Send, ArrowLeft, User } from 'lucide-react';

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

const ChatContent = () => {
  const [data, setData] = useState<{ message: string; receiver: string | null }>({ message: "", receiver: null });
  const [chatdata, setChatData] = useState<ShowChat[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get('userEmail');
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatdata]);

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
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        if (decodedToken.email) {
          setLoggedInUserEmail(decodedToken.email);
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
          const filteredMessages = result.filter((message: ShowChat) =>
            (message.sender === loggedInUserEmail && message.receiver === data.receiver) ||
            (message.sender === data.receiver && message.receiver === loggedInUserEmail)
          );
          setChatData(filteredMessages);
        } else {
          // Silent failure or specific handling if needed
        }
      } catch (error) {
        // Silent error to avoid spamming alerts
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
    if (!data.message.trim()) return;

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
        setData((prevData) => ({ ...prevData, message: "", receiver: userEmail || "" }));
      }
    } catch (error) {
      alert("Error sending message");
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 overflow-hidden relative">
      <div className="w-full h-full flex flex-col z-10">
        <Card className="flex-1 flex flex-col border-white/10 shadow-2xl overflow-hidden bg-black/40 backdrop-blur-xl">
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-black/20">
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg tracking-wide text-white">{receiverName || "Chat"}</h2>
              <div className="flex items-center gap-2">
                 <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                 <span className="text-xs text-white/50">Online</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <AnimatePresence initial={false}>
              {chatdata.length > 0 ? (
                chatdata.map((chat) => {
                  const isMe = chat.sender === loggedInUserEmail;
                  return (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                      }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] px-5 py-3 shadow-lg ${
                          isMe
                            ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-[24px] rounded-br-[4px] shadow-violet-500/20'
                            : 'glass-panel bg-white/5 backdrop-blur-md text-white rounded-[24px] rounded-bl-[4px] border-white/10'
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed font-medium">{chat.message}</p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
                  <div className="p-4 rounded-full bg-white/5 border border-white/5">
                    <Send className="h-8 w-8 opacity-50" />
                  </div>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-black/20 border-t border-white/5">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                type="text"
                name="message"
                value={data.message}
                onChange={handleChange}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border-white/10 hover:border-primary/50 focus:border-primary transition-all rounded-full"
                autoComplete="off"
              />
              <Button type="submit" variant="primary" className="px-5 rounded-full">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Chat = () => {
    return (
        <Suspense fallback={
          <div className="h-screen w-full flex items-center justify-center bg-gradient-cosmic">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        }>
            <ChatContent />
        </Suspense>
    );
};

export default Chat;
