import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function LogOut() {

    const { logout } = useAuth();
    const [isLoggedOut, setIsLoggedOut] = useState(false);

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