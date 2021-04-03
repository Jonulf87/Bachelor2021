import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UserPicker from '../User/UserPicker';

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

    const [organizerName, setOrganizerName] = useState("");
    const [organizerNumber, setOrganizerNumber] = useState("");
    const [orgnaizerAdmin, setOrganizerAdmin] = useState([]);
    const [open, setOpen] = useState();
    const [userId, setUserId] = useState();

    const submit = (e) => {
        e.preventDefault();

        const dataToBeSent = {

        }
    }

    const showModal = () => {

    }

    return (
        <Paper variant="outlined" elevation={2} >
            <Grid
                conatiner
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
                            <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={showModal}
                            >
                                Legg til admin
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        <UserPicker open={open} /> 
        </Paper>

    )
}