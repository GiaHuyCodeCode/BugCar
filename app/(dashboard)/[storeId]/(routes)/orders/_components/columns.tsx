"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CellAction } from "./cell-action"
import CellImage from "./cell-image"

export type OrderColumns = {
    id: string,
    phone: string,
    address: string,
    products: string,
    totalPrice: string,
    images: string[],
    isPaid: boolean,
    createAt: string,
    order_status: string,
}

export const columns: ColumnDef<OrderColumns>[] = [
    {
        accessorKey: "images",
        header: "Images",
        cell: ({row}) => (
            <div className="grid grid-cols-2 gap-2">
                <CellImage data={row.original.images}/>
            </div>
        )
    },
    {
        accessorKey: "phone",
        header: "Phone"
    },
    {
        accessorKey: "address",
        header: "Address"
    },
    {
        accessorKey: "totalPrice",
        header: "Amount"
    },
    {
        accessorKey: "isPaid",
        header: "Payment Status"
    },
    {
        accessorKey: "products",
        header: "Products"
    },
    {
        accessorKey: "createAt",
        header: ({ column }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
        },
    },

    {
        id: 'actions',
        cell: ({row}) => <CellAction data={row.original}/>
    }
]
