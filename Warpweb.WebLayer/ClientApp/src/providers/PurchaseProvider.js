import { Shop } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useCurrentEvent from '../hooks/useCurrentEvent';

export const PurchaseContext = React.createContext();

const PurchaseProvider = ({ children }) => {
    const [selectedMainEventId, setSelectedMainEventId] = useState(null);
    const [ticketTypesList, setTicketTypesList] = useState([]);
    const [userTickets, setUserTickets] = useState([]);
    const [userUnpaidEventTickets, setUnpaidUserEventsTickets] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [shoppingCart, setShoppingCart] = useState([]);
    const [paymentOk, setPaymentOk] = useState(false);
    const [checkedEula, setCheckedEula] = useState(false);

    const { isAuthenticated, token } = useAuth();
    const { setSelectedEvent } = useCurrentEvent();

    useEffect(() => {
        const getTicketTypes = async () => {
            if (selectedMainEventId !== null && selectedMainEventId > 0) {
                const ticketTypesResponse = await fetch(`/api/tickettypes/eventtickettypes/${selectedMainEventId}`, {
                    headers: {
                        'content-type': 'application/json',
                    },
                });
                const ticketTypesResult = await ticketTypesResponse.json();
                setTicketTypesList(ticketTypesResult);
                setTotalPrice(0);
            }
        };
        getTicketTypes();
    }, [selectedMainEventId]);

    const addTicketType = (ticketTypeId, descriptionName) => {
        const ticket = {
            id: ticketTypeId,
            descriptionName: descriptionName,
        };

        setShoppingCart((oldValue) => [...oldValue, ticket]);
    };

    const removeTicketType = (descriptionName) => {
        const indexOfTicket = shoppingCart.map((a) => a.descriptionName).indexOf(descriptionName);
        const newShoppingCart = [...shoppingCart];

        if (indexOfTicket !== -1) {
            newShoppingCart.splice(indexOfTicket, 1);
            setShoppingCart(newShoppingCart);
        }
    };

    useEffect(() => {
        const getUserTickets = async () => {
            if (isAuthenticated) {
                const ticketsResponse = await fetch(`/api/tickets/usertickets`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                if (ticketsResponse.ok) {
                    setUserTickets(await ticketsResponse.json());
                } else {
                    setUserTickets([]);
                }
            }
        };
        getUserTickets();
    }, [paymentOk, isAuthenticated]);

    const getUnpaidUserTickets = async () => {
        if (isAuthenticated) {
            const ticketsResponse = await fetch(`/api/tickets/allticketsunpaid/${selectedMainEventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
            });
            if (ticketsResponse.ok) {
                setUnpaidUserEventsTickets(await ticketsResponse.json());
            }
        }
    };

    const generateTickets = async () => {
        if (isAuthenticated) {
            const createTicketResponse = await fetch('/api/tickets/createticket', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(shoppingCart),
            });
            if (createTicketResponse.ok) {
                getUnpaidUserTickets();
            }
        }
    };

    const payForTicket = async () => {
        if (isAuthenticated && checkedEula) {
            const paymentResponse = await fetch(`/api/tickets/purchaseticket`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                body: JSON.stringify(shoppingCart),
                method: 'POST',
            });
            if (paymentResponse.ok) {
                setSelectedEvent(selectedMainEventId);
                setShoppingCart([]);
                setUnpaidUserEventsTickets([]);
                setTotalPrice(0);
                setPaymentOk(true);
                setCheckedEula(false);
            }
        }
    };

    useEffect(() => {
        const result = shoppingCart.reduce(
            (accumulator, ticketToPurchase) => accumulator + ticketTypesList.find((a) => a.id === ticketToPurchase.id).basePrice,
            0,
        );

        setTotalPrice(result);
    }, [shoppingCart]);

    return (
        <PurchaseContext.Provider
            value={{
                setShoppingCart,
                removeTicketType,
                checkedEula,
                setCheckedEula,
                paymentOk,
                setPaymentOk,
                shoppingCart,
                addTicketType,
                payForTicket,
                userUnpaidEventTickets,
                totalPrice,
                ticketTypesList,
                selectedMainEventId,
                setSelectedMainEventId,
                userTickets,
                setUserTickets,
            }}
        >
            {children}
        </PurchaseContext.Provider>
    );
};

export default PurchaseProvider;
