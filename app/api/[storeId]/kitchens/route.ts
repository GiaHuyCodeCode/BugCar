import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { 
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    updateDoc
} from "firebase/firestore"
import { NextResponse } from "next/server"
import { Kitchen } from "@/type-db"

export const POST = async (req: Request, 
    {params} : {params : {storeId: string}}) => {
        try {
            const { userId } = auth()
            const body = await req.json()

            if(!userId) {
                return new NextResponse('Unauthorized', { status: 400 })
            }

            const { name, value } = body

            if(!name) {
                return new NextResponse('Kitchen name is missing!', { status: 400 })
            }

            if(!value) {
                return new NextResponse('Kitchen value is missing!', { status: 400 })
            }

            if(!params.storeId) {
                return new NextResponse('Store id is missing!', { status: 400 })
            }

            const store = await getDoc(doc(db, 'stores', params.storeId))

            if(store.exists()) {
                let storeData = store.data()

                if(storeData?.userId !== userId) {
                    return new NextResponse('Unauthorized', { status: 500 })
                } 
            }

            const kitchenData = {
                name,
                value,
                createAt: serverTimestamp()
            }

            const kitchenRef = await addDoc(
                collection(db, 'stores', params.storeId, 'kitchens'), 
                kitchenData
            )

            const id = kitchenRef.id

            await updateDoc(doc(db, 'stores', params.storeId, 'kitchens', id), {
                ...kitchenData,
                id,
                updateAt: serverTimestamp()
            })

            return NextResponse.json({id, ...kitchenData})

        } catch (err) {
            console.log(`KITCHENS_POST: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }

export const GET = async (req: Request, 
    {params} : {params : {storeId: string}}) => {
        try {
            if(!params.storeId) {
                return new NextResponse('Store id is missing!', { status: 400 })
            }

            const kitchensData = (
                await getDocs(
                    collection(doc(db, 'stores', params.storeId), 'kitchens')
                )
            ).docs.map(doc => doc.data()) as Kitchen[]

            return NextResponse.json(kitchensData)

        } catch (err) {
            console.log(`KITCHENS_GET: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }