export type Product = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    cart_id: string | null;
}

export type Cart = {
    id: string;
}
