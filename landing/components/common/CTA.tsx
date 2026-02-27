"use client";
import { Button } from '../ui/button'

const CTA = () => {
  return (
    <Button className='relative overflow-hidden text-sm font-semibold px-5 py-2.5 rounded-full bg-linear-to-b from-secondary to-accent text-white border cursor-pointer transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] max-md:text-[13px] max-md:px-4 max-md:py-2 leading-[0.96] before:absolute before:inset-0 before:bg-linear-to-r before:from-transparent before:via-foreground/40 before:to-transparent before:translate-x-[-200%] before:transition-transform before:duration-1000 hover:before:translate-x-[200%]'>
          Get Started
    </Button>
  )
}

export default CTA