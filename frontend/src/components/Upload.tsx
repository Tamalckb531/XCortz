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

    /**
     * Handle passkey file upload
     */
    const handlePasskeyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
        setError(null);
        const passkeyData = await readJsonFile<PasskeyFile>(file);

        // Validate structure
        if (!passkeyData.key || !passkeyData.version) {
            throw new Error('Invalid passkey file format');
        }

        setPasskeyFile(passkeyData);
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load passkey file');
        setPasskeyFile(null);
        }
    };

    /**
     * Handle vault file upload
    */
    const handleVaultUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
        setError(null);
        const vaultData = await readJsonFile<VaultFile>(file);

        // Validate structure
        if (
            !vaultData.salt ||
            !vaultData.verification ||
            !vaultData.data ||
            !vaultData.version
        ) {
            throw new Error('Invalid vault file format');
        }

        setVaultFile(vaultData);
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vault file');
        setVaultFile(null);
        }
    };

    /**
     * Verify credentials and navigate to dashboard
     */
    const handleGoToDashboard = async () => {
        if (!masterKey || !passkeyFile || !vaultFile) {
        setError('Please provide all required fields');
        return;
        }

        setIsLoading(true);
        setError(null);

        try {
        const response = await fetch('http://localhost:3000/api/upload-vault', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            masterKey,
            passkeyFile,
            vaultFile,
            }),
        });

        const result = await response.json();

        if (result.success) {
            // Store session ID for future requests
            localStorage.setItem('xcortz_session_id', result.sessionId);

            // Navigate to dashboard with passwords
            // Using query params to pass data (temporary solution)
            // In production, consider using global state management
            localStorage.setItem('xcortz_passwords', JSON.stringify(result.passwords));
            
            router.push('/dashboard');
        } else {
            setError(result.error || 'Failed to verify credentials');
        }
        } catch (err) {
        console.error('Upload error:', err);
        setError('Failed to connect to server. Please ensure the backend is running.');
        } finally {
        setIsLoading(false);
        }
    };

    /**
     * Check if all fields are filled
     */
    const isFormComplete = masterKey.length >= 8 && passkeyFile !== null && vaultFile !== null;

  return (
   <div className="h-full w-full flex flex-col items-center justify-center gap-3">
      {/* Master Key Input */}
      <div className="flex flex-col">
        <span className="mb-2">Provide your master key</span>
        <Input
          type="password"
          value={masterKey}
          onChange={(e) => setMasterKey(e.target.value)}
          placeholder="Enter master key"
          className="min-w-75"
        />
        {masterKey.length > 0 && masterKey.length < 8 && (
          <span className="text-sm text-red-500 mt-1">
            Master key must be at least 8 characters
          </span>
        )}
      </div>

      {/* Passkey File Upload */}
      <div className="flex flex-col gap-2">
        <input
          ref={passkeyInputRef}
          type="file"
          accept=".passkey"
          onChange={handlePasskeyUpload}
          className="hidden"
        />
        <Button onClick={() => passkeyInputRef.current?.click()}>
          {passkeyFile ? '✓ Passkey Uploaded' : 'Upload your Pass Key'}
        </Button>
        {passkeyFile && (
          <span className="text-sm text-green-600">
            Passkey loaded successfully
          </span>
        )}
      </div>

      {/* Vault File Upload */}
      <div className="flex flex-col gap-2">
        <input
          ref={vaultInputRef}
          type="file"
          accept=".vault"
          onChange={handleVaultUpload}
          className="hidden"
        />
        <Button onClick={() => vaultInputRef.current?.click()}>
          {vaultFile ? '✓ Vault Uploaded' : 'Upload your .vault file'}
        </Button>
        {vaultFile && (
          <span className="text-sm text-green-600">
            Vault loaded successfully
          </span>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-sm text-red-500 max-w-75 text-center">
          {error}
        </div>
      )}

      {/* Go to Dashboard Button */}
      <Button
        onClick={handleGoToDashboard}
        disabled={!isFormComplete || isLoading}
      >
        {isLoading ? 'Verifying...' : 'Go to Dashboard'}
      </Button>

      {/* Status Indicators */}
      <div className="mt-4 flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <span>{masterKey.length >= 8 ? '✅' : '⏳'}</span>
          <span>Master key {masterKey.length >= 8 ? 'provided' : 'pending'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{passkeyFile ? '✅' : '⏳'}</span>
          <span>Passkey {passkeyFile ? 'uploaded' : 'pending'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{vaultFile ? '✅' : '⏳'}</span>
          <span>Vault {vaultFile ? 'uploaded' : 'pending'}</span>
        </div>
      </div>
    </div>
  )
}

export default Upload