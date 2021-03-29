import { TextField, Grid, Paper, Typography, Button } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { Form } from 'reactstrap/lib';
import SaveIcon from '@material-ui/icons/Save';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: 10
        },
    }),
);

export default function TicketTypeAdminForm({ updateList }) {

    let [ticketTypeName, setTicketTypeName] = useState("");
    let [basePrice, setBasePrice] = useState(0);
    let [amountAvailable, setAmountAvailable] = useState(0);
    const { isAuthenticated, token } = useAuth();

    const ticketTypeDataToBeSent =
    {
        'descriptionName': ticketTypeName,
        'basePrice': basePrice,
        'amountAvailable': amountAvailable
    }

    const submitForm = async () => {
        if (isAuthenticated) {
            const response = await fetch('/api/tickettypes/createTicketType', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(ticketTypeDataToBeSent)
            });
            const result = response.json();
            if (response.status === 200) {
                updateList();
                setTicketTypeName("");
                setBasePrice(0);
                setAmountAvailable(0);
            }
            console.log(result);
        }
    }

    const inputProps = {
        step: 10,
    };

    const classes = useStyles();

    return (

        <Grid container className={classes.root} component={Paper}>
            <Typography>
                <strong>Opprett billettype</strong>
            </Typography>

            <Form>
                {/*name input*/}
                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        className={classes.root}
                        variant="outlined"
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
                        className={classes.root}
                        variant="outlined"
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
                        className={classes.root}
                        variant="outlined"
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
            </Form>
        </Grid>
        
    );
}
