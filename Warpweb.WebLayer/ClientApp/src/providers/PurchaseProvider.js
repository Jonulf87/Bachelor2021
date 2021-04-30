import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export const PurchaseContext = React.createContext();

const PurchaseProvider = ({ children }) => {

    const [selectedMainEventId, setSelectedMainEventId] = useState(null);
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [ticketTypesList, setTicketTypesList] = useState([]);
    const [userEventTickets, setUserEventsTickets] = useState([]);
    const [userUnpaidEventTickets, setUnpaidUserEventsTickets] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0); 
    const [amountError, setAmountError] = useState(false);

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getTicketTypes = async () => {
            if (selectedMainEventId !== null && selectedMainEventId > 0) {

                const ticketTypesResponse = await fetch(`/api/tickettypes/eventtickettypes/${selectedMainEventId}`, {
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                const ticketTypesResult = await ticketTypesResponse.json();
                setTicketTypesList(ticketTypesResult);
                setTotalPrice(0);
                if (selectedTickets?.length < ticketTypesResult.length) {
                    setSelectedTickets(ticketTypesResult);
                }
            }
        }
        getTicketTypes();
    }, [selectedMainEventId])


    const getUserTickets = async () => {
        if (isAuthenticated) {
            const ticketsResponse = await fetch(`/api/tickets/alltickets/${selectedMainEventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            if (ticketsResponse.ok) {
                setUserEventsTickets(await ticketsResponse.json())
            }
        }
    }

    const getUnpaidUserTickets = async () => {
        if (isAuthenticated) {
            const ticketsResponse = await fetch(`/api/tickets/allticketsunpaid/${selectedMainEventId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            if (ticketsResponse.ok) {
                setUnpaidUserEventsTickets(await ticketsResponse.json())
            }
        }
    }


    const generateTickets = async () => {
        if (isAuthenticated) {
            const createTicketResponse = await fetch('/api/tickets/createticket', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(selectedTickets)
            });
            if (createTicketResponse.ok) {
                getUnpaidUserTickets();
            }
        }
    }

    const handleSelectedTickets = (amount, id) => {
        if (amount < 0) {
            setAmountError(true);
            return
        }
        const ticketType = ticketTypesList.find(a => a.id === id);
        ticketType.amountToBuy = amount;
        setSelectedTickets(oldValue => [...oldValue.filter(a => a.id !== id), ticketType]);
        setAmountError(false);
    }

    useEffect(() => {
        const calculateTotalPrice = () => {
            let tempTotal = 0;
            selectedTickets.forEach(ticketType => tempTotal = (ticketType.basePrice * ticketType.amountToBuy + tempTotal));
            setTotalPrice(tempTotal);
        }
        calculateTotalPrice();

    }, [selectedTickets])


    return <PurchaseContext.Provider value={{ amountError, userUnpaidEventTickets, selectedTickets, totalPrice, ticketTypesList, generateTickets, handleSelectedTickets, selectedMainEventId, setSelectedMainEventId, userEventTickets }}>{children}</PurchaseContext.Provider>;

};

export default PurchaseProvider;