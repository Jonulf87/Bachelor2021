import React from 'react';

import { List, ListItem, ListItemText, Typography, Container } from '@mui/material';
import { CrewMemberVm } from './CrewTypes';

type Props = {
    crewMembers: CrewMemberVm[];
    crewLeaders: CrewMemberVm[];
};

const CrewMemberList: React.FC<Props> = ({ crewMembers, crewLeaders }) => {
    const renderCrewList = (list: CrewMemberVm[]) => {
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
                <Typography gutterBottom variant="h6" component="h2">
                    Arbeidslagsleder(e):
                </Typography>
                <List>{renderCrewList(crewLeaders)}</List>
                <Typography gutterBottom variant="h6" component="h2">
                    &#216;vrige medlemmer:
                </Typography>
                <List>{renderCrewList(crewMembers)}</List>
            </Container>
        </>
    );
};

export default CrewMemberList;
