import { Timestamp } from "firebase/firestore";

export interface Store {
    id: string,
    name: string,
    userId: string,
    createAt?: Timestamp;
    updateAt?: Timestamp;

}

export interface Billboards {
    id: string,
    label: string,
    imageUrl: string,
    createAt?: Timestamp;
    updateAt?: Timestamp;
}

export interface Category {
    id: string,
    billboardId: string,
    billboardLabel: string,
    name: string,
    createAt?: Timestamp;
    updateAt?: Timestamp;
}

export interface Size {
    id: string,
    name: string,
    value: string,
    createAt?: Timestamp;
    updateAt?: Timestamp;
}

export interface Kitchen {
    id: string,
    name: string,
    value: string,
    createAt?: Timestamp;
    updateAt?: Timestamp;
}

export interface Brand {
    id: string,
    name: string,
    value: string,
    createAt?: Timestamp;
    updateAt?: Timestamp;
}

export interface Product {
    id: string,
    name: string,
    price: number,
    quantity?: number,
    images: { url: string[] },
    isFeatured: boolean,
    isArchived: boolean,
    category: string,
    size: string,
    kitchen: string,
    brand: string,
    createAt?: Timestamp;
    updateAt?: Timestamp;
}