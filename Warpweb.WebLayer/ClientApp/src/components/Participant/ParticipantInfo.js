import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import authService from '../api-authorization/AuthorizeService';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            maxWidth: 500,
            marginBottom: 20,
        },
    }),
);

export default function ParticipantInfo() {

    let [isReady, setIsReady] = useState(false);
    let [usersList, setUsersList] = useState([]);

    useEffect(() => {
        const getUsers = async () => {

            const authenticationResult = authService.isAuthenticated();

            if (authenticationResult) {
                const accessToken = await authService.getAccessToken();

                const response = await fetch('/api/users/UsersList', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const result = await response.json();
                setUsersList(result);

                setIsReady(true);
            }
        }

        getUsers();

    }, []);

    //function getUsersFromList() {
    //    return usersList.map((user) =>
    //        <ListItem>
    //            <ListItemIcon><AccessibilityNewIcon /></ListItemIcon>
    //            <ListItemText primary={user.firstName + " " + user.lastName} />
    //            <ListItemText primary={user.lastName} />
    //        </ListItem>  
    //    )
    //};

    function getUsersFromList() {

        return (

            <TableContainer className={classes.root} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Fornavn</TableCell>
                            <TableCell align="left">Etternavn</TableCell>
                            <TableCell align="left">Epost</TableCell>
                            <TableCell align="left">Nick</TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usersList.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell align="left">{user.firstName}</TableCell>
                                <TableCell align="left">{user.lastName}</TableCell>
                                <TableCell align="left">{user.email}</TableCell>
                                <TableCell align="left">{user.userName}</TableCell>
                                <TableCell align="left">
                                    <Button variant="contained">Mer info</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    };

    const classes = useStyles();

    return (

        <Card className={classes.root}>

            <CardContent>

                <Typography gutterBottom variant="h5" component="h2">
                    Deltakeroversikt
                </Typography>

                {isReady && (<>
                    {getUsersFromList()}
                </>)}

                {!isReady && (<p>Loading...</p>)}

            </CardContent>

        </Card>
    );
}
