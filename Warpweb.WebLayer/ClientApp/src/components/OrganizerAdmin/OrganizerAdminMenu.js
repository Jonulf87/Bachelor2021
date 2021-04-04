import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UserPicker from '../User/UserPicker';
import useAuth from '../../hooks/useAuth';

// Styling
const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(3),
    },
}));


export default function OrganizerAdminMenu() {

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();

    const [organizerName, setOrganizerName] = useState("");
    const [organizerNumber, setOrganizerNumber] = useState("");
    const [organizerDescription, setOrganizerDescription] = useState("");
    const [orgnaizerAdmin, setOrganizerAdmin] = useState([]);
    const [open, setOpen] = useState();
    const [userId, setUserId] = useState();

    const submit = async (e) => {
        e.preventDefault();

        const dataToBeSent = {
            'name': organizerName,
            'orgNumber': organizerNumber,
            'description': organizerDescription
        }


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
            console.log(result);
        }
    }

    return (
        <Paper variant="outlined" elevation={3}>

            <Typography className={classes.root}>
                Legg til ny organisasjon
            </Typography>

            <form onSubmit={submit} >
                <Grid className={classes.root}
                    container
                >
                    <Grid
                        item
                        xs={12}
                        spacing={3}
                    >
                            <TextField
                                variant="outlined"
                                id="organizerName"
                                label="Navn"
                                required
                                value={organizerName}
                                onChange={(e) => setOrganizerName(e.target.value)}
                            />

                            <TextField
                                variant="outlined"
                                id="organizerNumber"
                                label="Org.nummer"
                                required
                                value={organizerNumber}
                                onChange={(e) => setOrganizerNumber(e.target.value)}
                            />

                            <TextField
                                variant="outlined"
                                id="organizerDescription"
                                label="Beskrivelse"
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
        <UserPicker open={open} />
        </Paper>

    )
}