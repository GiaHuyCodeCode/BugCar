import { db } from "@/lib/firebase";
import { Store } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { z } from "zod";

const storeSchema = z.object({
  name: z.string().min(3, "Store name is required 3 letter"),
});

export const PATCH= async(req: Request, 
    {params}:{params: {storeId : string}})=> {
    
  try
  {       
      const {userId}= auth();
      const body=await req.json()

      if(!userId)
          {
              return new NextResponse("Un-Authorized", {status : 400})
          }

          if(!params.storeId)
            {
                return new NextResponse("Store Id is Required", {status : 400})
            }
  
          const {name} =body;
          
          if(!name){
              return new NextResponse("Store Name is missing!", {status:400})
          }

        const docRef= doc(db,"stores", params.storeId);
        await updateDoc(docRef, {name});
        const store= (await getDoc(docRef)).data() as Store
       
        return NextResponse.json({ store });

       

  }catch (error)
  {
      console.log('STORE_PATCH: ${error}')
      return new NextResponse("Internal Server Error", {status : 500})
  }

};



export const DELETE= async(req: Request, 
    {params}:{params: {storeId : string}})=> {
    
  try
  {       
      const {userId}= auth();

      if(!userId)
          {
              return new NextResponse("Un-Authorized", {status : 400})
          }

          if(!params.storeId)
            {
                return new NextResponse("Store Id is Required", {status : 400})
            }
  
         

        const docRef= doc(db,"stores", params.storeId);

            // TODO : DELETE ALL THE SUBCOLLECTIONS- AND ALONG WITH THOSE DATA FILE URL
        await deleteDoc(docRef);


       return NextResponse.json({
        msg: "Store and all of its sub-collections deleted"
       })

  }catch (error)
  {
      console.log('STORE_PATCH: ${error}')
      return new NextResponse("Internal Server Error", {status : 500})
  }

};