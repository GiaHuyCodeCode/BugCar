'use client'

import { useState } from "react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { Copy, Edit, MoreVertical, Trash } from "lucide-react"

import { BillboardColumns } from "./columns"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface CellActionProps {
    data: BillboardColumns
}

export const CellAction = ({data}: CellActionProps) => {
    const router = useRouter()
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success('Billboard is copied')
    }



    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="h-8 w-8 p-0" variant={'ghost'}>
                        <span className="sr-only">Open</span>
                        <MoreVertical className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuSeparator/>

                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="h-4 w-4 mr-2"/>
                        Copy Id
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}>
                        <Edit className="h-4 w-4 mr-2"/>
                        Update
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => {}}>
                        <Trash className="h-4 w-4 mr-2"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    )
}