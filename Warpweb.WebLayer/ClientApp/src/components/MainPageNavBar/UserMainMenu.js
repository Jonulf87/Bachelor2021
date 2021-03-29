import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import List from '@material-ui/core/List';
import authService from '../../providers/AuthProvider';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function UserMainMenu() {

    const { isAuthenticated, logout } = useAuth();

    return (
        <List>
            {isAuthenticated && (
                <>

                    <ListItem button component={Link} to='/user'>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary='Min side' />
                    </ListItem>

                    <ListItem button onClick={logout}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary='Logg ut' />
                    </ListItem>


                </>)}
            {!isAuthenticated && (
                <>
                    
                    <ListItem button component={Link} to={'/register'}>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary='Register' />
                    </ListItem>


                    <ListItem button component={Link} to={'/login'}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary='Logg inn' />
                    </ListItem>



                </>
            )}
        </List>
    );
}
