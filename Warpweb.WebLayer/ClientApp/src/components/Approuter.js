import React, { useState, useEffect } from 'react';
import {
    Route,
    Switch,
} from "react-router-dom";

import UserAdminMain from './UserAdmin/UserAdminMain';
import CrewMain from './Crew/CrewMain';
import CrewAdminMain from './Crew/CrewAdminMain';
import EventAdminMain from './EventAdmin/EventAdminMain';
import EventUserMain from './Event/EventUserMain';
import ParticipantMain from './Participant/ParticipantMain';
import ReportMain from './Report/ReportMain';
import TicketTypeAdminMain from './TicketTypeAdmin/TicketTypeAdminMain';
import UserMain from './User/UserMain';
import VenueMain from './Venue/VenueMain';
import UserRegister from "./User/UserRegister";
import UserLogin from "./User/UserLogin";
import SeatMapMain from './SeatMap/SeatMapMain';
import LogOut from './MainPageNavBar/LogOut';
import OrganizerAdminMain from './OrganizerAdmin/OrganizerAdminMain';
import TicketMain from './Ticket/TicketMain';
import PageNotFound from './ErrorPages/PageNotFound'
import Unauthorized from './ErrorPages/Unauthorized'

import useCurrentEvent from '../hooks/useCurrentEvent';
import useAuth from '../hooks/useAuth';

export default function AppRouter() {
    const [policies, setPolicies] = useState([]);
    const { currentEventChangeCompleteTrigger } = useCurrentEvent();
    const { isAuthenticated, token, roles } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            const getPolicies = async () => {
                const responsePolicies = await fetch('/api/security/policies', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultPolicies = await responsePolicies.json();
                setPolicies(resultPolicies);

            }
            getPolicies();
        }
        else {
            setPolicies([]);
        }
    }, [currentEventChangeCompleteTrigger, isAuthenticated])


    return (
        <Switch>
            <Route exact path='/' component={EventUserMain} />            
            <Route path='/userevent' component={EventUserMain} />
            <Route path='/userticket' component={TicketMain} />
            <Route path='/user' component={UserMain} />
            <Route path='/register' component={UserRegister} />
            <Route path='/login' component={UserLogin} />
            <Route path='/logout' component={LogOut} />
            <Route path='/event' component={EventAdminMain} />

            <Route exact path='/crew/:id' component={CrewMain} >
                {isAuthenticated ? <CrewMain /> : <Unauthorized />}
            </Route>
            
            <Route path='/venue'>
                {policies.some(a => a === 6) ? <VenueMain /> : <Unauthorized />}
            </Route>
            <Route path='/crewadmin'>
                {policies.some(a => a === 1) ? <CrewAdminMain /> : <Unauthorized />}
            </Route>
            <Route path='/useradmin'>
                {policies.some(a => a === 4) ? <UserAdminMain /> : <Unauthorized />}
            </Route>
            <Route path='/report'>
                {policies.some(a => a === 5) ? <ReportMain /> : <Unauthorized />}
            </Route>
            <Route path='/participant'>
                {policies.some(a => a === 7) ? <ParticipantMain /> : <Unauthorized />}
            </Route>
            <Route path='/ticketadmin'>
                {policies.some(a => a === 2) ? <TicketTypeAdminMain /> : <Unauthorized />}
            </Route>
            <Route path='/seatmap'>
                {policies.some(a => a === 3) ? <SeatMapMain /> : <Unauthorized />}
            </Route>
            <Route path='/organizer' component={OrganizerAdminMain} >
                {roles.some(a => a === "Admin") ? <OrganizerAdminMain /> : <Unauthorized />}
            </Route>

            <Route component={PageNotFound}/>
        </Switch>
    )
}