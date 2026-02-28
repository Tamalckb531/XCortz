import React from 'react'
import CTA from '../common/CTA'

const Main = () => {
  return (
    <div className='flex flex-col gap-5 items-start justify-around mt-16'>
      <h2 className=' text-2xl'>Only Trust Thyself</h2>
      <p>Shakespeare never said that. But we think he was onto something.
        Your passwords live on your machine. No cloud. No network. No one else. Just you, your vault, and a master key only you know. XCortz keeps it that way always :)
      </p>
      <CTA/>
    </div>
  )
}

export default Main