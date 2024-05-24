import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import { Kitchen } from "@/type-db";
import { KitchenForm } from "./_components/kitchen-form";

const CategoryPage = async ({params}: {params : {kitchenId : string, storeId : string}}) => {
    
    const kitchen = (
        await getDoc(doc(db, "stores", params.storeId, "kitchens", params.kitchenId))
    ).data() as Kitchen; 

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <KitchenForm initialData={kitchen}/>
        </div>
    );
};
export default CategoryPage;