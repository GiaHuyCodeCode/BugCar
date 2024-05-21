"use client"; 

import { Heading } from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Billboards, Store } from "@/type-db"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import toast from "react-hot-toast";
import axios from "axios";
import { AlertModal } from "@/components/modal/alert-modal";
import { Alert } from "@/components/ui/alert";
import { ApiAlert } from "@/components/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/image-update";

interface BillboardFormProps{
    initialData : Billboards
}

const formSchema= z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

export const BillboardForm = ({initialData} : BillboardFormProps)=>  {
  
  const form= useForm<z.infer<typeof formSchema>>({
    resolver :zodResolver(formSchema),
    defaultValues : initialData
});
    const [isLoading,setIsLoading]= useState(false);
    const [open,setOpen]= useState(false);
    const params = useParams();
    const router= useRouter();

    const title = initialData ? "Edit Billboard" : "Create Billboard"; 
    const description= initialData ? "Edit a billboard" : "Add a new billboard";
    const toastMessage = initialData ? "Billboard Updated" : "Billboard Created"; 
    const action = initialData ? "Save Changes" : "Create Billboard"; 


    const onSubmit= async (data : z.infer<typeof formSchema>)=> {
      try {
        setIsLoading(true);
        
        const response= await axios.patch(`/api/stores/${params.storeId}`, data);
        toast.success("Store Update");
        router.refresh();
      } catch (error) {
        toast.error("Something were wrong");
      }finally
      {
        setIsLoading(false);
      }
    };

    const onDelete= async()=> {
     try {
      setIsLoading(true);
      const response= await axios.delete(`/api/stores/${params.storeId}`);
      toast.success("Store Removed");
      router.refresh();
      router.push('/')
      
     } catch (error) {
      toast.error("Something were wrong");
     }finally{
      setIsLoading(false);
      setOpen(false);

     }

    }

  return (
    <>
    <AlertModal
      isOpen={open}
      onClose={()=> setOpen(false)}
      onConfirm={onDelete}
      loading= {isLoading}
    />
    <div className="flex items-center justify-center">
      <Heading title={title} description={description}/>
      {initialData && (
      <Button
      disabled={isLoading} 
      variant={"destructive"} 
      size={"icon"} 
      onClick={()=> setOpen(true)}>
        <Trash className="h-4 w-4"/>
      </Button>
      )}
    </div>
    

    <Separator />

    <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} 
                  className="w-full space-y-8">
                   <div className=" grid grid-cols-3 gap-8">

                    <FormField 
                        control={form.control}
                        name="imageUrl"
                        render={({field})=> (
                            <FormItem>
                                <FormLabel>Billboard Image</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                    value={field.value ? [field.value] : []} 
                                    disable= {isLoading}
                                    onChange={(url)=> field.onChange(url)}
                                    onRemove={()=> field.onChange("")}
                                    
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />  
                
                   <FormField control={form.control} name="label" render={({field}) => (
                      <FormItem>
                        <FormLabel>
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder="Your Billboard name..."
                            {... field}
                          />

                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                       )}
                      />
                   </div>
                        <Button disabled={isLoading} type="submit" variant={"outline"} size={"sm"}   >Save Changes</Button>
                  </form>
              </Form>
              

            


    </>
  )
}