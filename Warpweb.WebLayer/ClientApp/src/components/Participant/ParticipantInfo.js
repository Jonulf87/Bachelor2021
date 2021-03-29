import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import useAuth from '../../hooks/useAuth';

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

    let [usersList, setUsersList] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getUsers = async () => {

            if (isAuthenticated) {

                const response = await fetch('/api/users/UsersList', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();
                setUsersList(result);
                setIsReady(true);
            }
        }

        getUsers();

    }, []);

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
