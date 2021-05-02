﻿import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export const PurchaseContext = React.createContext();

const PurchaseProvider = ({ children }) => {

    const [selectedMainEventId, setSelectedMainEventId] = useState(null);
    const [ticketTypesList, setTicketTypesList] = useState([]);
    const [userEventTickets, setUserEventsTickets] = useState([]);
    const [userUnpaidEventTickets, setUnpaidUserEventsTickets] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [shoppingCart, setShoppingCart] = useState([]);
    const [paymentOk, setPaymentOk] = useState(false);
    const [checkedEula, setCheckedEula] = useState(false);

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

            }
        }
        getTicketTypes();
    }, [selectedMainEventId])

    const addTicketType = (ticketTypeId, descriptionName) => {
        const ticket = {
            id: ticketTypeId,
            descriptionName: descriptionName
        }

        setShoppingCart(oldValue => [...oldValue, ticket])
    }


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
                body: JSON.stringify(shoppingCart)
            });
            if (createTicketResponse.ok) {
                getUnpaidUserTickets();
            }
        }
    }

    const payForTicket = async () => {
        if (isAuthenticated && checkedEula) {
            const paymentResponse = await fetch(`/api/tickets/purchaseticket`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(shoppingCart),
                method: 'POST'
                
            });
            if (paymentResponse.ok) {
                setShoppingCart([]);
                setUserEventsTickets([]);
                setUnpaidUserEventsTickets([]);
                setTotalPrice(0);
                setPaymentOk(true);
                setCheckedEula(false);
            }
        }
    }



    useEffect(() => {

        const result = shoppingCart.reduce((accumulator, ticketToPurchase) => accumulator + ticketTypesList.find(a => a.id === ticketToPurchase.id).basePrice, 0);

        setTotalPrice(result);

    }, [shoppingCart])


    return <PurchaseContext.Provider value={{ checkedEula, setCheckedEula, paymentOk, setPaymentOk, shoppingCart, addTicketType, payForTicket, userUnpaidEventTickets, totalPrice, ticketTypesList, selectedMainEventId, setSelectedMainEventId, userEventTickets }}>{children}</PurchaseContext.Provider>;

};

export default PurchaseProvider;