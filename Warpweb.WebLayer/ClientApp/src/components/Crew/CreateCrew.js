import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Card, CardContent, Typography, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function CreateCrew() {

    const classes = useStyles();
    const [event, setEvent] = React.useState('Tom');
    const [crewleader, setCrewleader] = React.useState('Tom');

    const handleChangeEvent = (event) => {
        setEvent(event.target.value);
    };

    const handleChangeCrewleader = (event) => {
        setCrewleader(event.target.value);
    };

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    Opprett arbeidslag
                </Typography>
                <form className={classes.root} noValidate autoComplete="off">
                    <div>
                        <div>
                            <TextField
                                id="outlined-full-width"
                                label="Navn"
                                style={{ margin: 8 }}
                                placeholder="Navn på arbeidslag"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </div>

                        <TextField
                            id="outlined-select-organizer-native"
                            select
                            label="Arbeidslagsleder"
                            value={crewleader}
                            onChange={handleChangeCrewleader}
                            SelectProps={{
                                native: true,
                            }}
                            helperText="Velg arbeidslagsleder"
                            variant="outlined"
                        >
                            {crewleaders.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.value}
                                </option>
                            ))}
                        </TextField>

                        <TextField
                            id="outlined-select-venue-native"
                            select
                            label="Arrangement"
                            value={event}
                            onChange={handleChangeEvent}
                            SelectProps={{
                                native: true,
                            }}
                            helperText="Velg arrangement"
                            variant="outlined"
                        >
                            {events.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.value}
                                </option>
                            ))}
                        </TextField>
                    </div>
                </form>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.button}
                    startIcon={<SaveIcon />}
                >
                    Lagre
                </Button>
            </CardContent>
        </Card>
    );
}
