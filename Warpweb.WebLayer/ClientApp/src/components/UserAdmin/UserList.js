
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Divider, Accordion, AccordionSummary, AccordionDetails, Button, Checkbox, FormGroup, FormControlLabel,
    IconButton, Input, InputAdornment, InputLabel, FormControl, Table, TableBody,
    TableCell, TableHead, TableRow, TableSortLabel, Paper, TextField,
    Collapse, Box
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import authService from '../../providers/AuthProvider';
import useAuth from '../../hooks/useAuth';

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

function getOrder(sortOrder) {
    return sortOrder === 'desc' ? 1 : -1;
}

//sorterer ikke tall korrekt. link under for mulig fiks
//https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number

function sortRows(sortBy, sortOrder) {
    let order = getOrder(sortOrder);
    return function (a, b) {
        var result = (a[sortBy] < b[sortBy]) ? -1 : (a[sortBy] > b[sortBy]) ? 1 : 0;
        return result * order;
    }
};

export default function UserList() {

    const [getUsersIsReady, setGetUsersIsReady] = useState(false);
    const [getRolesIsReady, setGetRolesIsReady] = useState(false);
    
    const [userList, setUserList] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);

    const [order, setOrder] = useState('asc');
    const [expanded, setExpanded] = useState(false);
    const [userRoles, setUserRoles] = useState([]);

    const [open, setOpen] = useState(0);
    const [openCreate, setOpenCreate] = useState(false);

    const [userOpen, setUserOpen] = useState(false);
    const [rolesList, setRolesList] = useState([]);

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getUsers = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/users/userslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setUserList(result);
                setFilteredRows(result);
                setGetUsersIsReady(true);
            }
        }
        getUsers();
    }, [isAuthenticated]);

    useEffect(() => {
        const getRoles = async () => {
            if (expanded) {
                if (isAuthenticated) {
                    const rolesResponse = await fetch(`/api/users/userroles/${expanded}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
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

    const handleChange = (e) => {
        const searchTerm = e.currentTarget.value;
        const newRows = userList.filter(obj => {
            return obj.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 /*||
                obj.address.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                obj.areaAvailable.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                obj.capacity.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1*/
        });
        setFilteredRows(newRows);
    };

    //sort table fucntion
    const handleSortClick = (e) => {
        const inRows = filteredRows.sort(sortRows(e.target.id, order));
        const newOrder = (order === 'desc') ? 'asc' : 'desc';
        setOrder(newOrder);
        setFilteredRows(inRows);
    };

    //show info
    const handleClick = (e) => {
        const inId = parseInt(e.currentTarget.value);
        const SelectedVenue = (inId === open) ? 0 : inId;
        setOpen(SelectedVenue);
    };


    let toggleUserRole = (e, roleName) => {
        let roles = [...userRoles];
        let role = roles.find(r => r.name === roleName);
        role.userHasRole = e.target.checked;

        setUserRoles(roles);
    }

    function mapRoles() {
        return (
            <>
                { userRoles.map((role) =>
                    <Grid item key={role.name}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={role.userHasRole}
                                        onChange={(e) => toggleUserRole(e, role.name)}
                                    />
                                }
                                label={role.name}
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
                    <Accordion key={user.id}
                        expanded={expanded === user.id}
                        onChange={(event, isExpanded) => setExpanded(isExpanded ? user.id : false)}>
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
                                <Grid item xs={6} container>

                                    
                                {user.firstName}
                                {user.middleName}
                                {user.lastName}    
                                {user.userName}    
                                {user.phoneNumber}
                                {user.eMail}
                                {user.allergy ? 'Ja, jeg er allergisk' : 'Nei, jeg har ingen allergier'}
                                {user.allergyInfo}





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
                                <Grid item xs={6} container direction="column" align-items="flex-start">
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
            {/*!getUsersIsReady && (<CircularProgress />)*/}

        <Typography gutterBottom variant="h5" component="h2">
            Brukerliste
        </Typography>
        <TextField
            className={classes.margin}
            id="input-with-icon-textfield"
            placeholder="Søk i tabell"
            onChange={handleChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
        <Button variant="contained" color="primary" onClick={() => setOpenCreate(!openCreate)} disableElevation>
            Legg til
        </Button>
        <Collapse in={openCreate} unmountOnExit>
            <Box margin={1}>
                Empty
            </Box>
        </Collapse>
        <Table className={classes.table} aria-label="Lokaletabell">
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="left">
                        <TableSortLabel id='name' onClick={handleSortClick}>
                            Navn
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align="left">
                        <TableSortLabel id='address' onClick={handleSortClick}>
                            Brukernavn
                        </TableSortLabel>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {filteredRows.map((user) => (
                <>
                    <TableRow key={user.id}>
                        <TableCell>
                            <IconButton aria-label="" size="small" onClick={handleClick} value={user.id}>
                                {(open === user.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </TableCell>
                        <TableCell align="left">{user.firstName} {user.middleName} {user.lastName}</TableCell>
                        <TableCell align="left">{user.userName}</TableCell>
                        <TableCell align="left">{user.phoneNumber}</TableCell>
                        <TableCell align="left">{user.eMail}</TableCell>
                        {/*<TableCell align="left">{venuesList.postalCode}</TableCell>
                        <TableCell align="left">{venuesList.areaAvailable}</TableCell>
                        <TableCell align="left">{venuesList.capacity}</TableCell>*/}
                    </TableRow>
                    <TableRow key={user.id * -1}>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                            <Collapse in={user.id === open} timeout="auto" unmountOnExit>
                                <Box p={{ xs: 1, sm: 2, md: 2 }}>
                                    <Typography>Empty</Typography>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                </>
            ))}
        </TableBody>
        </Table>
    </>
    );
}