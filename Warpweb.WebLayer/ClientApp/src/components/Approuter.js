import React, { useState, useEffect } from 'react';
import {
    Route,
    Switch,
} from "react-router-dom";

import UserAdminMain from './UserAdmin/UserAdminMain';
import CrewMain from './Crew/CrewMain';
import CrewAdminMain from './CrewAdmin/CrewAdminMain';
import EventAdminMain from './EventAdmin/EventAdminMain';
import EventUserMain from './Event/EventUserMain';
import ParticipantAdminMain from './Participant/ParticipantAdminMain';
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
import PageNotFound from './ErrorPages/PageNotFound';
import Unauthorized from './ErrorPages/Unauthorized';
import NotAuthenticated from './ErrorPages/NotAuthenticated';

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
            <Route path='/userticket/:login?' component={TicketMain} />
            
            <Route path='/register/:ticket?' component={UserRegister} />
            <Route path='/login' component={UserLogin} />
            <Route path='/logout' component={LogOut} />
            <Route path='/event' component={EventAdminMain} />
            <Route path='/user'>
                {!isAuthenticated ? <NotAuthenticated /> : <UserMain /> }
            </Route>
            <Route exact path='/crew/:id' component={CrewMain} >
                {!isAuthenticated ? <NotAuthenticated /> : <CrewMain />}
            </Route>           
            <Route path='/venue'>
                {!isAuthenticated ? <NotAuthenticated /> 
                : !policies.some(a => a === 6) ? <Unauthorized />
                : <VenueMain />}
            </Route>
            <Route path='/crewadmin'>
                {!isAuthenticated ? <NotAuthenticated /> 
                : !policies.some(a => a === 1) ? <Unauthorized />
                : <CrewAdminMain />}
            </Route>
            <Route path='/useradmin'>
                {!isAuthenticated ? <NotAuthenticated /> 
                : !policies.some(a => a === 4) ? <Unauthorized />
                : <UserAdminMain />}
            </Route>
            <Route path='/report'>
                {!isAuthenticated ? <NotAuthenticated /> 
                : !policies.some(a => a === 5) ? <Unauthorized />
                : <ReportMain />}
            </Route>
            <Route path='/participant'>
                {!isAuthenticated ? <NotAuthenticated /> 
                : !policies.some(a => a === 7) ? <Unauthorized />
                : <ParticipantAdminMain />}
            </Route>
            <Route path='/ticketadmin'>
                {!isAuthenticated ? <NotAuthenticated /> 
                : !policies.some(a => a === 2) ? <Unauthorized />
                : <TicketTypeAdminMain />}
            </Route>
            <Route path='/seatmap'>
                {!isAuthenticated ? <NotAuthenticated /> 
                : !policies.some(a => a === 3) ? <Unauthorized />
                : <SeatMapMain />}
            </Route>
            <Route path='/organizer' component={OrganizerAdminMain} >
                {roles.some(a => a === "Admin") ? <OrganizerAdminMain /> : <Unauthorized />}
            </Route>

            <Route component={PageNotFound}/>
        </Switch>
    )
}