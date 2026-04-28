import { create } from 'zustand';
import supabase from "../config/SupabaseClient"; 

const useWarehouseStore = create((set, get) => ({
    // Initial state
    warehouses: [],
    alerts: [],

    // Helpers to manage alerts
    removeAlert: (id) => set(state => ({
        alerts: state.alerts.filter(a => a.id !== id)
    })),
    
    addAlert: (alert) => set(state => {
        const exists = state.alerts.find(a => a.fromWarehouseId === alert.fromWarehouseId);
        if (exists) return state;
        return { alerts: [alert, ...state.alerts] };
    }),

    // Fetch all rows from warehouses table
    fetchWarehouses: async () => {
        console.log("Fetching fresh warehouse data...");
        const { data, error } = await supabase
            .from('warehouses')
            .select('id, name, lat, lng, max_capacity, current_load, reserved_space, status')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching warehouses:', error);
            return [];
        }
        
        console.log(`Fetched ${data.length} warehouses from Supabase.`);
        
        // Compute fillPercent for each warehouse and store it
        const processedData = data.map(w => {
            const capacity = w.max_capacity || 1;
            const fillPercent = (w.current_load + w.reserved_space) / capacity;
            return { ...w, fillPercent };
        });

        set({ warehouses: processedData });
        return processedData;
    },

    // Update current_load in Supabase and locally
    updateLoad: async (id, newLoad) => {
        set((state) => ({
            warehouses: state.warehouses.map((w) => {
                if (w.id === id) {
                    const capacity = w.max_capacity || 1;
                    const fillPercent = (newLoad + w.reserved_space) / capacity;
                    return { ...w, current_load: newLoad, fillPercent };
                }
                return w;
            })
        }));

        const { error } = await supabase
            .from('warehouses')
            .update({ current_load: newLoad })
            .eq('id', id);

        if (error) {
            console.error('Error updating warehouse load:', error);
            get().fetchWarehouses();
        }
    },

    // Find warehouse where fillPercent < 0.60
    findAlternate: (overflowingId) => {
        const { warehouses } = get();
        
        const alternate = warehouses.find((w) => {
            if (w.id === overflowingId || w.status === 'inactive') return false;
            // Use the pre-computed fillPercent
            return w.fillPercent < 0.60;
        });

        return alternate || null;
    },
}));

export default useWarehouseStore;
