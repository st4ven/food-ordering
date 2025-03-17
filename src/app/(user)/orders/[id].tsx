import { useCancelOrder, useOrderDetails } from "@/src/api/orders";
import { useUpdateOrderSubscription } from "@/src/api/orders/subscriptions";
import Button from "@/src/components/Button";
import OrderItemListItem from "@/src/components/OrderItemListItem";
import OrderListItem from "@/src/components/OrderListItem";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";

export default function OrderDetailsScreen() {
    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString == 'string' ? idString : idString[0]);

    const { data: order, isLoading, error } = useOrderDetails(id);
    const { mutate: cancelOrder } = useCancelOrder();

    useUpdateOrderSubscription(id);

    const onCancel = () => {
        // cancel the order
        cancelOrder(id);
    }

    const confirmCancel = () => {
        // confirm if the user wants to cancel the order
        Alert.alert("Confirm", "Are you sure you want to cancel this order?", [
            {
                text: 'No'
            },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: onCancel
            }
        ])
    }

    if (isLoading) {
        return <ActivityIndicator />
    }

    if (error || !order) {
        return <Text>Failed to fetch products</Text>
    }

    return (
        <View style={{ padding: 10, gap: 20, flex: 1 }}>
            <Stack.Screen options={{ title: `Order #${id}` }} />
            <OrderListItem order={order} />

            <FlatList data={order.order_items} renderItem={({ item }) => <OrderItemListItem item={item} />} contentContainerStyle={{ gap: 10 }} />

            {/* Cancel the order only if it is new */}
            {order.status == 'New' ? <Button onPress={confirmCancel} text="Cancel Order" /> : ""}
        </View>
    )
}