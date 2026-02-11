"use client";
import { useState } from 'react';
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { PasskeyFile } from '@/lib/types';

/**
 * GENERATE COMPONENT
 * 
 * First-time setup page where users:
 * 1. Enter their master key
 * 2. Generate passkey file (downloads automatically)
 * 3. Generate vault file (downloads automatically)
 * 4. Navigate to dashboard
 * 
 * State management:
 * - masterKey: User's memorable password
 * - passkeyGenerated: Whether passkey has been generated
 * - passkeyFile: Generated passkey file data
 * - vaultGenerated: Whether vault has been generated
 * - isGenerating: Loading states for buttons
 */

const Generate = () => {
    const router = useRouter();

    // State
    const [masterKey, setMasterKey] = useState('');
    const [passkeyGenerated, setPasskeyGenerated] = useState(false);
    const [passkeyFile, setPasskeyFile] = useState<PasskeyFile | null>(null);
    const [vaultGenerated, setVaultGenerated] = useState(false);
    const [isGeneratingPasskey, setIsGeneratingPasskey] = useState(false);
    const [isGeneratingVault, setIsGeneratingVault] = useState(false);
    
    //? Download a JSON file to user's computer
    const downloadFile = (data: object, filename: string) => {
        const blob = new Blob([JSON.stringify(data, null, 2)],{type:'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    //? generate passkey file via API and download it
    const handleGeneratePasskey = async () => {
        setIsGeneratingPasskey(true);
        try {
        const response = await fetch('http://localhost:3000/api/generate-passkey', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (result.success) {
            const passkeyData = result.data;
            setPasskeyFile(passkeyData);
            setPasskeyGenerated(true);

            // Auto-download the passkey file
            downloadFile(passkeyData, 'xcortz.passkey');

            alert('Passkey generated and downloaded! Keep it safe.');
        } else {
            alert(`Error: ${result.error}`);
        }
        } catch (error) {
        console.error('Failed to generate passkey:', error);
        alert('Failed to generate passkey. Make sure the backend is running.');
        } finally {
        setIsGeneratingPasskey(false);
        }
    };

    //? Generate vault file via API and download it
    const handleGenerateVault = async () => {
        if (!passkeyFile) {
        alert('Please generate passkey first!');
        return;
        }

        setIsGeneratingVault(true);
        try {
            const response = await fetch('http://localhost:3000/api/generate-vault', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    masterKey,
                    passkeyFile,
                }),
            });

            const result = await response.json();

            if (result.success) {
                const vaultData = result.data;
                setVaultGenerated(true);

                // Auto-download the vault file
                downloadFile(vaultData, 'xcortz.vault');

                alert('Vault file generated and downloaded! You can now proceed.');
        } else {
            alert(`Error: ${result.error}`);
        }
        } catch (error) {
        console.error('Failed to generate vault:', error);
        alert('Failed to generate vault. Make sure the backend is running.');
        } finally {
        setIsGeneratingVault(false);
        }
    };

    //? Navigate to dashboard
    const handleDone = () => router.push('/dashboard')

    return (
        <div className='h-full w-full flex flex-col items-center justify-center gap-3'>
            <div className='flex flex-col'>
                <span className='mb-2'>Provide your master key</span>
               <Input
                    type="password"
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    placeholder="Enter master key (min 8 chars)"
                    className="min-w-75"
                />
                {masterKey.length > 0 && masterKey.length < 8 && (
                <span className="text-sm text-red-500 mt-1">
                    Master key must be at least 8 characters
                </span>
                )}
            </div>      
            <Button
                onClick={handleGeneratePasskey}
                disabled={masterKey.length < 8 || isGeneratingPasskey}
            >
                {isGeneratingPasskey ? 'Generating...' : 'Generate Pass Key'}
            </Button>       
            <Button
                onClick={handleGenerateVault}
                disabled={!passkeyGenerated || isGeneratingVault}
            >
                {isGeneratingVault ? 'Generating...' : 'Generate .vault file'}
            </Button>    
            <Button onClick={handleDone} disabled={!vaultGenerated}>
                Done
            </Button>      
            {/* Status indicators */}
            <div className="mt-4 flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-2">
                <span>{passkeyGenerated ? '✅' : '⏳'}</span>
                <span>Passkey {passkeyGenerated ? 'generated' : 'pending'}</span>
                </div>
                <div className="flex items-center gap-2">
                <span>{vaultGenerated ? '✅' : '⏳'}</span>
                <span>Vault {vaultGenerated ? 'generated' : 'pending'}</span>
                </div>
            </div>
        </div>
    )
}

export default Generate