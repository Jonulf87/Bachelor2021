import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import usePurchase from '../../hooks/usePurchase';

export default function LogOut() {

    const [isLoggedOut, setIsLoggedOut] = useState(false);

    const { logout } = useAuth();
    const { setCurrentEvent } = useCurrentEvent();
    const { setUserTickets } = usePurchase();

    useEffect(() => {
        const logOutFunction = async () => {
            await logout();
            setCurrentEvent("");
            setUserTickets([]);
            setIsLoggedOut(true);
        }
        logOutFunction();
    }, []);

    if (isLoggedOut) {
        return (
            <Redirect to={"/"} />
        )
    }
    return null;
}