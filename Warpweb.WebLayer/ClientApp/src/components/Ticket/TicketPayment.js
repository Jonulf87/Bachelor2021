import { Button, CardContent, Typography, Card } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import usePurchase from '../../hooks/usePurchase';

export default function TicketPayment() {

    const { userUnpaidEventTickets, payForTicket, shoppingCart } = usePurchase();
    const [noUnpaidTickets, setNoUnpaidTickets] = useState(false);


    useEffect(() => {
        if (userUnpaidEventTickets.length === 0) {
            setNoUnpaidTickets(true);
        }
        else {
            setNoUnpaidTickets(false);
        }
    }, [userUnpaidEventTickets])

    return (

        <Card>
            <CardContent>
                <Typography>
                    Trykk på knappen for å "betale", ( ͡° ͜ʖ ͡°)
                </Typography>
                <Button
                    disabled={noUnpaidTickets}
                    variant="contained"
                    color="primary"
                    onClick={payForTicket}
                >Betal</Button>
            </CardContent>
        </Card>
    )
}