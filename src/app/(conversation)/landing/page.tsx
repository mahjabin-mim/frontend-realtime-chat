"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User as UserIcon, Mail, MapPin, Shield, MessageSquare, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/findall`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            });
            if (handleResponse(res)) {
              const result = await res.json();
              if (loggedInUserEmail) {
                const filteredUsers = result.filter((user: User) => user.email !== loggedInUserEmail);
                setUsers(filteredUsers);
              }
            } else {
              router.push('/userLogin');
            }
          } catch (error) {
            console.error('Error fetching users:', error);
          } 
        };
        fetchData();
      }, [loggedInUserEmail]);

    const handleStartChat = (userEmail: string) => {
      router.push(`/chat?userEmail=${userEmail}`);
    };

    const handleConversation = () => {
      router.push("/conversation");
    };

    return (
      <div className="container mx-auto p-6 max-w-5xl h-full flex flex-col gap-6">
        <div className="flex items-center justify-between mb-2">
            <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Available Users
                </h1>
                <p className="text-white/50 mt-1">Connect with your team instantly</p>
            </div>
            
            <Button
                onClick={() => handleConversation()}
                variant="primary"
                size="lg"
                className="rounded-full shadow-lg shadow-primary/20"
            >
                <MessageSquare className="mr-2 h-5 w-5" />
                All Conversations
            </Button>
        </div>

        <Card className="flex-1 overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl flex flex-col">
            <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-1">
                {users.length > 0 ? (
                    <div className="grid gap-2 p-4">
                        {users.map((user, index) => (
                            <motion.div
                                key={user.email}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group flex items-center justify-between p-4 rounded-2xl glass-panel bg-white/5 border-transparent hover:border-primary/30 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                                onClick={() => handleStartChat(user.email)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform">
                                        <UserIcon className="h-6 w-6 opacity-80" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-lg group-hover:text-primary transition-colors">{user.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-white/50 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {user.email}
                                            </span>
                                            {user.role && (
                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-xs">
                                                    <Shield className="h-3 w-3" />
                                                    {user.role}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white/5 hover:bg-primary hover:text-white"
                                >
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4 min-h-[400px]">
                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <UserIcon className="h-10 w-10 opacity-20" />
                        </div>
                        <p className="text-lg">No other users found</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    );
};

export default Landing;