import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, ListSubheader } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import StarIcon from '@mui/icons-material/Star';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    buttonText: {
        color: 'rgba(0,0,0,0.87)',
    },
    root: {
        background: theme.palette.action.selected,
        borderRight: `5px solid ${theme.palette.primary.main}`,
    },
}));

export default function UserMainMenu() {
    const classes = useStyles();

    return (
        <List
            component="nav"
            role="navigation"
            subheader={
                <ListSubheader color="inherit" component="h1">
                    Meny
                </ListSubheader>
            }
        >
            <ListItem aria-label="Velg arrangement" activeClassName={classes.root} button component={NavLink} to="/userevent">
                <ListItemIcon>
                    <StarIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Arrangementer" />
            </ListItem>
            <ListItem aria-label="kjøp billett" activeClassName={classes.root} button component={NavLink} to="/userticket">
                <ListItemIcon>
                    <ConfirmationNumberIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Kjøp billett" />
            </ListItem>
            <ListItem aria-label="Setekart activeClassName={classes.root}" button component={NavLink} to="/userseatmap">
                <ListItemIcon>
                    <EventSeatIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Setekart" />
            </ListItem>
        </List>
    );
}
