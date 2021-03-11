import React, { useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import authService from '../api-authorization/AuthorizeService';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        }
    }
}));

export default function CreateVenue() {

    const classes = useStyles();

    const isMounted = useRef(true);

    const [isSending, setIsSending] = useState(false);
    const [name, setName] = useState('');
    const [contactId, setContactId] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [area, setArea] = useState('');
    const [capacity, setCapacity] = useState('');

    useEffect(
        () => {
            return () => {
                isMounted.current = false
            }
        },
        []
    );

    const sendRequest = async () => {
        // don't send again while we are sending
        if (isSending) {
            return;
        }

        // update state
        setIsSending(true);

        const data = {
            'VenueName': name,
            'VenueAddress': address,
            'PostalCode': postalCode,
            'VenueAreaAvailable': area,
            'VenueCapacity': capacity,
            'ContactId': contactId
        }



        const authenticationResult = await authService.isAuthenticated();
        if (authenticationResult) {
            const accessToken = await authService.getAccessToken();
            const response = await fetch('/api/Venue', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log(result);
        } else {
            alert("Not authorized");
        }

        // only update if we are still mounted
        if (isMounted.current) {
            setIsSending(false);
        }
    };

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    Opprett lokale
                </Typography>
                <form className={classes.root} noValidate autoComplete="off">
                    <div>
                        <div>
                            <TextField
                                onChange={e => setName(e.target.value)}
                                id="name"
                                name="name"
                                label="Navn"
                                style={{ margin: 8 }}
                                placeholder="Navn på lokale"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />

                            <TextField
                                onChange={e => setContactId(e.target.value)}
                                id="contactperson"
                                name="contactperson"
                                label="Kontaktperson"
                                style={{ margin: 8 }}
                                placeholder="Kontakterson"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />

                        </div>
                        <div>
                            <TextField
                                onChange={e => setAddress(e.target.value)}
                                id="address"
                                name="address"
                                label="Adresse"
                                style={{ margin: 8 }}
                                placeholder="Gateadresse"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />

                            <TextField
                                onChange={e => setPostalCode(e.target.value)}
                                id="postalcode"
                                name="postalcode"
                                label="Postnr"
                                style={{ margin: 8 }}
                                placeholder="Postnummer"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </div>
                        <div>
                            <TextField
                                onChange={e => setArea(e.target.value)}
                                id="area"
                                name="area"
                                type="Number"
                                label="Areal"
                                style={{ margin: 8 }}
                                placeholder="Tilgjengelig areal"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />

                            <TextField
                                onChange={e => setCapacity(e.target.value)}
                                id="capacity"
                                name="capacity"
                                type="Number"
                                label="Kapasitet"
                                style={{ margin: 8 }}
                                placeholder="Kapasitet (plasser)"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </div>
                    </div>
                </form>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    disabled={isSending}
                    onClick={sendRequest}
                >
                    Lagre
                </Button>
            </CardContent>
        </Card>
    );
}
