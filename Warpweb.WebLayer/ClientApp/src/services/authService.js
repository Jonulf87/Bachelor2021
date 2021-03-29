
const login = async (userName, password) => {
    const response = await fetch('/api/auth/login', {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({userName, password})
    })

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(result));
    }
    else {
        localStorage.removeItem("currentUser");
    }
    
    return result;
}

const isAuthenticated = () => {
    return localStorage.getItem("currentUser") !== null;
}

const getAccessToken = async () => {

    const currentUser = localStorage.getItem("currentUser");
    const parseJwt = JSON.parse(atob(currentUser.split('.')[1]));

    const date = parseJwt.exp;
    const dateToday = Date.now() / 1000;


    if (date < dateToday) {

        const tokenRequestDataToBeSent = {
            'token': currentUser.token,
            'refreshToken': currentUser.refreshToken
        }

        const response = await fetch('/api/auth/refreshtoken', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(tokenRequestDataToBeSent)
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("currentUser", JSON.stringify(result));
            const newToken = localStorage.getItem("currentUser");
            return JSON.parse(newToken).token;
        }
        else {
            localStorage.removeItem("currentUser");
        }
    }

    if (currentUser === null) {
        return null;
    }

    return JSON.parse(currentUser).token;
}

const logout = async () => {

    const currentUser = localStorage.getItem("currentUser");

    const tokenDataToBeSent = {
        'token': currentUser.token,
        'refreshToken': currentUser.refreshToken
    };

    const response = await fetch('/api/auth/logout', {
        headers: {
            'Authorization': `Bearer: ${currentUser.token}`,
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(tokenDataToBeSent)
    })

    if (response.ok) {
        localStorage.removeItem("currentUser"); 
        return
    }

    return
}

export default  {
    login,
    isAuthenticated,
    getAccessToken,
    logout
}