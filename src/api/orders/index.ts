import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertTables, UpdateTables } from "@/src/types";

export const useAdminOrderList = ({ archived = false }) => {
    // update the admin order list to include cancelled orders
    const statuses = archived ? ['Delivered', 'Cancelled'] : ['New', 'Cooking', 'Delivering'];

    return useQuery({
        queryKey: ['orders', { archived }],
        queryFn: async () => {
            const { data, error } = await supabase.from('orders').select('*').in('status', statuses).order('created_at', { ascending: false });;

            if (error) {
                throw new Error(error.message);
            }

            return data;
        }
    });
}

export const useMyOrderList = () => {
    const { session } = useAuth();
    const id = session?.user.id;

    return useQuery({
        queryKey: ['orders', { userId: id }],
        queryFn: async () => {
            if (!id) {
                return null;
            }

            const { data, error } = await supabase.from('orders').select('*').eq('user_id', id).order('created_at', { ascending: false });

            if (error) {
                throw new Error(error.message);
            }

            return data;
        }
    });
}

export const useOrderDetails = (id: number) => {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: async () => {
            const { data, error } = await supabase.from('orders').select('*, order_items(*, products(*))').eq('id', id).single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        }
    });
}

export const useInsertOrder = () => {
    const queryClient = useQueryClient();
    const { session } = useAuth();
    const userId = session?.user.id;

    return useMutation({
        async mutationFn(data: InsertTables<'orders'>) {
            const { data: newProduct, error } = await supabase.from('orders').insert({ ...data, user_id: userId }).select().single()

            if (error) {
                throw new Error(error.message);
            }

            return newProduct;
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['orders'] });

        },
    })
}

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn({ id, updatedFields }: { id: number, updatedFields: UpdateTables<'orders'> }) {
            const { data: updatedOrder, error } = await supabase.from('orders').update(updatedFields).eq('id', id).select().single()

            if (error) {
                throw new Error(error.message);
            }

            return updatedOrder;
        },
        async onSuccess(_, { id }) {
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
            await queryClient.invalidateQueries({ queryKey: ['orders', id] });
        },
    })
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(orderId: number) {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'Cancelled' })
                .eq('id', orderId);

            if (error) {
                throw new Error(error.message);
            }
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
    });
};