
" use client"

import { getTotalProducts } from "@/actions/get-total-products";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getTotalSales } from "@/actions/get-total-sales";
import { Heading } from "@/components/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { formatter } from "@/lib/utils";
import { Store } from "@/type-db";
import { doc, getDoc } from "firebase/firestore";
import { DollarSign } from "lucide-react";

interface DashboardOverviewProps{
  params: {storeId : string};
}

const DashboardOverview = async({params}:DashboardOverviewProps) => {

  const totalRevenue = await getTotalRevenue(params.storeId);
  const totalSales = await getTotalSales(params.storeId);
  const totalProducts = await getTotalProducts(params.storeId);

  const store= (await getDoc(doc(db,"stores", params.storeId))).data() as Store 

  return (
    <div className="flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading title="Dashboard" description="Overview of your store"/>
      <Separator/>
      <div className="grid gap-4 grid-cols-4">
        <Card className="col-span-2">
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium"> Total Revenue </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium"> Sales </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium"> Products </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalProducts}</div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default DashboardOverview;



