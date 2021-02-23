import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function CreateVenue() {

    const classes = useStyles();

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
                                id="outlined-full-width"
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
                                id="outlined-full-width"
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
                            id="outlined-full-width"
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
                            id="outlined-full-width"
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
                                id="outlined-full-width"
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
                                id="outlined-full-width"
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
                >
                    Lagre
                </Button>
            </CardContent>
        </Card>
    );
}
