"use client";
import { NavLink } from '@/lib/types';
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button';

const Header = () => {
  const router = useRouter();
  const navLink: NavLink[] = [
    {
      name: "Features",
      link: "features"
    },
    {
      name: "Product",
      link: "product"
    },
    {
      name: "About",
      link: "about"
    },
    {
      name: "Pricing",
      link: "pricing"
    }
  ];

  return (
    <header className='sticky top-5 z-10 flex items-center justify-between w-full max-w-175 mt-7 mx-auto px-8 py-2 rounded-full bg-linear-to-b from-[rgba(229,228,255,0.8)] to-white backdrop-blur-[18px] border border-[#D1D1D1] shadow-[0_4px_32px_rgba(0,0,0,0.3)] max-md:max-w-[calc(100%-32px)] max-md:px-4 max-md:py-2.5 max-md:mt-4'>
      <h1
        onClick={() => router.push('/')}
        className='font-semibold text-base text-black tracking-[-0.01em] leading-[0.96] max-[480px]:text-sm cursor-pointer'>XCortz</h1>
      <ul className="flex items-center gap-7 list-none max-md:hidden">
        {navLink.map((item, index) =>
          <li
            key={index}
            className='text-sm font-medium text-black/80 leading-[0.96] transition-colors duration-200 cursor-pointer hover:text-black/70'
            onClick={()=>router.push(item.link)}
          >
            {item.name}
          </li>)}
      </ul>
      <div className='flex items-center gap-4 max-md:gap-2.5'>
        <Button className='relative overflow-hidden text-sm font-semibold px-5 py-2.5 rounded-full bg-linear-to-b from-[#263962] to-[#0E1627] text-white border border-[rgba(0,0,0,0.8)] cursor-pointer transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] max-md:text-[13px] max-md:px-4 max-md:py-2 leading-[0.96] before:absolute before:inset-0 before:bg-linear-to-r before:from-transparent before:via-white/40 before:to-transparent before:translate-x-[-200%] before:transition-transform before:duration-1000 hover:before:translate-x-[200%]'>
          Get Started
        </Button>
      </div>
    </header>
  )
}

export default Header