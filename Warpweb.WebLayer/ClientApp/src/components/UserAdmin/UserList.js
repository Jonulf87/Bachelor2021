import { Card, CardContent, Typography, List, ListItem, ListItemText, Collapse, Grid, Paper, Divider, Accordion, AccordionSummary, AccordionDetails, Button } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import react, { useState, useEffect } from 'react';
import authService from '../api-authorization/AuthorizeService';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) =>
    createStyles({

        accordionWrapper: {
            width: '100%',
            '&> :nth-child(even)': {
                '&> div:first-child': {
                    backgroundColor: 'lightgray'
                },

            },
            '&> :nth-child(odd)': {
                '&> div:first-child': {
                    backgroundColor: 'white'
                },
            },
        },
    }),
);

export default function UserList() {

    let [isReady, setIsReady] = useState(false);
    let [userList, setUserList] = useState([]);
    let [expanded, setExpanded] = useState(false);
    let [userRoles, setUserRoles] = useState([]);

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

                //const rolesResponse = await fetch('/api/users/UserRoles', {
                //    header: {
                //        'Authorization': `Bearer ${accessToken}`
                //    }
                //});

                
                //const rolesResult = await rolesResponse.json();
                //setUserRoles(rolesResult);


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
            <div className={classes.accordionWrapper}>
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
                                <Grid container xs={6}>

                                    <Grid item xs={3}>
                                        <Typography><strong>Fornavn</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{user.firstName}</Typography>
                                    </Grid>

                                    {user.middleName && <>
                                        <Grid item xs={3}>
                                            <Typography><strong>Mellomnavn</strong></Typography>
                                        </Grid>

                                        <Grid item xs={9}>
                                            <Typography>{user.middleName}</Typography>
                                        </Grid>
                                    </>}

                                    <Grid item xs={3}>
                                        <Typography><strong>Etternavn</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{user.lastName}</Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography><strong>Brukernavn</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{user.userName}</Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography><strong>Telefon</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{user.phoneNumber}</Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography><strong>Epost</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{user.eMail}</Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography><strong>Fødselsdag</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>-</Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography><strong>Allergisk</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{user.allergy ? 'Ja, jeg er allergisk' : 'Nei, jeg har ingen allergier'}</Typography>
                                    </Grid>

                                    {user.allergy && <>
                                        <Grid item xs={3}>
                                            <Typography><strong>Allergiinformasjon</strong></Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography>{user.allergyInfo}</Typography>
                                        </Grid>
                                    </>
                                    }

                                    {user.guardian && <>
                                        <Grid item xs={3}>
                                            <Typography><strong>Verge</strong></Typography>
                                        </Grid>

                                        <Grid item xs={9}>
                                            <Typography>{user.guardian}</Typography>
                                        </Grid>
                                    </>}

                                    <Grid item xs={3}>
                                        <Typography><strong>Kommentar</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>-</Typography>
                                    </Grid>
                                </Grid>

                                {/*Rettighet og reset container*/}
                                <Grid container xs={6}>
                                    <Grid item>
                                        <Typography>Checkbokser definert som vi vil vises her. if cb === roles(checked)</Typography>
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