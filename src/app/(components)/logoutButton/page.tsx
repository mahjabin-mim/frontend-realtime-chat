"use client";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import React from 'react';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('authToken');
    router.push('/userLogin');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white bg-black px-2 py-1 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
