import { Text, FlatList, ActivityIndicator } from "react-native";
import OrderListItem from "@/src/components/OrderListItem";
import { useAdminOrderList } from "@/src/api/orders";

export default function OrdersScreen() {
    const { data : orders, error, isLoading } = useAdminOrderList({ archived: true});
    
        if (isLoading) {
            <ActivityIndicator />
        }
    
        if (error) {
            return <Text>Failed to fetch</Text>
        }
    return (
        <FlatList data={orders} renderItem={({item}) => <OrderListItem order={item}/>} contentContainerStyle={{ gap: 10, padding: 10 }}/>
    )
}