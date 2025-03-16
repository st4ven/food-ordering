import { StatusBar } from "expo-status-bar";
import { View, Text, Platform, FlatList, TextInput, StyleSheet } from "react-native";
import { useCart } from "../providers/CartProvider";
import CartListItem from "../components/CartListItem";
import Button from "../components/Button";
import TipSelection from "../components/TipSelection";
import { useState } from "react";

const CartScreen = () => {
    const [tip, setTip] = useState<number>(0);
    const { items, total, checkout } = useCart()

    const handleCheckout = () => {
        checkout(tip);
    };

    return (
        <View style={{ padding: 10 }}>
            <FlatList data={items} renderItem={({item}) => <CartListItem cartItem={item} />} contentContainerStyle={{ gap: 10 }}/>

            {items.length != 0 ? <TipSelection onTipChange={setTip} /> : ""}
            
            <Text style={{ marginTop: 20, fontSize: 20, fontWeight: '500' }}>Total: ${(total + tip).toFixed(2)}</Text>
            <Button onPress={handleCheckout} text="Checkout" />
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    )
}

export default CartScreen;