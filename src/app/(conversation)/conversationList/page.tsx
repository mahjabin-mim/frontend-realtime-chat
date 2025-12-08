"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search, User } from 'lucide-react';

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
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
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
                const filtered = result.filter((user: User) => user.email !== loggedInUserEmail);
                setUsers(filtered);
                setFilteredUsers(filtered);
              }
            } else {
              // Handle error
            }
          } catch (error) {
            console.error('Error fetching users:', error);
          } 
        };
        fetchData();
      }, [loggedInUserEmail]);

    useEffect(() => {
        if (searchQuery) {
            setFilteredUsers(users.filter(user => 
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            ));
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    const handleConversationClick = (userEmail: string) => {
        // Redesigned navigation: Stay on /conversation to keep split view
        router.push(`/conversation?userEmail=${userEmail}`);
      };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full flex flex-col p-4 md:p-6"
        >
            <Card className="border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl flex-1 flex flex-col overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-6 px-0">
                    <CardTitle className="text-2xl font-bold text-left mb-4">Chat</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search users..." 
                            className="pl-10 bg-white/5 border-white/10 focus:border-primary/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="grid gap-3">
                        <AnimatePresence>
                            {filteredUsers.map((user, index) => (
                                <motion.div
                                    key={user.email}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleConversationClick(user.email)}
                                    className="p-3 rounded-xl glass-panel bg-white/5 hover:bg-white/10 transition-all cursor-pointer border-transparent hover:border-primary/30 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-primary/40 transition-shadow">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-white group-hover:text-primary transition-colors truncate">{user.name}</h3>
                                            <p className="text-xs text-white/50 truncate">{user.email}</p>
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] shrink-0"></div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredUsers.length === 0 && (
                            <div className="text-center text-white/40 mt-10">
                                <User className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                <p>No users found</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ConversationList;
