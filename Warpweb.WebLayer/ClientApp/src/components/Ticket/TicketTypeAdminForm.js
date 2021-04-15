import {
    Select,
    FormControl,
    InputLabel,
    TextField,
    Button,
    Grid,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Typography,
    Paper,
    Container,
    Collapse
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { Form } from 'reactstrap/lib';
import SaveIcon from '@material-ui/icons/Save';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
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

    const [ticketTypeName, setTicketTypeName] = useState("");
    const [mainEventId, setMainEventId] = useState("");
    const [basePrice, setBasePrice] = useState(0);
    const [amountAvailable, setAmountAvailable] = useState(0);
    const [options, setOptions] = useState([]);

    const { isAuthenticated, token } = useAuth();

    const ticketTypeDataToBeSent =
    {
        'descriptionName': ticketTypeName,
        'mainEventId': mainEventId,
        'basePrice': basePrice,
        'amountAvailable': amountAvailable
    }

    const submitForm = async () => {
        if (isAuthenticated) {
            const response = await fetch('/api/tickettypes/createtickettype', {
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

    const handleSubmit = e => {
        e.preventDefault();
        submitForm();
    };

    useEffect(() => {
        const getEvents = async () => {
 
            if (isAuthenticated) {
                const response = await fetch('/api/events/eventslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const options = [];
                const events = await response.json();
                for (const index in events) {
                    options.push(<MenuItem key={"event" + events[index].id} value={events[index].id}>{events[index].name}</MenuItem>);
                }
                setOptions(options);
            }
        }

        getEvents();

    }, [isAuthenticated]);

    const inputProps = {
        step: 10,
    };

    const classes = useStyles();

    return (

        <Grid container spacing={2} className={classes.root} component={Paper}>
            <Typography>
                <strong>Opprett billettype</strong>
            </Typography>

            <ValidatorForm
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >
                {/*name input*/}
                <Grid
                    item
                    xs={12}
                >
                    <TextValidator
                        className={classes.root}
                        variant="outlined"
                        id="ticketTypeName"
                        label="Navn på billettype"
                        required
                        value={ticketTypeName}
                        onChange={(e) => setTicketTypeName(e.target.value)}
                        validators={['required', 'minStringLength:1', 'trim']}
                        errorMessages={['Navn må oppgis', 'Navn må oppgis', 'Navn må oppgis']}
                    />
                </Grid>

                {/*Tilknyttet arrangemant*/}
                <Grid
                    item
                    xs={12}
                >
                    <FormControl variant="outlined">
                        <InputLabel id="arrangement">Arrangemant</InputLabel>
                        <Select
                            labelId="arrangement"
                            id="arrangement"
                            value={mainEventId}
                            onChange={(e) => setMainEventId(e.target.value)}
                            label="Arrangement"
                        >
                            { options }
                        </Select>
                    </FormControl>
                </Grid>

                {/*baseprice input*/}
                <Grid
                    item
                    xs={12}
                >
                    <TextValidator
                        className={classes.root}
                        variant="outlined"
                        id="basePrice"
                        label="Grunnpris på billettype"
                        required
                        type="number"
                        inputProps={inputProps}
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        validators={['required', 'isNumber']}
                        errorMessages={['Navn må oppgis', 'Ugyldig verdi']}
                    />
                </Grid>

                {/*Amount input*/}
                <Grid
                    item
                    xs={12}
                >
                    <TextValidator
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
                        type="submit"
                    >
                        Legg til billettype
                    </Button>
                </Grid>
            </ValidatorForm>
        </Grid>

    );
}
