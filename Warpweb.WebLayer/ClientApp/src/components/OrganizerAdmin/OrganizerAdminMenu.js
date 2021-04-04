import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UserPicker from '../User/UserPicker';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
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
        <Paper variant="outlined" elevation={2} >
            <Grid
                container
                spacing={2}
            >
                <Grid
                    item
                    xs={12}
                >
                    <Typography gutterBottom>
                        Legg til ny organisasjon
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={12}
                >
                    <form onSubmit={submit}>
                        <Grid
                            container
                            spacing={1}
                        >
                            <Grid
                                item
                                xs={2}
                            >
                                <TextField
                                    className={classes.root}
                                    id="organizerName"
                                    label="Organisasjonsnavn"
                                    required
                                    value={organizerName}
                                    onChange={(e) => setOrganizerName(e.target.value)}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={2}
                            >
                                <TextField
                                    className={classes.root}
                                    id="organizerNumber"
                                    label="Organisasjonsnummer"
                                    required
                                    value={organizerNumber}
                                    onChange={(e) => setOrganizerNumber(e.target.value)}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={2}
                            >
                                <TextField
                                    className={classes.root}
                                    id="organizerDescription"
                                    label="Beskrivelse"
                                    required
                                    value={organizerDescription}
                                    onChange={(e) => setOrganizerDescription(e.target.value)}
                                    margin="dense"
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Button
                                className={classes.button}
                                variant="contained"
                                size="small"
                                color="primary"
                                type="submit"
                            >
                                Legg til org
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <UserPicker open={open} />
        </Paper>

    )
}