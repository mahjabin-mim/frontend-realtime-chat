"use client";

import LogoutButton from "@/app/(components)/logoutButton/page";
import LoggedInUser from "@/app/(components)/loggedInUser/page";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  return (
    <div className="h-16 flex items-center justify-end px-6 absolute top-0 right-0 z-50 w-full pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="text-sm text-right">
          <span className="opacity-60 text-white">welcome, </span>
          <span className="font-semibold text-primary">
            <LoggedInUser />
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/20"
        >
          <LogoutButton />
        </Button>
      </div>
    </div>
  );
}
