"use client";
import { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button"
import { Input } from "./ui/input"

/**
 * UPLOAD COMPONENT
 * 
 * For existing users who already have .vault and .passkey files
 * 
 * Workflow:
 * 1. User enters master key
 * 2. User uploads .passkey file
 * 3. User uploads .vault file
 * 4. Verify credentials with backend
 * 5. Navigate to dashboard with decrypted passwords
 */

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