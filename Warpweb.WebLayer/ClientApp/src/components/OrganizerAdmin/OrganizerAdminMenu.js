import { Container, Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UserPicker from '../User/UserPicker';
import useAuth from '../../hooks/useAuth';

// Styling
const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3),
        display: 'flex',
        flexWrap: 'wrap',
        margin: 10
    },
}));


export default function OrganizerAdminMenu({ updateList }) {

    const [organizerName, setOrganizerName] = useState("");
    const [organizerNumber, setOrganizerNumber] = useState("");
    const [organizerDescription, setOrganizerDescription] = useState("");

    const classes = useStyles();

    const { isAuthenticated, token } = useAuth();

    const dataToBeSent = {
        'name': organizerName,
        'orgNumber': organizerNumber,
        'description': organizerDescription
    }

    const submit = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            const response = await fetch('api/tenants/addorganizer', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(dataToBeSent)
            });
            const result = await response.json();
            if (response.status === 200) {
                updateList();
                setOrganizerName("");
                setOrganizerNumber("");
                setOrganizerDescription("");
            }
            console.log(result);
        }
    }


    return (
        <>

            <Typography className={classes.root}>
                Legg til ny organisasjon
            </Typography>

            <form onSubmit={submit} >
                <Grid className={classes.root}
                    container
                    spacing={2}
                >
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            variant="outlined"
                            id="organizerName"
                            label="Navn"
                            style={{ margin: 8 }}
                            required
                            value={organizerName}
                            onChange={(e) => setOrganizerName(e.target.value)}
                        />

                        <TextField
                            variant="outlined"
                            id="organizerNumber"
                            label="Org.nummer"
                            style={{ margin: 8 }}
                            required
                            value={organizerNumber}
                            onChange={(e) => setOrganizerNumber(e.target.value)}
                        />

                        <TextField
                            variant="outlined"
                            id="organizerDescription"
                            label="Beskrivelse"
                            style={{ margin: 8 }}
                            required
                            value={organizerDescription}
                            onChange={(e) => setOrganizerDescription(e.target.value)}
                        />
                    </Grid>
                    <Button
                        className={classes.button}
                        variant="contained"
                        size="large"
                        color="primary"
                        type="submit"
                    >
                        Opprett
                    </Button>
                    
                </Grid>
            </form>

        </>
    )
}