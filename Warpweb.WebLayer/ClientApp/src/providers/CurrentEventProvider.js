import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export const CurrentEventContext = React.createContext();

const CurrentEventProvider = ({ children }) => {

    const [currentEvent, setCurrentEvent] = useState("");
    const [currentEventChangeCompleteTrigger, setCurrentEventChangeCompleteTrigger] = useState(false);
    const [newEventSet, setNewEventSet] = useState(false);

    const { isAuthenticated, token, refreshToken } = useAuth();

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
    }, [isAuthenticated, newEventSet]);

    const setSelectedEvent = async (eventId) => {  
        if (isAuthenticated) {
            await fetch('/api/events/setcurrentevent', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'put',
                body: JSON.stringify(eventId)
            });

            setNewEventSet(oldValue => !oldValue);
            refreshToken(0, () => {
                setCurrentEventChangeCompleteTrigger(oldvalue => !oldvalue);
            });
        }
    }


    return <CurrentEventContext.Provider value={{ setSelectedEvent, currentEvent, setCurrentEvent, currentEventChangeCompleteTrigger, setCurrentEventChangeCompleteTrigger }}>{children}</CurrentEventContext.Provider>;

};

export default CurrentEventProvider;