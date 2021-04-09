import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Typography, Button, Grid, Divider } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function CreateCrew({ handleDialogOpen, userAsCrewleader }) {

    const classes = useStyles();
    const [crewName, setCrewName] = React.useState("");

    return (
        <>
            <Typography gutterBottom variant="h4">
                Opprett crew
                </Typography>
            <form className={classes.root} noValidate autoComplete="off">
                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        item
                        xs={6}
                    >
                        <TextField
                            variant="outlined"
                            id="crewName"
                            label="Navn"
                            style={{ margin: 8 }}
                            required
                            value={crewName}
                            onChange={(e) => setCrewName(e.target.value)}
                        />
                        <Divider />
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleDialogOpen}
                        >
                            Velg crewleder
                        </Button>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                    >
                        {userAsCrewleader && 
                            <Typography>
                                {userAsCrewleader.firstName}
                            </Typography>

                        }
                    </Grid>
                </Grid>
            </form>
            <Divider />
            <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<SaveIcon />}
            >
                Lagre
            </Button>
        </>
    );
}
