import { Button, CardContent, Typography, Card } from '@material-ui/core';
import React from 'react';
import useAuth from '../../hooks/useAuth';
import usePurchase from '../../hooks/usePurchase';

export default function TicketPayment() {

    const { userUnpaidEventTickets } = usePurchase();
    const { isAuthenticated, token } = useAuth();

    const payForTicket = async (ticket) => {
        if (isAuthenticated) {
            await fetch(`/api/tickets/purchaseticket/${ticket.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            })
        }
    }

    const handleClick = (e) => {
        userUnpaidEventTickets.foreach((unpaidTicket) => (
            payForTicket(unpaidTicket)
        ))
    }




    return (

        <Card>
            <CardContent>
                <Typography>
                    Trykk på knappen for å "betale", ( ͡° ͜ʖ ͡°)
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                >Betal</Button>
            </CardContent>
        </Card>
    )
}