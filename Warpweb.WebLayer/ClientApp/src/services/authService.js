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

const getAccessToken = () => {
    const currentUser = localStorage.getItem("currentUser")

    if (currentUser === null) {
        return null;
    }

    return JSON.parse(currentUser).token;
}

export default  {
    login,
    isAuthenticated,
    getAccessToken
}