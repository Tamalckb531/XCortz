"use client";
import { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { PasskeyFile, VaultFile, Password } from '@/lib/types';

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
    // State
    const [masterKey, setMasterKey] = useState('');
    const [passkeyFile, setPasskeyFile] = useState<PasskeyFile | null>(null);
    const [vaultFile, setVaultFile] = useState<VaultFile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs for file inputs
    const passkeyInputRef = useRef<HTMLInputElement>(null);
    const vaultInputRef = useRef<HTMLInputElement>(null);

    /**
     * Read and parse JSON file
     */
    const readJsonFile = <T,>(file: File): Promise<T> => {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
            const content = e.target?.result as string;
            const json = JSON.parse(content);
            resolve(json);
            } catch (error) {
            reject(new Error('Invalid JSON file'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
        });
    };
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