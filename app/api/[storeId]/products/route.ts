import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { 
    addDoc,
    and,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore"
import { NextResponse } from "next/server"
import { Product } from "@/type-db"


export const POST = async (req: Request, 
    {params} : {params : {storeId: string}}) => {
        try {
            const { userId } = auth()
            const body = await req.json()

            if(!userId) {
                return new NextResponse('Unauthorized', { status: 400 })
            }

            const { 
                name, 
                price,
                images,
                isFeatured,
                isArchived,
                category,
                size,
                kitchen,
                brand,
             } = body

            if(!name) {
                return new NextResponse('Product name is missing!', { status: 400 })
            }

            if(!images || !images.length) {
                return new NextResponse('Images are required!', { status: 400 })
            }

            if(!price) {
                return new NextResponse('Price is missing!', { status: 400 })
            }

            if(!category) {
                return new NextResponse('Category is missing!', { status: 400 })
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

            const productData = {
                name,
                price,
                images,
                isFeatured,
                isArchived,
                category,
                size,
                kitchen,
                brand,
                createAt: serverTimestamp()
            }

            const productRef = await addDoc(
                collection(db, 'stores', params.storeId, 'products'), 
                productData
            )

            const id = productRef.id

            await updateDoc(doc(db, 'stores', params.storeId, 'products', id), {
                ...productData,
                id,
                updateAt: serverTimestamp()
            })

            return NextResponse.json({id, ...productData})

        } catch (err) {
            console.log(`PRODUCTS_POST: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }

export const GET = async (req: Request, 
    {params} : {params : {storeId: string}}) => {
        try {
            if(!params.storeId) {
                return new NextResponse('Store id is missing!', { status: 400 })
            }

            // get searchParams
            const {searchParams} = new URL(req.url)
            const productRef = collection(doc(db, 'stores', params.storeId), 'products')
            let productQuery
            let queryContraints = []

            if(searchParams.has('size')) {
                queryContraints.push(where('size', '==', searchParams.get('size')))
            }
            if(searchParams.has('category')) {
                queryContraints.push(where('category', '==', searchParams.get('category')))
            }
            if(searchParams.has('kitchen')) {
                queryContraints.push(where('kitchen', '==', searchParams.get('kitchen')))
            }
            if(searchParams.has('brand')) {
                queryContraints.push(where('brand', '==', searchParams.get('brand')))
            }
            if(searchParams.has('isFeatured')) {
                queryContraints.push(
                    where(
                        'isFeatured', 
                        '==', 
                        searchParams.get('isFeatured') === 'true' ? true : false
                    )
                )
            }
            if(searchParams.has('isArchived')) {
                queryContraints.push(
                    where(
                        'isArchived', 
                        '==', 
                        searchParams.get('isArchived') === 'true' ? true : false
                    )
                )
            }

            if(queryContraints.length > 0) {
                productQuery = query(productRef, and(...queryContraints))
            }else {
                productQuery = query(productRef)
            }

            // execute the query
            const querySnapshot = await getDocs(productQuery)
            const productData: Product[] = querySnapshot.docs.map(doc => doc.data() as Product)

            return NextResponse.json(productData)
            
        } catch (err) {
            console.log(`PRODUCTS_GET: ${err}`)
            return new NextResponse("Internal Server Error", {status : 500})
        }
    }