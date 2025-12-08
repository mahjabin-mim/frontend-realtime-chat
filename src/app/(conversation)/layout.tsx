import { ReactNode } from "react";

export default function ConversationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-cosmic text-foreground overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 h-full">
            {children}
        </div>
    </div>
  );
}
