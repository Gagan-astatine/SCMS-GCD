import { useEffect, useState } from 'react';
import useWarehouseStore from '../store/warehouseStore';

const useWarehouseMonitor = () => {
    const { 
        warehouses, 
        fetchWarehouses, 
        findAlternate,
        addAlert,
        alerts 
    } = useWarehouseStore();

    const [overflowing, setOverflowing] = useState([]);

    const pollAndProcess = async () => {
        const data = await fetchWarehouses();
        if (!data) return;

        // Filter warehouses where fillPercent > 0.85
        const currentOverflowing = data.filter(w => w.fillPercent > 0.85);

        // Process alerts for overflowing warehouses
        currentOverflowing.forEach(w => {
            const alt = findAlternate(w.id);
            if (alt) {
                addAlert({
                    id: `alert-${w.id}`, 
                    truckId: 'TRK-AUTO-999', 
                    warehouseName: w.name,
                    fillPercent: Math.round(w.fillPercent * 100),
                    alternateSuggested: alt.name,
                    fromWarehouseId: w.id,
                    toWarehouseId: alt.id,
                    warehouse: w,
                    alternate: alt
                });
            }
        });

        // Store them as overflowing
        setOverflowing(currentOverflowing);
    };

    useEffect(() => {
        pollAndProcess();

        const intervalId = setInterval(() => {
            pollAndProcess();
        }, 10000);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    // Return the required structure
    return { warehouses, overflowing, alerts };
};

export default useWarehouseMonitor;
