"use client"; 

import { Heading } from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Store } from "@/type-db"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface SettingFormProps{
    initialData : Store
}

const formSchema= z.object({
  name: z.string().min(3,{message : "Store name should be minimum 3 characters"})
});

export const SettingsForm = ({initialData} : SettingFormProps)=>  {
  
  const form= useForm<z.infer<typeof formSchema>>({
    resolver :zodResolver(formSchema),
    defaultValues : initialData
});
    const [isLoading,setIsLoading]= useState(false)
    const params = useParams()
    const router= useRouter()

    const onSubmit= async (data : z.infer<typeof formSchema>)=> {
      console.log(data)
    };

  
  return (
    <>
    <div className="flex items-center justify-center">
      <Heading title="Settings" description="Manage Store Preferences"/>
      <Button variant={"destructive"} size={"icon"} onClick={()=> {}}>
        <Trash className="h-4 w-4"/>
      </Button>
    </div>
    

    <Separator />

    <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                   <div className=" grid grid-cols-3 gap-8">
                   <FormField control={form.control} name="name" render={({field}) => (
                      <FormItem>
                        <FormLabel>
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder="Your store name..."
                            {... field}
                          />

                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                       )}
                      />
                   </div>
                        <Button disabled={isLoading} type="submit" variant={"outline"} size={"sm"} >Save Changes</Button>
                  </form>
              </Form>



    </>
  )
}
