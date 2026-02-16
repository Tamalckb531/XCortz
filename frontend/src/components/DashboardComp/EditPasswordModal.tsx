"use client";
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from './Textarea';
import { EditPasswordModalProps } from '@/lib/types';

/**
 * EDIT PASSWORD MODAL COMPONENT
 * 
 * Form for editing an existing password entry
 * Pre-fills with current values
 * Emits onEdit event with updated data
 */


export const EditPasswordModal = ({
  isOpen,
  onClose,
  onEdit,
  password,
  isLoading = false,
}: EditPasswordModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  // Pre-fill form when password prop changes
  useEffect(() => {
    if (password) {
      setName(password.name);
      setDescription(password.description);
      setPasswordValue(password.password);
    }
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) return;

    if (!name.trim() || !description.trim() || !passwordValue.trim()) {
      alert('Please fill in all fields');
      return;
    }

    onEdit(password.id, {
      name,
      description,
      password: passwordValue,
    });
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setPasswordValue('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., aws-prod, github-personal"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e:any) => setDescription(e.target.value)}
                placeholder="e.g., AWS Production Console"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-password">Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};