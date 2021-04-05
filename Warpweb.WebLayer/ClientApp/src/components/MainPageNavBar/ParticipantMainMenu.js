import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemIcon} from '@material-ui/core';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ParticipantMainMenu() {
    return(
        <List>
            <ListItem button component={Link} to='/'>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary='Billetter' />
            </ListItem>
            <ListItem button component={Link} to='/'>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary='Seteresrvasjon' />
            </ListItem>
            <ListItem button component={Link} to='/'>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary='Compo' />
            </ListItem>
            <ListItem button component={Link} to='/'>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary='Praktisk info' />
            </ListItem>
        </List>
    );
}