"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { PasswordTableProps } from '@/lib/types';

/**
 * PASSWORD TABLE COMPONENT
 * 
 * Displays all passwords in a table
 * Emits onEdit and onDelete events
 */

const PasswordTable = ({ passwords, onEdit, onDelete }: PasswordTableProps) => {
  const handleDelete = (passwordId: number, passwordName: string) => {
    const confirmed = confirm(`Are you sure you want to delete "${passwordName}"?`);
    if (confirmed) {
      onDelete(passwordId);
    }
  };

  if (passwords.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-sm">No passwords yet. Click "Add" to create your first password.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Password</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {passwords.map((password) => (
          <TableRow key={password.id}>
            <TableCell className="font-medium">{password.name}</TableCell>
            <TableCell>{password.description}</TableCell>
            <TableCell>{password.password}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(password)}
                >
                  <Edit size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(password.id, password.name)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PasswordTable;