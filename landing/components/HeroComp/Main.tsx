import React from 'react'
import CTA from '../common/CTA'

const Main = () => {
  return (
    <div className='flex flex-col gap-5 items-start mt-24'>
      <h2 className='text-[4rem] md:text-[6rem] font-bold tracking-[-0.01em] mt-3 bg-linear-to-r from-foreground via-slate-400 to-muted-foreground bg-clip-text text-transparent'>Only Trust Thyself</h2>
      <p className='text-base md:text-[1.125rem] md:leading-normal text-muted-foreground font-normal relative my-5  leading-7 max-w-[60%]'>Shakespeare never said that. But we think he was onto something.
        Your passwords live on your machine. No cloud. No network. No one else. Just you, your vault, and a master key only you know. XCortz keeps it that way always :)
      </p>
      <CTA/>
    </div>
  )
}

export default Main