"use client"

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { BillboardColumns, columns } from "./columns";

interface BillboardClientProps {
  data: BillboardColumns[]
}

const BillboardClient = ({data}: BillboardClientProps) => {
  const router = useRouter();
  const params= useParams();
  
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Billboards (0)`}
          description="Manage billboards for your store"
        />
        <Button onClick={()=> router.push(`/${params.storeId}/billboards/create`)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <Separator/>
      <DataTable searchKey="label" columns={columns} data={data}/>
    </>
  )
}

export default BillboardClient;
