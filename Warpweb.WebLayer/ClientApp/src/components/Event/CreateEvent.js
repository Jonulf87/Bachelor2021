import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

// Mock venues
const venues = [
    {
        value: 'John Dee',
    },
    {
        value: 'Rockefeller',
    },
    {
        value: 'Spektrum',
    },
];

// Mock organizers
const organizers = [
    {
        value: 'WarpCrew',
    },
    {
        value: 'CarpCrew',
    },
    {
        value: 'WrapCrew',
    },
];

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function CreateEvent() {

    const classes = useStyles();
    const [organizer, setOrganizer] = React.useState('Tom');
    const [venue, setVenue] = React.useState('Tom');

    const handleChangeOrganizer = (event) => {
        setOrganizer(event.target.value);
    };

    const handleChangeVenue = (event) => {
        setVenue(event.target.value);
    };

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    Opprett arrangement
                </Typography>
                <form className={classes.root} noValidate autoComplete="off">
                    <div>
                        <div>
                            <TextField
                                id="outlined-full-width"
                                label="Arrangementnavn"
                                style={{ margin: 8 }}
                                placeholder="Navn på arrangement"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </div>

                        <form className={classes.container} noValidate>
                            <TextField
                                id="datetime-local"
                                label="Startdato / tidspunkt"
                                type="datetime-local"
                                defaultValue="2017-05-24T10:30"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />

                            <TextField
                                id="datetime-local"
                                label="Sluttdato / tidspunkt"
                                type="datetime-local"
                                defaultValue="2017-05-24T10:30"
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </form>

                        <TextField
                            id="outlined-select-organizer-native"
                            select
                            label="Arrangør"
                            value={organizer}
                            onChange={handleChangeOrganizer}
                            SelectProps={{
                                native: true,
                            }}
                            helperText="Velg arranør"
                            variant="outlined"
                        >
                            {organizers.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.value}
                                </option>
                            ))}
                        </TextField>

                        <TextField
                            id="outlined-select-venue-native"
                            select
                            label="Lokale"
                            value={venue}
                            onChange={handleChangeVenue}
                            SelectProps={{
                                native: true,
                            }}
                            helperText="Velg lokale"
                            variant="outlined"
                        >
                            {venues.map((option) => (
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
