import { TextField, Grid, Button } from '@material-ui/core';
import React, { useState } from 'react';
import { Form } from 'reactstrap/lib';
import authService from '../api-authorization/AuthorizeService';
import SaveIcon from '@material-ui/icons/Save';

export default function TicketTypeAdminForm() {

    let [ticketTypeName, setTicketTypeName] = useState("");
    let [basePrice, setBasePrice] = useState(0);
    let [amountAvailable, setAmountAvailable] = useState(0);

    const ticketTypeDataToBeSent =
    {
        'descriptionName': ticketTypeName,
        'basePrice': basePrice,
        'amountAvailable': amountAvailable
    }

    const submitForm = async () => {
        const authenticationResult = await authService.isAuthenticated();
        if (authenticationResult) {
            const accessToken = await authService.getAccessToken();
            const response = await fetch('/api/tickettypes/createTicketType', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(ticketTypeDataToBeSent)
            });
            const result = response.json();
            console.log(result);
        }
    }

    const inputProps = {
        step: 10,
    };


    return (
        <Form>
            <Grid container>
                {/*name input*/}
                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        className="KommerEnStyleTing"
                        id="ticketTypeName"
                        label="Navn på billettype"
                        required
                        value={ticketTypeName}
                        onChange={(e) => setTicketTypeName(e.target.value)}
                    />
                </Grid>

                {/*baseprice input*/}
                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        className="KommerEnStyleTing"
                        id="basePrice"
                        label="Grunnpris på billettype"
                        required
                        type="number"
                        inputProps={inputProps}
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                    />
                </Grid>

                {/*Amount input*/}
                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        className="KommerEnStyleTing"
                        id="amountAvailable"
                        label="Antall"
                        required
                        type="number"
                        inputProps={inputProps}
                        value={amountAvailable}
                        onChange={(e) => setAmountAvailable(e.target.value)}
                    />
                </Grid>


                {/*Submit knapp*/}
                <Grid
                    item
                    xs={12}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className="KommerEnStyleTing"
                        startIcon={<SaveIcon />}
                        onClick={submitForm}
                    >
                        Legg til billettype
                    </Button>
                </Grid>
            </Grid>
        </Form>
    );
}
