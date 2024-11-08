function getToken() {
    const token = sessionStorage.getItem('token');
    const expirationTime = sessionStorage.getItem('tokenExpiration');

    if (!token || !expirationTime) return null;

    const currentTime = new Date().getTime();
    const parsedExpirationTime = Number(expirationTime);

    if (currentTime > parsedExpirationTime) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tokenExpiration');
        return null;
    }

    return token;
}
