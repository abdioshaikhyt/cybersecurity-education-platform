'use client';

import React from 'react';
import HomePageCard from "@/components/HomeCardComponent";
import { FaShieldAlt } from "react-icons/fa";
import { RiArticleLine } from "react-icons/ri";
import { MdOutlineQuiz } from "react-icons/md";
import Image from 'next/image';
import { fetchTotalPwnCount } from '@/lib/api';
import { useEffect, useState } from "react";

function Home() {
  // Fetching breaches data from backend
  const [pwnCount, setPwnCount] = useState<String>("TOTAL COUNT NOT AVAILABLE")

  useEffect(() => {
    const loadPwnCount = async() => {
      const pwnCountData = await fetchTotalPwnCount();
      setPwnCount(pwnCountData);
    }

    loadPwnCount()
  })

  return (
    <div className='bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center content-center min-h-screen w-full'>
      {/* Styling for Logo and Name */}
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <Image
            src="/transparentLogo.png"
            alt="VYDS Logo"
            width={250}
            height={250}
            className="rounded"
          />
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <p className="text-gray-400 text-sm mb-2">
          Current Breached Accounts Worldwide
        </p>
        <h2 className="text-4xl font-bold">
          {pwnCount}
        </h2>
        <p className="text-gray-500 text-xs mt-1">
          Data updates on every page refresh
        </p>
      </div>

      {/* Styling for Cards Details with logos */}
      <div className="flex justify-center gap-6 mt-16 flex-wrap">
        <HomePageCard
          title="Policy Analyser"
          description="Analyse privacy policies to understand how your data is being used."
          buttonName="Analyse Now"
          Icon={FaShieldAlt}
          href="./policies"
        />
        <HomePageCard
          title="Articles"
          description="Stay informed with the latest privacy news and best practices."
          buttonName="Read Articles"
          Icon={RiArticleLine}
          href="./articles"
        />
        <HomePageCard
          title="Quiz"
          description="Test your knowledge about privacy policies and data protection."
          buttonName="Take Quiz"
          Icon={MdOutlineQuiz}
          href="./quizzes"
        />
      </div>
    </div>
  );
}

export default Home;
