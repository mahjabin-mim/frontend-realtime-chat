"use client"
import LogoutButton from "@/app/(components)/logoutButton/page";
import Chat from "../chat/page"
import ConversationList from "../conversationList/page"
import { useSearchParams } from "next/navigation";
import LoggedInUser from "@/app/(components)/loggedInUser/page";

import { Suspense } from 'react';

const ConversationContent = () => {
    const searchParams = useSearchParams();
    const userEmail = searchParams.get('userEmail');
    return(
        <>
            <div className='flex justify-end mb-6'>
                <div className='flex justify-end items-center space-x-1 mt-6 mr-6'>
                    <p className="text-blue-600">welcome,</p>
                    <p className="text-blue-600"> <LoggedInUser/></p>
        
                </div>
                <div className='flex justify-end items-center space-x-2 mt-6 mr-6'>
                    <LogoutButton/>
                </div>
            </div>
            <div className="flex min-w-fit bg-slate-50">
                <div className="w-1/3">
                    <ConversationList />
                </div>
                <div className="w-2/3 p-4">
                    {userEmail ? <Chat /> : <div className="text-center text-gray-500 mt-32">No conversation selected</div>}
                </div>
            </div>
            {/* <div className="flex justify-end mt-2 mr-10">
                <BackButton/>
            </div> */}
        </>
    )
}

const Conversation = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConversationContent />
    </Suspense>
  );
};

export default Conversation