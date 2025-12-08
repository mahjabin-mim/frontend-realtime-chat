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
        <div className="flex flex-col h-screen w-full relative z-10 p-4 gap-4">
             {/* Top Navigation Bar - Now at the very top */}
             <div className="h-16 flex items-center justify-end px-6">
                <div className="flex items-center gap-4">
                     <div className="text-sm text-right">
                        <span className="opacity-60 text-white">welcome, </span>
                        <span className="font-semibold text-primary"><LoggedInUser/></span>
                     </div>
                     <Button variant="primary" size="sm" className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/20">
                         <LogoutButton />
                     </Button>
                </div>
            </div>

            {/* Main Content Area - Split View */}
            <div className="flex-1 flex gap-4 overflow-hidden rounded-2xl glass-panel bg-black/40 border-white/5 shadow-2xl p-4">
                {/* Sidebar / List */}
                <div className="w-1/3 min-w-[320px] hidden md:block h-full border-r border-white/5 pr-4">
                    <ConversationList />
                </div>

                {/* Chat or Placeholder */}
                <div className="flex-1 h-full flex flex-col relative">
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