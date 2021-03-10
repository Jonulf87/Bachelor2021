import { Card, CardContent, Typography, List, ListItem, ListItemText, Collapse, Grid, Paper, Divider, Accordion, AccordionSummary, AccordionDetails, Button, Checkbox, FormGroup, FormControlLabel } from '@material-ui/core';
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

    let [getUsersIsReady, setGetUsersIsReady] = useState(false);
    let [getRolesIsReady, setGetRolesIsReady] = useState(false);
    let [userList, setUserList] = useState([]);

    let [expanded, setExpanded] = useState(false);
    let [userRoles, setUserRoles] = useState([]);

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
                setGetUsersIsReady(true);
            }
        }
        getUsers();
    }, []);

    useEffect(() => {
        const getRoles = async () => {
            if (expanded) {
                const authenticationResult = await authService.isAuthenticated();
                if (authenticationResult) {
                    const accessToken = await authService.getAccessToken();
                    const rolesResponse = await fetch(`/api/users/UserRoles/${expanded}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    const rolesResult = await rolesResponse.json();
                    setUserRoles(rolesResult);
                    console.log(rolesResult);
                    setGetRolesIsReady(true);
                }
            }
            
        }
        getRoles();
    }, [expanded]);


    // Personalia er låst
    // Viser alt av brukerdata
    // Funksjonalitet:
    // Trenger knapp for passord reset
    // Sette rettigheter for bruker
    // Må finne en løsning for tekst i mobilversjon. ALternativet er å brekke det nedm men blir ikke optimalt.

    function mapRoles() {
        return (
        <>
            { userRoles.map((role) => 
                <Grid item>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox />
                            }
                            label={role}
                        />
                            
                        
                    </FormGroup>
                </Grid>
            )}
         </>
            
        )

    };

    function mapUsers() {

        return (
            <div className={classes.accordionWrapper}>
                {userList.map((user) => (
                    <Accordion key={user.id} expanded={expanded === user.id} onChange={(event, isExpanded) => setExpanded(isExpanded ? user.id : false)}>
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
                                    {mapRoles()}
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
            {getUsersIsReady && (<>
                <Typography>
                    <strong>Brukerliste</strong>
                </Typography>
                {mapUsers()}
            </>
            )}

            {!getUsersIsReady && (<p>Laster brukerliste...</p>)}

        </>

    );
}