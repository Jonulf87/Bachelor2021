import React, { useState, useEffect, useRef } from 'react';

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [roles, setRoles] = useState([]);
    const refreshTokenTimeoutId = useRef(null);

    const refreshToken = (delay) => {

        refreshTokenTimeoutId.current = setTimeout(async () => {
            const response = await fetch('/api/auth/refreshtoken', {
                method: 'POST'
            });

            if (response.ok) {
                const result = await response.json();
                setToken(result.token);
                localStorage.setItem('currentUser', result.token);
                const jwtToken = JSON.parse(atob(result.token.split('.')[1]));
                const expires = new Date(jwtToken.exp * 1000);
                let timeout = expires.getTime() - Date.now() - 15 * 1000;
                refreshToken(timeout);

                const role = jwtToken.role;

                if (Array.isArray(role)) {
                    setRoles(role);
                } else if (role) {
                    setRoles([role])
                } else {
                    setRoles([])
                }
            } else {
                setIsAuthenticated(false);
                setToken(null);
                setRoles([]);
                localStorage.removeItem('currentUser');
            }
        }, delay);
    }

    const login = async (userName, password) => {

        const response = await fetch('/api/auth/login', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ userName, password })
        })

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("currentUser", result.token);
            setToken(result.token);
            setIsAuthenticated(true);

            const jwtToken = JSON.parse(atob(result.token.split('.')[1]));
            const expires = new Date(jwtToken.exp * 1000)
            let timeout = expires.getTime() - Date.now() - 15 * 1000;

            const role = jwtToken.role;
            if (Array.isArray(role)) {
                setRoles(role);
            } else if (role) {
                setRoles([role])
            } else {
                setRoles([])
            }

            refreshToken(timeout);
        }
        else {
            localStorage.removeItem("currentUser");
            setIsAuthenticated(false);
            setToken(null);
            setRoles([]);
        }
        return result;
    };


    const logout = async () => {

        const response = await fetch('/api/auth/logout', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });

        localStorage.removeItem('currentUser');
        setIsAuthenticated(false);
        setToken(null);
        setRoles([]);

        if (refreshTokenTimeoutId.current) {
            clearTimeout(refreshTokenTimeoutId.current);
            refreshTokenTimeoutId.current = null;
        }
    };

    useEffect(() => {

        const currentUser = localStorage.getItem('currentUser');

        if (currentUser !== null) {

            const jwtToken = JSON.parse(atob(currentUser.split('.')[1]));
            const expires = new Date(jwtToken.exp * 1000);
            let timeout = expires.getTime() - Date.now() - 15 * 1000;

            const role = jwtToken.role;
            if (Array.isArray(role)) {
                setRoles(role);
            } else if (role) {
                setRoles([role])
            } else {
                setRoles([])
            }

            if (timeout < 0) {
                timeout = 0;
            }
            else {
            setIsAuthenticated(true);
            setToken(currentUser);
            }

            refreshToken(timeout);
        }

        return () => {
            if (refreshTokenTimeoutId.current) {
                clearTimeout(refreshTokenTimeoutId.current);
                refreshTokenTimeoutId.current = null;
            }
        };
    }, []);

    return <AuthContext.Provider value={{ isAuthenticated, token, roles, login, logout, refreshToken }}>{children}</AuthContext.Provider>;

};

export default AuthProvider;