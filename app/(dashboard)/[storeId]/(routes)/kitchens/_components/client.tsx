"use client"

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import ApiList from "@/components/api-list";
import { KitchenColumns, columns } from "./columns";

interface KitchenClientProps {
  data: KitchenColumns[]
}

const KitchenClient = ({ data }: KitchenClientProps) => {
    const router = useRouter();
    const params= useParams();
  
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Kitchens (${data.length})`}
                    description="Manage kitchens for your store"
                />
                <Button onClick={()=> router.push(`/${params.storeId}/kitchens/create`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                </Button>
            </div>

            <Separator/>
            <DataTable searchKey="name" columns={columns} data={data}/>

            <Heading title="API" description="API calls for kitchens"/>
            <Separator/>
            <ApiList entityName="kitchens" entityNameId="kitchenId"/>
        </>
    )
}

export default KitchenClient;
