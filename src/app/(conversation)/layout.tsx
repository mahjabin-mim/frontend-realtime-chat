import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export default function ConversationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-screen bg-gradient-cosmic text-foreground overflow-hidden font-sans">
        {/* Background Elements */}
        {/* Background Elements - Glowing Orb */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full bg-primary/20 blur-[150px] pointer-events-none" />
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
        
        <Navbar />

        <div className="relative z-10 h-full pt-16">
            {children}
        </div>
    </div>
  );
}
