import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

export const SeatMapContext = React.createContext();

const SeatMapProvider = ({ children }) => {

    const [rows, setRows] = useState([]);
    const { isAuthenticated, token } = useAuth();

    const getSeatMap = async () => {

        if (isAuthenticated) {
            const responseSeatMap = await fetch('/api/seatmap/publicseatmap', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            setRows(await responseSeatMap.json());
        }

    }

    return <SeatMapContext.Provider value={{ getSeatMap, rows }}>{children}</SeatMapContext.Provider>;

};

export default SeatMapProvider;