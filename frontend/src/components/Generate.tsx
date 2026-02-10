"use client";
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const Generate = () => {
    const router = useRouter();
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3'>
        <div className='flex flex-col'>
            <span className='mb-2'>Provide your master key</span>
            <Input/>
        </div>      
        <Button>
            Generate Pass Key
        </Button>           
        <Button>
            Generate .vault file 
        </Button>      
        <Button onClick={()=>router.push('/dashboard')}>
            Done
        </Button>           
    </div>
  )
}

export default Generate