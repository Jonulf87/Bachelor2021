import React from 'react';

import { Divider, List, ListItem, ListItemText, Typography, Container } from '@material-ui/core';

export default function CrewMemberList({ crewMembers, crewLeaders }) {
    const CrewList = ({ list }) => {
        return list.map((member) => (
            <ListItem alignItems="flex-start" key={member.id}>
                <ListItemText
                    primary={member.name}
                    secondary={
                        <>
                            <a href={`tel:${member.phone}`}>{member.phone}</a>
                            <br />
                            <a href={`mailto:${member.eMail}`}>{member.eMail}</a>
                        </>
                    }
                />
            </ListItem>
        ));
    };

    return (
        <>
            <Container>
                <Typography gutterBottom variant="h6" component="h2" gutterBottom>
                    Arbeidslagsleder(e):
                </Typography>
                <List>
                    <CrewList list={crewLeaders} />
                </List>
                <Typography gutterBottom variant="h6" component="h2" gutterBottom>
                    &#216;vrige medlemmer:
                </Typography>
                <List>
                    <CrewList list={crewMembers} />
                </List>
            </Container>
        </>
    );
}
