import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const Generate = () => {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3'>
        <div className='flex flex-col'>
            <span className='mb-2'>Provide your master key</span>
            <Input/>
        </div>      
        <Button>
            Generate .vault file 
        </Button>      
        <Button>
            Generate Pass Key
        </Button>           
        <Button>
            Done
        </Button>           
    </div>
  )
}

export default Generate