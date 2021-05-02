import { Button, CardContent, Typography, Card } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import usePurchase from '../../hooks/usePurchase';

export default function TicketPayment() {

    const { payForTicket, shoppingCart, paymentOk } = usePurchase();
    const [noUnpaidTickets, setNoUnpaidTickets] = useState(false);


    useEffect(() => {
        if (shoppingCart.length === 0) {
            setNoUnpaidTickets(true);
        }
        else {
            setNoUnpaidTickets(false);
        }
    }, [shoppingCart])

    return (

        <Card>
            { paymentOk ?
                <CardContent>
                    <Typography>
                        Takk for kjøpet. Vi gleder oss til å se deg på arrangementet.
                    </Typography>
                </CardContent>
                :
                <CardContent>
                    <Typography>
                        Trykk på knappen for å "betale", (͡° ͜ʖ ͡°)
                    </Typography >
                    <Button
                        disabled={noUnpaidTickets}
                        variant="contained"
                        color="primary"
                        onClick={payForTicket}
                    >Betal</Button>
                </CardContent>
            }
        </Card >



    )
}