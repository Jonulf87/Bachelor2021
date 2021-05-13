import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.action.selected,
        borderRight: `5px solid ${theme.palette.primary.main}`,
    },
}));

export default function CrewMainMenu({ crews }) {
    const classes = useStyles();

    return (
        <List
            component="nav"
            role="navigation"
            subheader={
                <ListSubheader color="inherit" component="h1">
                    Mine arbeidslag
                </ListSubheader>
            }
        >
            {crews.map((crew) => (
                <ListItem key={crew.id} button component={NavLink} activeClassName={classes.root} to={{ pathname: `/crew/${crew.id}` }}>
                    <ListItemIcon>
                        <GroupIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText color="primary" primary={crew.name} />
                </ListItem>
            ))}
        </List>
    );
}
