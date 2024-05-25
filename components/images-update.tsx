"use client"

import { storage } from "@/lib/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { url } from "inspector";
import {  ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {PuffLoader} from "react-spinners"
import { Button } from '@/components/ui/button'

interface ImagesUploadProps{
    disable? : boolean;
    onChange: (value : string[]) => void;
    onRemove: (value : string) => void;
    value: string[];
}

const ImagesUpload = ({disable, onChange,onRemove,value} : ImagesUploadProps ) => {
    
    const [isMounted, setIsMounted]= useState (false)
    const [isLoading, setIsLoading]= useState (false)
    const [progress, setProgress]= useState<number>(0)

    useEffect(()=> {
        setIsMounted(true)
    }, []);

    if (!isMounted)
        {
            return null;
        }

    const onUpload= async (e: any) => {
        
    };
    
    const onDelete = (url: string) => {
        
    }

    return (
        <div> 
            {value && value.length > 0 ? (
                <>
                    <div className="mb-4 flex items-center gap-4">
                        {value.map(url => (
                            <div className="relative w-52 h-52 rounded-md overflow-hidden" key={url}>
                                <Image
                                    fill 
                                    className="object-cover"
                                    alt="Billboard Image"
                                    src= {url}
                                />
                                <div className="absolute z10 top-2 right-2">
                                    <Button type="button" onClick={() => onDelete(url)} variant='destructive' size='icon'>
                                        <Trash className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ):(
                <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center flex-col gap-3">
                   {isLoading ? 
                        <>
                            <PuffLoader size={30} color="#555" />
                            <p>{`${progress.toFixed(2)}%`}</p>
                        </>:
                        <>
                            <label>
                                <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                                    <ImagePlus className="h-4 w-4" />
                                    <p>Upload an image</p>
                                </div>
                                <input 
                                    type="file" 
                                    onChange={onUpload} 
                                    accept="image/*" 
                                    className="w-0 h-0"
                                    multiple
                                />
                            </label>
                        </>
                    } 
                </div>
            )}
        </div>
    );
};

export default ImagesUpload;