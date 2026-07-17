"use client";

import React from 'react';
import Link from 'next/link';

interface CardDetails {
  title: string;
  description: string;
  buttonName: string;
  Icon: React.ElementType;
  href: string;
}

const HomePageCard: React.FC<CardDetails> = ({ title, description, buttonName, Icon, href }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-80 flex flex-col justify-between hover:scale-[1.02] transition-transform">
      
      <div className="flex items-center justify-center mb-4 h-12 w-12 rounded-full bg-blue-100 mx-auto">
        <Icon className="text-blue-600 text-2xl" /> {/* Styling for each card */}
      </div>

      <h3 className="text-xl font-semibold text-center mb-2">
        {title} {/* Styling for title text in each card */}
      </h3>

      <p className="text-sm text-gray-600 text-center mb-6">
        {description} {/* Styling for description text in each card */}
      </p>

      <Link href={href} className="w-full">
        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          {buttonName} {/* Styling for button in each card */}
        </button>
      </Link>
    </div>
  );
};

export default HomePageCard;
