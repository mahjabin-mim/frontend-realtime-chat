"use client";

import LogoutButton from "@/app/(components)/logoutButton/page";
import Chat from "../chat/page";
import ConversationList from "../conversationList/page";
import { useSearchParams } from "next/navigation";
import LoggedInUser from "@/app/(components)/loggedInUser/page";
import { Suspense } from 'react';
import { Card } from "@/components/ui/Card";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ConversationContent = () => {
    const searchParams = useSearchParams();
    const userEmail = searchParams.get('userEmail');

    return (
        <div className="flex h-screen w-full relative z-10 p-4 gap-4">
            {/* Sidebar / List */}
            <div className="w-1/3 min-w-[320px] hidden md:block h-full">
                <ConversationList />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-full flex flex-col gap-4">
                {/* Top Navigation Bar */}
                <div className="h-16 glass-panel rounded-xl flex items-center justify-between px-6 bg-black/20">
                    <div className="flex items-center gap-2">
                         <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            <LayoutDashboard size={20} />
                         </div>
                         <div className="text-sm">
                            <span className="opacity-60">Welcome, </span>
                            <span className="font-semibold text-primary"><LoggedInUser/></span>
                         </div>
                    </div>
                    <div className="flex items-center">
                         <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                             <LogoutButton />
                         </Button>
                    </div>
                </div>

                {/* Chat or Placeholder */}
                <div className="flex-1 overflow-hidden relative rounded-2xl glass-panel bg-black/40 border-white/5 shadow-2xl">
                    {userEmail ? (
                        <Chat />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center flex-col text-white/30">
                            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl mb-4" />
                            <p className="text-lg font-light">Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Conversation = () => {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-primary animate-pulse">Loading Cosmic Interface...</div>}>
      <ConversationContent />
    </Suspense>
  );
};

export default Conversation;