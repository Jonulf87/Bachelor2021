import React from 'react';
import { Link } from 'react-router-dom';
import { Container, ListItem, List, ListItemIcon, ListItemText, ListSubheader, Typography } from '@material-ui/core';


export default function PageNotFound() {
    return (
        <Container>
            <Typography variant="h4" component="h2">
            Denne siden finnes ikke
            </Typography>
            <Typography variant="subtitle1" component={Link} to="/">
            Gå til framsiden
            </Typography>
        </Container>
    )
}