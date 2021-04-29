import React from 'react';

import { Divider, List, ListItem, ListItemText, Typography, Container } from '@material-ui/core';

export default function CrewMemberList({ crewMembers, crewLeaders }) {

    function CrewList({ list }) {
        return (
            list.map((member) => (
                <List key={member.id}>
                    <ListItem
                        alignItems="flex-start"
                        
                    >
                        <Typography
                            variant="body2"
                            color="textPrimary"
                        >
                            <strong>{member.name}:</strong>
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography
                            variant="body2"
                            color="textPrimary"
                        >
                            <strong>Tlf:</strong> {member.phone}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography
                            variant="body2"
                            color="textPrimary"
                        >
                            <strong>E-post:</strong> {member.eMail}
                        </Typography>

                    </ListItem>
                </List>
            )))
    }

    return (
        <>
            <Container>
                <List>
                    <Typography gutterBottom variant="h6" component="h2" gutterBottom>
                        Arbeidslagsleder(e):
                    </Typography>
                    <CrewList list={crewLeaders} />

                    <Divider />

                    <Typography gutterBottom variant="h6" component="h2" gutterBottom>
                        &#216;vrige medlemmer:
                    </Typography>
                    <CrewList list={crewMembers} />
                </List>
            </Container>
        </>
    );
}