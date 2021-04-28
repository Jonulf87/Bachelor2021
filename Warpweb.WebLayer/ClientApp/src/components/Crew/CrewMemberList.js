import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

import { makeStyles } from '@material-ui/core/styles';
import { Divider, List, ListItem, ListItemText, ListSubheader, Typography, Toolbar, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Container} from '@material-ui/core';

const useStyles = makeStyles({
    inline: {
        display: 'inline',
      },
    
    });

export default function CrewMemberList({ crewMembers, crewLeaders }) {


    const classes = useStyles();

    function CrewList({list}) {        
        return (
            list.map((member) => (
                <ListItem
                    alignItems="flex-start"
                    key={member.id}
                >  
                            <ListItemText
                                primary={member.name}
                                secondary={
                                    <>
                                        <Typography
                                            variant="body2"
                                            color="textPrimary"
                                            component="span"
                                        >
                                            tlf:
                                        </Typography>
                                        {member.phone}
                                        <br />
                                        <Typography
                                            variant="body2"
                                            color="textPrimary"
                                            component="span"
                                        >
                                            e-post: 
                                        </Typography>
                                        {member.eMail}
                                    </>
                                }
                            >
                            </ListItemText>
                        
                </ListItem>
            )))
    }

    return (
        <>
            <Container>
                <List>
                    <ListSubheader >
                        Arbeidslagsledere
                    </ListSubheader>
                    <CrewList list={crewLeaders} />
                    <Divider />
                    <ListSubheader >
                        Øvrige medlemmer
                    </ListSubheader>
                    <CrewList list={crewMembers} />
                </List>
            </Container>
        </>
    );
}