import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function LogOut() {

    const [isLoggedOut, setIsLoggedOut] = useState(false);

    const { logout } = useAuth();

    useEffect(() => {
        const logOutFunction = async () => {
            await logout();
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