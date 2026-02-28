"use client";
import { NavLink } from '@/lib/types';
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button';
import CTA from '../common/CTA';

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
    <header className='sticky top-5 z-10 flex items-center justify-between w-full md:max-w-[70%] mt-7 mx-auto px-8 py-2 rounded-full bg-linear-to-b from-[rgba(229,228,255,0.8)] to-white backdrop-blur-[18px] border border-[#D1D1D1] shadow-[0_4px_32px_rgba(0,0,0,0.5)] max-md:px-4 max-md:py-2.5 max-md:mt-4'>
      <h1
        onClick={() => router.push('/')}
        className='font-bold text-xl tracking-[-0.01em] leading-[0.96] max-[480px]:text-sm cursor-pointer bg-linear-to-br from-accent via-secondary to-emerald-500 bg-clip-text text-transparent'
      >
        XCortz
      </h1>
      <ul className="lg:flex items-center gap-7 list-none hidden ">
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
        <CTA/>
      </div>
    </header>
  )
}

export default Header