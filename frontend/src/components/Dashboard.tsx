"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PasswordTable from './DashboardComp/PasswordTable';
import { AddPasswordModal } from './DashboardComp/AddPasswordModal';
import { EditPasswordModal } from './DashboardComp/EditPasswordModal';
import { UnsavedChangesIndicator } from './DashboardComp/UnsavedChangesIndicator';
import { Button } from './ui/button';
import { Password } from '@/lib/types';

/**
 * DASHBOARD COMPONENT
 * 
 * Main password management interface
 * Handles:
 * - Display passwords from localStorage
 * - Add/Edit/Delete operations
 * - Track unsaved changes
 * - Download updated vault
 */

const Dashboard = () => {
  const router = useRouter();

  // Core state
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [masterKey, setMasterKey] = useState<string | null>(null);
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);
  
  // Loading states
  const [isAddingPassword, setIsAddingPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isDeletingPassword, setIsDeletingPassword] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Changes tracking
  const [changesCount, setChangesCount] = useState(0);
  const [initialPasswordCount, setInitialPasswordCount] = useState(0);

  /**
   * Load data from localStorage on mount
   */
  useEffect(() => {
    const storedPasswords = localStorage.getItem('xcortz_passwords');
    const storedSessionId = localStorage.getItem('xcortz_session_id');
    const storedMasterKey = localStorage.getItem('xcortz_master_key');

    if (!storedPasswords || !storedSessionId || !storedMasterKey) {
      alert('Session not found. Please upload your vault again.');
      router.push('/upload');
      return;
    }

    try {
      const parsedPasswords = JSON.parse(storedPasswords);
      setPasswords(parsedPasswords);
      setInitialPasswordCount(parsedPasswords.length);
      setSessionId(storedSessionId);
      setMasterKey(storedMasterKey);
    } catch (error) {
      console.error('Failed to load passwords:', error);
      alert('Failed to load passwords. Please upload your vault again.');
      router.push('/upload');
    }
  }, [router]);

  /**
   * Update localStorage when passwords change
   */
  useEffect(() => {
    if (passwords.length > 0 || changesCount > 0) {
      localStorage.setItem('xcortz_passwords', JSON.stringify(passwords));
    }
  }, [passwords, changesCount]);

  /**
   * Handle adding a new password
   */
  const handleAddPassword = async (newPassword: {
    name: string;
    description: string;
    password: string;
  }) => {
    if (!sessionId || !masterKey) {
      alert('Session expired. Please upload your vault again.');
      router.push('/upload');
      return;
    }

    setIsAddingPassword(true);

    try {
      const response = await fetch('http://localhost:3000/api/add-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          masterKey,
          password: newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPasswords(result.passwords);
        setChangesCount((prev) => prev + 1);
        setIsAddModalOpen(false);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to add password:', error);
      alert('Failed to add password. Please try again.');
    } finally {
      setIsAddingPassword(false);
    }
  };

  /**
   * Handle editing a password
   */
  const handleEditPassword = async (
    passwordId: number,
    updates: { name: string; description: string; password: string }
  ) => {
    if (!sessionId || !masterKey) {
      alert('Session expired. Please upload your vault again.');
      router.push('/upload');
      return;
    }

    setIsEditingPassword(true);

    try {
      const response = await fetch('http://localhost:3000/api/edit-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          masterKey,
          passwordId,
          updates,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPasswords(result.passwords);
        setChangesCount((prev) => prev + 1);
        setIsEditModalOpen(false);
        setEditingPassword(null);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to edit password:', error);
      alert('Failed to edit password. Please try again.');
    } finally {
      setIsEditingPassword(false);
    }
  };

  /**
   * Handle deleting a password
   */
  const handleDeletePassword = async (passwordId: number) => {
    if (!sessionId || !masterKey) {
      alert('Session expired. Please upload your vault again.');
      router.push('/upload');
      return;
    }

    setIsDeletingPassword(true);

    try {
      const response = await fetch('http://localhost:3000/api/delete-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          masterKey,
          passwordId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPasswords(result.passwords);
        setChangesCount((prev) => prev + 1);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to delete password:', error);
      alert('Failed to delete password. Please try again.');
    } finally {
      setIsDeletingPassword(false);
    }
  };

  /**
   * Handle downloading updated vault
   */
  const handleDownloadVault = async () => {
    if (!sessionId) {
      alert('Session not found.');
      return;
    }

    setIsDownloading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/download-vault/${sessionId}`
      );

      if (response.ok) {
        const vaultData = await response.json();
        
        // Extract filename from response headers or use fileVersion
        const fileVersion = vaultData.fileVersion || 2;
        const filename = `xcortz_${fileVersion}.vault`;

        // Download file
        const blob = new Blob([JSON.stringify(vaultData, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Reset changes count
        setChangesCount(0);
        setInitialPasswordCount(passwords.length);

        alert(
          `✅ Vault downloaded as ${filename}\n\n⚠️ Important: Delete your old vault file and use the new one.`
        );
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to download vault:', error);
      alert('Failed to download vault. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Open edit modal with selected password
   */
  const handleEditClick = (password: Password) => {
    setEditingPassword(password);
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-100 h-full flex flex-col items-center justify-center p-4 gap-4">
      {/* Unsaved Changes Indicator */}
      <UnsavedChangesIndicator
        changesCount={changesCount}
        onDownload={handleDownloadVault}
        isDownloading={isDownloading}
      />

      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <span>Your All Passwords:</span>
        <Button onClick={() => setIsAddModalOpen(true)}>Add</Button>
      </div>

      {/* Password Table */}
      <PasswordTable
        passwords={passwords}
        onEdit={handleEditClick}
        onDelete={handleDeletePassword}
      />

      {/* Add Password Modal */}
      <AddPasswordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPassword}
        isLoading={isAddingPassword}
      />

      {/* Edit Password Modal */}
      <EditPasswordModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPassword(null);
        }}
        onEdit={handleEditPassword}
        password={editingPassword}
        isLoading={isEditingPassword}
      />
    </div>
  );
};

export default Dashboard;