import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/firebase";
import initMiddleware from "@/lib/init-middleware";
import {Product} from "@/type-db";
import {addDoc,collection,doc,serverTimestamp,updateDoc} from "firebase/firestore"
import Cors from 'cors'
import { NextApiRequest, NextApiResponse } from "next";

// const cors = initMiddleware(
//     Cors({
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//         allowedHeaders: ['Content-Type', 'Authorization'],
//     })
// )

// export const OPTIONS = async (req: NextApiRequest, res: NextApiResponse) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.status(200).end();
// };

const corsHeaders = {
    "Access-Control-Allow-Origin" : "http://localhost:3000",
    "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type",
};

export const OPTIONS = async () => {
    return NextResponse.json({}, {headers:corsHeaders});
}

export const POST=async(
    req:NextResponse,
    {params}:{params:{storeId:string}}
)=>{    
    // await cors(req, res)
    try {
        const {products, userId}=await req.json();
        const line_items : Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    
        products.forEach((item:Product) => {
            line_items.push({
                quantity:item.quantity,
                price_data: {
                    currency:"USD",
                    product_data:{
                        name:item.name,
                    },
                    unit_amount: Math.round(item.price * 100),
                },
            });
        });
        const orderData={
            isPaid:false,
            orderItems:products,
            userId,
            order_status:"Processing",
            createAt: serverTimestamp(),
        }  
    
        const orderRef = await addDoc(
            collection(db,"stores",params.storeId,"orders"), orderData
        );
    
        const id = orderRef.id;
    
        await updateDoc(doc(db,"stores",params.storeId,"orders",id),{
            ...orderData,
            id,
            updateAt:serverTimestamp(),
        });
    
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode:"payment",
            billing_address_collection:"required",
            shipping_address_collection:{
                allowed_countries:["US","CA","GB","AU","VN"]
            },
            phone_number_collection:{
                enabled:true,
            },
            success_url:`${process.env.FRONTEND_STORE_URL}/cart?success=1`,
            cancel_url:`${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
            metadata:{
                orderId:id,
                storeId:params.storeId,
            }
        });
    
        return NextResponse.json({url: session.url}, {headers: corsHeaders})
        // res.status(200).json({ url: session.url });
    } catch (err) {
        console.log(err);
        return NextResponse.error()
        // res.status(500).json({ error: 'Internal Server Error' });
    }
};