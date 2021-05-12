import React, { useState, useEffect, useRef } from 'react';

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [roles, setRoles] = useState([]);
    const [orgsIsAdminAt, setOrgsIsAdminAt] = useState([]);
    const [isOrgAdmin, setOrgAdmin] = useState(false);
    const refreshTokenTimeoutId = useRef(null);

    const refreshToken = (delay, callback) => {
        if (refreshTokenTimeoutId.current) {
            clearTimeout(refreshTokenTimeoutId.current);
        }
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
                setOrgAdmin(jwtToken.IsOrgAdmin === "True");

                const role = jwtToken.role;

                if (Array.isArray(role)) {
                    setRoles(role);
                } else if (role) {
                    setRoles([role])
                } else {
                    setRoles([])
                }

                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setToken(null);
                setRoles([]);
                localStorage.removeItem('currentUser');
                setOrgAdmin(false);
            }

            if (callback) {
                callback();
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


            const jwtToken = JSON.parse(atob(result.token.split('.')[1]));
            const expires = new Date(jwtToken.exp * 1000)
            let timeout = expires.getTime() - Date.now() - 15 * 1000;
            setOrgAdmin(jwtToken.IsOrgAdmin === "True");

            const role = jwtToken.role;
            if (Array.isArray(role)) {
                setRoles(role);
            } else if (role) {
                setRoles([role])
            } else {
                setRoles([])
            }

            setIsAuthenticated(true);
            refreshToken(timeout);
        }
        else {
            localStorage.removeItem("currentUser");
            setIsAuthenticated(false);
            setToken(null);
            setRoles([]);
            setOrgAdmin(false);
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
        setOrgAdmin(false);
        setOrgsIsAdminAt([]);

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
            setOrgAdmin(jwtToken.IsOrgAdmin === "True");

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
                setToken(currentUser);
                setIsAuthenticated(true);
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

    useEffect(() => {
        if (isAuthenticated) {
            const getOrgsUserIsAdminAt = async () => {

                const responseOrgIsAdminAt = await fetch('/api/tenants/getaorgsadmin', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });

                const resultOrgAdmins = await responseOrgIsAdminAt.json();

                if (Array.isArray(resultOrgAdmins)) {
                    setOrgsIsAdminAt(resultOrgAdmins);
                } else if (resultOrgAdmins) {
                    setOrgsIsAdminAt([resultOrgAdmins])
                } else {
                    setOrgsIsAdminAt([])
                }
            }
            getOrgsUserIsAdminAt();
        }
    }, [isAuthenticated])

    return <AuthContext.Provider value={{ isAuthenticated, token, roles, login, logout, refreshToken, isOrgAdmin, orgsIsAdminAt }}>{children}</AuthContext.Provider>;

};

export default AuthProvider;