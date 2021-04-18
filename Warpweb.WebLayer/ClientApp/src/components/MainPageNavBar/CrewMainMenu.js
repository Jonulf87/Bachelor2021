import React from 'react';
import { List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function UserMainMenu({ crews }) {

    return (
        <List
            subheader={
                <ListSubheader color="primary">
                    Mine arbeidslag
                </ListSubheader>
            }
        >
            {crews.map((crew) => (
                <ListItem
                    key={crew.id}
                    button
                    component={Link}
                    to={{ pathname: `/crew/${crew.id}` }}>
                    <ListItemText color="primary" primary={crew.name} />
                </ListItem>
            ))}
        </List>
    );
}
