import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export const PurchaseContext = React.createContext();

const PurchaseProvider = ({ children }) => {

    const [selectedMainEventId, setSelectedMainEventId] = useState(null);
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [ticketTypesList, setTicketTypesList] = useState([]);
    const [userEventTickets, setUserEventsTickets] = useState([]);

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getTicketTypes = async () => {
            const ticketTypesResponse = await fetch(`/api/tickettypes/eventtickettypes/${selectedMainEventId}`, {
                headers: {
                    'content-type': 'application/json'
                }
            });
            const ticketTypesResult = await ticketTypesResponse.json();
            setTicketTypesList(ticketTypesResult);
        }
        getTicketTypes();
    }, [selectedMainEventId])


    const getUserTickets = async () => {
        if (isAuthenticated) {
            const ticketsResponse = await fetch(`/api/tickets/alltickets/${selectedMainEventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'appliction/json'
                }
            });
            if (ticketsResponse.ok) {
                setUserEventsTickets(await ticketsResponse.json())
            }
        }
    }


    const generateTickets = async () => {
        if (isAuthenticated) {
            const createTicketResponse = await fetch('/api/tickets/createticket', {
                header: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'aaplicaiton/json'
                },
                method: 'POST',
                body: JSON.stringify(selectedTickets)
            });
            if (createTicketResponse.ok) {
                getUserTickets();
            }
        }
    }


    return <PurchaseContext.Provider value={{ ticketTypesList, generateTickets, setSelectedTickets, selectedMainEventId, setSelectedMainEventId, userEventTickets }}>{children}</PurchaseContext.Provider>;

};

export default PurchaseProvider;