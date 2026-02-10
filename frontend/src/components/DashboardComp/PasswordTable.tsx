"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit } from "lucide-react";

const invoices = [
  {
    id:1,
    name: "INV001",
    description: "Paid",
    password: "$250.00",
  },
  {
    id:2,
    name: "INV002",
    description: "Pending",
    password: "$150.00",
  },
  {
    id:3,
    name: "INV003",
    description: "Unpaid",
    password: "$350.00",
  },
  {
    id:4,
    name: "INV004",
    description: "Paid",
    password: "$450.00",
  },
  {
    id:5,
    name: "INV005",
    description: "Paid",
    password: "$550.00",
  },
  {
    id:6,
    name: "INV006",
    description: "Pending",
    password: "$200.00",
  },
  {
    id:7,
    name: "INV007",
    description: "Unpaid",
    password: "$300.00",
  },
]

const PasswordTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Password</TableHead>
          <TableHead className="text-right">Edit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.name}</TableCell>
            <TableCell>{invoice.description}</TableCell>
            <TableCell>{invoice.password}</TableCell>
            <TableCell className="text-right cursor-pointer"><Edit size={18} className="w-full"/></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PasswordTable