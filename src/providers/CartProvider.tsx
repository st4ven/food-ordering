import { createContext, PropsWithChildren, useContext, useState } from "react";
import { CartItem, Tables } from "../types";
import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "../api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../api/order-items";
import { initializePaymentSheet, openPaymentSheet } from "../lib/stripe";

type Product = Tables<'products'>

type CartType = {
    items: CartItem[];
    addItem: (product: Product, size: CartItem['size']) => void;
    updateQuantity: (itemId: String, amount: -1 | 1) => void;
    total: number,
    checkout: () => void
}
const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {},
    updateQuantity: () => {},
    total: 0,
    checkout: () => {}
});

const CartProvider = ({ children }: PropsWithChildren ) => {
    const [items, setItems] = useState<CartItem[]>([])

    const { mutate: insertOrder } = useInsertOrder();
    const { mutate: insertOrderItems } = useInsertOrderItems();
    const router = useRouter();

    const addItem = (product : Product, size: CartItem['size']) => {
        // if already in cart, increment quantity
        const existingItems = items.find(item => item.product == product && item.size == size);

        if (existingItems) {
            updateQuantity(existingItems.id, 1);
            return;
        }

        const newCartItem: CartItem = {
            id: randomUUID(),    // generate
            product,
            product_id: product.id,
            size,
            quantity: 1
        }

        setItems([newCartItem, ...items])
    }

    // update quantity
    const updateQuantity = (itemId: String, amount: -1 | 1) => {
        setItems(items.map(item => item.id != itemId ? item : {...item, quantity: item.quantity + amount}).filter((item) => item.quantity > 0))
    }

    const total = items.reduce((sum, item) => (sum += item.product.price * item.quantity), 0);

    const clearCart = () => {
        setItems([]);
    }

    const saveOrderItems = (order : Tables<'orders'>) => {
        const orderItems = items.map(cartItem => ({
            order_id: order.id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            size: cartItem.size
        }))
        insertOrderItems(orderItems, { onSuccess() {
            clearCart();
            router.push(`/(user)/orders/${order.id}`)
        }})
    }

    const checkout = async () => {
        await initializePaymentSheet(Math.floor(total * 100));
        const paid = await openPaymentSheet();

        if (!paid) {
            return;
        }

        insertOrder({ total }, { onSuccess: saveOrderItems})
    }

    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, total, checkout }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;

export const useCart = () => useContext(CartContext);