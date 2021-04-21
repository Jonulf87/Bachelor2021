
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

export default function UserList() {

    const [userList, setUserList] = useState([]);
    const { isAuthenticated, token } = useAuth();

    const useStyles = makeStyles({
        table: {
            maxwidth: 850,
        },
    });

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
            }
        }
        getUsers();
    }, [isAuthenticated]);

    const classes = useStyles();

    return (
        <TableContainer>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Fornavn</TableCell>
                        <TableCell align="left">Etternavn</TableCell>
                        <TableCell align="left">Brukernavn</TableCell>
                        <TableCell align="left">Epost</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userList.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell align="left">{user.firstName}</TableCell>
                            <TableCell align="left">{user.lastName}</TableCell>
                            <TableCell align="left">{user.userName}</TableCell>
                            <TableCell align="left">{user.eMail}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}