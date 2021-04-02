﻿import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';

export const CurrentEventContext = React.createContext();

const CurrentEventProvider = ({ children }) => {

    const [currentEvent, setCurrentEvent] = useState("");
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getCurrentMainEvent = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/events/getcurrentmainevent', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                setCurrentEvent(result.name);
            }
        }
        getCurrentMainEvent();
    }, [isAuthenticated]);


    return <CurrentEventContext.Provider value={{ currentEvent, setCurrentEvent }}>{children}</CurrentEventContext.Provider>;

};

export default CurrentEventProvider;