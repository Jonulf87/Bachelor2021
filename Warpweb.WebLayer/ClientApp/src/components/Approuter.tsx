import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

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
import axios from 'axios';

enum Policy {
    CheckInAdmin = 0,
    CrewAdmin = 1,
    TicketAdmin = 2,
    SeatMapAdmin = 3,
    UserAdmin = 4,
    ReportAdmin = 5,
    VenueAdmin = 6,
    ParticipantAdmin = 7,
}

const AppRouter: React.FC = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const { currentEventChangeCompleteTrigger } = useCurrentEvent();
    const { isAuthenticated, roles, orgsIsAdminAt } = useAuth();

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
        <Routes>
            <Route path="/" element={<EventUserMain />} />
            <Route path="/userevent" element={<EventUserMain />} />
            <Route path="/userticket/:login?" element={<TicketMain />} />
            <Route path="/userseatmap" element={<SeatMapMain />} />
            <Route path="/register/:ticket?" element={<UserRegister />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/event" element={!isAuthenticated ? <NotAuthenticated /> : <EventAdminMain />} />
            <Route path="/user/:loggedin?" element={!isAuthenticated ? <NotAuthenticated /> : <UserMain />} />
            <Route path="/crew/:id" element={!isAuthenticated ? <NotAuthenticated /> : <CrewMain />} />
            <Route
                path="/venue"
                element={
                    !isAuthenticated ? (
                        <NotAuthenticated />
                    ) : !policies.some((a) => a === 6) && orgsIsAdminAt.length === 0 ? (
                        <Unauthorized />
                    ) : (
                        <VenueMain />
                    )
                }
            />

            <Route
                path="/crewadmin"
                element={!isAuthenticated ? <NotAuthenticated /> : !policies.some((a) => a === 1) ? <Unauthorized /> : <CrewAdminList />}
            />
            <Route
                path="/useradmin"
                element={!isAuthenticated ? <NotAuthenticated /> : !policies.some((a) => a === 4) ? <Unauthorized /> : <UserAdminMain />}
            />
            <Route
                path="/participant"
                element={
                    !isAuthenticated ? <NotAuthenticated /> : !policies.some((a) => a === 7) ? <Unauthorized /> : <ParticipantAdminMain />
                }
            />
            <Route
                path="/ticketadmin"
                element={
                    !isAuthenticated ? <NotAuthenticated /> : !policies.some((a) => a === 2) ? <Unauthorized /> : <TicketTypeAdminMain />
                }
            />
            <Route
                path="/seatmap"
                element={!isAuthenticated ? <NotAuthenticated /> : !policies.some((a) => a === 3) ? <Unauthorized /> : <SeatMapAdminMain />}
            />
            <Route
                path="/organizer"
                element={roles.some((a) => a === 'Admin') || orgsIsAdminAt.length > 0 ? <OrganizerAdminMain /> : <Unauthorized />}
            />
            <Route element={<PageNotFound />} />
        </Routes>
    );
};

export default AppRouter;
