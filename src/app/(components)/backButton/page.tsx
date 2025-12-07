"use client";
import { useRouter } from 'next/navigation';
import React from 'react';

const BackButton = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBackClick}
      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
    >
      Back
    </button>
  );
};

export default BackButton;
