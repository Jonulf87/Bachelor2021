import { Card, CardContent, Typography, List, ListItem, ListItemText, Collapse, Grid, Paper, Divider } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import react, { useState, useEffect } from 'react';
import authService from '../api-authorization/AuthorizeService';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) =>
    createStyles({
        collapseUser: {
            display: 'flex',
            flexWrap: 'wrap',
            padding: 0,
            margin: 0
        },
    }),
);

export default function UserList() {

    let [isReady, setIsReady] = useState(false);
    let [userList, setUserList] = useState([]);
    let [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }
    let [userOpen, setUserOpen] = useState(false);
    let [rolesList, setRolesList] = useState([]);

    useEffect(() => {
        const getUsers = async () => {

            const authenticationResult = await authService.isAuthenticated();

            if (authenticationResult) {
                const accessToken = await authService.getAccessToken();

                const response = await fetch('/api/users/UsersList', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const result = await response.json();
                setUserList(result);
                setIsReady(true);
            }
        }
        getUsers();
    }, []);

    // Personalia er låst
    // Viser alt av brukerdata
    // Funksjonalitet:
    // Trenger knapp for passord reset
    // Sette rettigheter for bruker
    // Må finne en løsning for tekst i mobilversjon. ALternativet er å brekke det nedm men blir ikke optimalt.

    function mapUsers() {

        return (
            <div className={classes.root}>
                {userList.map((user) => (
                    <Accordion key={user.id} expanded={expanded === user.id} onChange={handleChange(user.id)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{user.firstName} {user.lastName}</Typography>
                        </AccordionSummary>
                        <Divider />
                        <AccordionDetails>
                            <Grid container>
                                {/*Personalia container*/}
                                <Grid container>

                                    <Grid item xs={3} sm={3} md={3} lg={2} xl={2}>
                                        <Typography><strong>Fornavn</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9} sm={9} md={9} lg={10} xl={10}>
                                        <Typography>{user.firstName}</Typography>
                                    </Grid>

                                    {user.middleName && <>
                                        <Grid item xs={3} sm={3} md={3} lg={2} xl={2}>
                                            <Typography><strong>Mellomnavn</strong></Typography>
                                        </Grid>

                                        <Grid item xs={9} sm={9} md={9} lg={10} xl={10}>
                                            <Typography>{user.middleName}</Typography>
                                        </Grid>
                                    </>}

                                    <Grid item xs={3} sm={3} md={3} lg={2} xl={2}>
                                        <Typography><strong>Etternavn</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9} sm={9} md={9} lg={10} xl={10}>
                                        <Typography>{user.lastName}</Typography>
                                    </Grid>

                                    <Grid item xs={3} sm={3} md={3} lg={2} xl={2}>
                                        <Typography><strong>Brukernavn</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9} sm={9} md={9} lg={10} xl={10}>
                                        <Typography>{user.userName}</Typography>
                                    </Grid>

                                    <Grid item xs={3} sm={3} md={3} lg={2} xl={2}>
                                        <Typography><strong>Telefon</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9} sm={9} md={9} lg={10} xl={10}>
                                        <Typography>{user.phoneNumber}</Typography>
                                    </Grid>

                                    <Grid item xs={3} sm={3} md={3} lg={2} xl={2}>
                                        <Typography><strong>Epost</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9} sm={9} md={9} lg={10} xl={10}>
                                        <Typography>{user.eMail}</Typography>
                                    </Grid>

                                    <Grid item xs={3} sm={3} md={3} lg={2} xl={2}>
                                        <Typography><strong>Fødselsdag</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9} sm={9} md={9} lg={10} xl={10}>
                                        <Typography>-</Typography>
                                    </Grid>

                                    <Grid item xs={3} sm={3} md={3} lg={2} xl={2}>
                                        <Typography><strong>Allergisk</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9} sm={9} md={9} lg={10} xl={10}>
                                        <Typography>{user.allergy ? 'Ja, jeg er allergisk' : 'Nei, jeg har ingen allergier'}</Typography>
                                    </Grid>

                                    {user.allergy && <>
                                        <Grid item xs={3} sm={3} md={3} lg={2} xl={2}>
                                            <Typography><strong>Allergiinformasjon</strong></Typography>
                                        </Grid>
                                        <Grid item xs={9} sm={9} md={9} lg={10} xl={10}>
                                            <Typography>{user.allergyInfo}</Typography>
                                        </Grid>
                                    </>
                                    }

                                    {user.guardian && <>
                                        <Grid item xs={3} sm={3} md={3} lg={2} xl={2}>
                                            <Typography><strong>Verge</strong></Typography>
                                        </Grid>

                                        <Grid item xs={9} sm={9} md={9} lg={10} xl={10}>
                                            <Typography>{user.guardian}</Typography>
                                        </Grid>
                                    </>}

                                    <Grid item xs={3} sm={3} md={3} lg={2} xl={2}>
                                        <Typography><strong>Kommentar</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9} sm={9} md={9} lg={10} xl={10}>
                                        <Typography>-</Typography>
                                    </Grid>
                                </Grid>

                                {/*Rettighet og reset container*/}
                                <Grid container>
                                    <Grid item>
                                        <Typography>Test</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        )
    };

    const classes = useStyles();

    return (
        <>
            {isReady && (<>
                <Typography>
                    <strong>Brukerliste</strong>
                </Typography>
                {mapUsers()}
            </>
            )}

            {!isReady && (<p>Laster brukerliste...</p>)}

        </>

    );
}