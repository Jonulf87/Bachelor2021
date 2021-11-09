import axios from 'axios';
import React, { useState, useEffect, useRef, useCallback } from 'react';

type AuthContextState = {
    isAuthenticated: boolean;
    token: string | null;
    roles: string[];
    login: (userName: string, password: string) => Promise<AuthResultVm>;
    logout: () => Promise<void>;
    refreshToken: (delay: number, callback: () => void) => void;
    isOrgAdmin: boolean;
    orgsIsAdminAt: OrganizerVm[];
};

export const AuthContext = React.createContext<AuthContextState>({} as AuthContextState);

type OrganizerVm = {
    id: number;
    name: string;
    orgNumber: string;
    description: string;
};

type AuthResultVm = {
    errors: string[];
    token: string;
};

const AuthProvider: React.FC = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const token = useRef<string | null>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const [orgsIsAdminAt, setOrgsIsAdminAt] = useState<OrganizerVm[]>([]);
    const [isOrgAdmin, setOrgAdmin] = useState<boolean>(false);
    const refreshTokenTimeoutId = useRef<number | null>(null);

    const refreshToken = useCallback((delay: number, callback?: () => void) => {
        if (refreshTokenTimeoutId.current) {
            clearTimeout(refreshTokenTimeoutId.current);
        }
        refreshTokenTimeoutId.current = window.setTimeout(async () => {
            const result = await axios.post<AuthResultVm>('/api/auth/refreshtoken');

            if (result.status === 200) {
                token.current = result.data.token;
                localStorage.setItem('currentUser', result.data.token);
                const jwtToken = JSON.parse(atob(result.data.token.split('.')[1]));
                const expires = new Date(jwtToken.exp * 1000);
                let timeout = expires.getTime() - Date.now() - 15 * 1000;
                refreshToken(timeout);
                setOrgAdmin(jwtToken.IsOrgAdmin === 'True');

                const role = jwtToken.role;

                if (Array.isArray(role)) {
                    setRoles(role);
                } else if (role) {
                    setRoles([role]);
                } else {
                    setRoles([]);
                }

                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                token.current = null;
                setRoles([]);
                localStorage.removeItem('currentUser');
                setOrgAdmin(false);
            }

            if (callback) {
                callback();
            }
        }, delay);
    }, []);

    const login = useCallback(
        async (userName: string, password: string): Promise<AuthResultVm> => {
            const result = await axios.post<AuthResultVm>(
                '/api/auth/login',
                { userName, password },
                {
                    headers: {
                        'content-type': 'application/json',
                    },
                },
            );

            if (result.status === 200) {
                localStorage.setItem('currentUser', result.data.token);
                token.current = result.data.token;

                const jwtToken = JSON.parse(atob(result.data.token.split('.')[1]));
                const expires = new Date(jwtToken.exp * 1000);
                let timeout = expires.getTime() - Date.now() - 15 * 1000;
                setOrgAdmin(jwtToken.IsOrgAdmin === 'True');

                const role = jwtToken.role;
                if (Array.isArray(role)) {
                    setRoles(role);
                } else if (role) {
                    setRoles([role]);
                } else {
                    setRoles([]);
                }

                setIsAuthenticated(true);
                refreshToken(timeout);
            } else {
                localStorage.removeItem('currentUser');
                setIsAuthenticated(false);
                token.current = null;
                setRoles([]);
                setOrgAdmin(false);
            }

            return result.data;
        },
        [refreshToken],
    );

    const logout = useCallback(async () => {
        await axios.post('/api/auth/logout', null, {
            headers: {
                'content-type': 'application/json',
            },
        });

        localStorage.removeItem('currentUser');
        setIsAuthenticated(false);
        token.current = null;
        setRoles([]);
        setOrgAdmin(false);
        setOrgsIsAdminAt([]);

        if (refreshTokenTimeoutId.current) {
            clearTimeout(refreshTokenTimeoutId.current);
            refreshTokenTimeoutId.current = null;
        }
    }, []);

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');

        if (currentUser !== null) {
            const jwtToken = JSON.parse(atob(currentUser.split('.')[1]));
            const expires = new Date(jwtToken.exp * 1000);
            let timeout = expires.getTime() - Date.now() - 15 * 1000;
            setOrgAdmin(jwtToken.IsOrgAdmin === 'True');

            const role = jwtToken.role;
            if (Array.isArray(role)) {
                setRoles(role);
            } else if (role) {
                setRoles([role]);
            } else {
                setRoles([]);
            }

            if (timeout < 0) {
                timeout = 0;
            } else {
                token.current = currentUser;
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
    }, [refreshToken]);

    useEffect(() => {
        if (isAuthenticated) {
            const getOrgsUserIsAdminAt = async () => {
                const resultOrgAdmins = await axios.get<OrganizerVm[]>('/api/tenants/getaorgsadmin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setOrgsIsAdminAt(resultOrgAdmins.data);
            };

            getOrgsUserIsAdminAt();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, token: token.current, roles, login, logout, refreshToken, isOrgAdmin, orgsIsAdminAt }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
