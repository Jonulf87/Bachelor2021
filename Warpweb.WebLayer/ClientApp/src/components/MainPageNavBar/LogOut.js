import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import usePurchase from '../../hooks/usePurchase';
import useSeatMap from '../../hooks/useSeatMap';

export default function LogOut() {
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    const { logout } = useAuth();
    const { setCurrentEvent } = useCurrentEvent();
    const {
        setUserTickets,
        setSelectedMainEventId,
        setUnpaidUserEventsTickets,
        setTicketTypesList,
        setTotalPrice,
        setShoppingCart,
        setPaymentOk,
        setCheckedEula,
    } = usePurchase();
    const { setActiveTicket, setRows, setUserUpcomingTickets } = useSeatMap();

    useEffect(() => {
        const logOutFunction = async () => {
            await logout();
            setCurrentEvent('');
            setUserTickets([]);
            setIsLoggedOut(true);
            setActiveTicket(null);
            setRows([]);
            setUserUpcomingTickets([]);
            setSelectedMainEventId(null);
            setUnpaidUserEventsTickets([]);
            setTicketTypesList([]);
            setTotalPrice(0);
            setShoppingCart([]);
            setCheckedEula(false);
            setPaymentOk(false);
        };
        logOutFunction();
    }, []);

    if (isLoggedOut) {
        return <Redirect to={'/'} />;
    }
    return null;
}
