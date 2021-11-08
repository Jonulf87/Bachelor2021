import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import UserAdminMain from './UserAdmin/UserAdminMain';
import CrewMain from './Crew/CrewMain';
import CrewAdminList from './CrewAdmin/CrewAdminList';
import EventAdminMain from './EventAdmin/EventAdminMain';
import EventUserMain from './Event/EventUserMain';
import ParticipantAdminMain from './Participant/ParticipantAdminMain';
import TicketTypeAdminMain from './TicketTypeAdmin/TicketTypeAdminMain';
import UserMain from './User/UserMain';
import VenueMain from './Venue/VenueMain';
import UserRegister from './User/UserRegister';
import UserLogin from './User/UserLogin';
import SeatMapAdminMain from './SeatMapAdmin/SeatMapAdminMain';
import LogOut from './MainPageNavBar/LogOut';
import OrganizerAdminMain from './OrganizerAdmin/OrganizerAdminMain';
import TicketMain from './Ticket/TicketMain';
import PageNotFound from './ErrorPages/PageNotFound';
import Unauthorized from './ErrorPages/Unauthorized';
import NotAuthenticated from './ErrorPages/NotAuthenticated';

import useCurrentEvent from '../hooks/useCurrentEvent';
import useAuth from '../hooks/useAuth';
import SeatMapMain from './SeatMap/SeatMapMain';
import useAxios from '../hooks/useAxios';

enum Policy {
    CheckInAdmin = 0,
    CrewAdmin = 1,
    TicketAdmin = 2,
    SeatMapAdmin = 3,
    UserAdmin = 4,
    ReportAdmin = 5,
    VenueAdmin = 6,
    ParticipantAdmin = 7
}

const AppRouter: React.FC = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const { currentEventChangeCompleteTrigger } = useCurrentEvent();
    const { isAuthenticated, token, roles, orgsIsAdminAt } = useAuth();
    const axios = useAxios();

    useEffect(() => {
        if (isAuthenticated) {
            const getPolicies = async () => {
                const resultPolicies = await axios.get<Policy[]>('/api/security/policies');
                setPolicies(resultPolicies.data);
            };
            getPolicies();
        } else {
            setPolicies([]);
        }
    }, [currentEventChangeCompleteTrigger, isAuthenticated]);

    return (
        <Switch>
            <Route exact path="/" component={EventUserMain} />
            <Route path="/userevent" component={EventUserMain} />
            <Route path="/userticket/:login?" component={TicketMain} />
            <Route path="/userseatmap" component={SeatMapMain} />
            <Route path="/register/:ticket?" component={UserRegister} />
            <Route path="/login" component={UserLogin} />
            <Route path="/logout" component={LogOut} />
            <Route path="/event">{!isAuthenticated ? <NotAuthenticated /> : <EventAdminMain />}</Route>
            <Route path="/user/:loggedin?">{!isAuthenticated ? <NotAuthenticated /> : <UserMain />}</Route>
            <Route exact path="/crew/:id">
                {!isAuthenticated ? <NotAuthenticated /> : <CrewMain />}
            </Route>
            <Route path="/venue">
                {!isAuthenticated ? (
                    <NotAuthenticated />
                ) : !policies.some((a) => a === 6) && orgsIsAdminAt.length === 0 ? (
                    <Unauthorized />
                ) : (
                    <VenueMain />
                )}
            </Route>

            <Route path="/crewadmin">
                {!isAuthenticated ? <NotAuthenticated /> : !policies.some((a) => a === 1) ? <Unauthorized /> : <CrewAdminList />}
            </Route>
            <Route path="/useradmin">
                {!isAuthenticated ? <NotAuthenticated /> : !policies.some((a) => a === 4) ? <Unauthorized /> : <UserAdminMain />}
            </Route>
            <Route path="/participant">
                {!isAuthenticated ? <NotAuthenticated /> : !policies.some((a) => a === 7) ? <Unauthorized /> : <ParticipantAdminMain />}
            </Route>
            <Route path="/ticketadmin">
                {!isAuthenticated ? <NotAuthenticated /> : !policies.some((a) => a === 2) ? <Unauthorized /> : <TicketTypeAdminMain />}
            </Route>
            <Route path="/seatmap">
                {!isAuthenticated ? <NotAuthenticated /> : !policies.some((a) => a === 3) ? <Unauthorized /> : <SeatMapAdminMain />}
            </Route>
            <Route path="/organizer" component={OrganizerAdminMain}>
                {roles.some((a) => a === 'Admin') || orgsIsAdminAt.length > 0 ? <OrganizerAdminMain /> : <Unauthorized />}
            </Route>

            <Route component={PageNotFound} />
        </Switch>
    );
}

export default AppRouter;
