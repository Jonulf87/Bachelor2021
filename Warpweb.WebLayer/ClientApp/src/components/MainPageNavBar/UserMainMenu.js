import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, ListSubheader } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/Star';
import EventSeatIcon from '@material-ui/icons/EventSeat';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    buttonText: {
        color: "rgba(0,0,0,0.87)",
        
    },
    
}));

export default function UserMainMenu() {

    const classes = useStyles();

    return (
        <List
            
            subheader={
                <ListSubheader color="primary" style={{}}>
                    Meny
                </ListSubheader>
            }
        >
            <ListItem aria-label='Velg arrangement' button component={Link} to='/userevent'>
                <ListItemIcon  ><StarIcon color="primary"/></ListItemIcon>
                <ListItemText primary='Velg arrangement' />
            </ListItem>
            <ListItem aria-label='kjøp billett' button component={Link} to='/userticket'>
                <ListItemIcon><ConfirmationNumberIcon color="primary"/></ListItemIcon>
                <ListItemText primary='Kjøp billett' />
            </ListItem>
            <ListItem aria-label='Setekart'button component={Link} to='/userseatmap'>
                <ListItemIcon><EventSeatIcon color="primary"/></ListItemIcon>
                <ListItemText primary='Setekart' />
            </ListItem>
        </List>
    );
}
