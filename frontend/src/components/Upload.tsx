"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const Upload = () => {
    const router = useRouter();
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3'>
        <div className='flex flex-col'>
            <span className='mb-2'>Provide your master key</span>
            <Input/>
        </div>      
        <Button>
            Upload your .vault file 
        </Button>      
        <Button>
            Upload your Pass Key
        </Button>           
        <Button onClick={()=>router.push('/dashboard')}>
            Go to Dashboard
        </Button>           
    </div>
  )
}

export default Upload