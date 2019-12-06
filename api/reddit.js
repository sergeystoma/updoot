import axios from 'axios';

import { log } from './db.js';

/**
 * Creates an error with a status code.
 */
function errorWithStatusCode(message, code) {
    const error = new Error(message);
    error.statusCode = code;

    return error;
}

/**
 * Refreshes the Reddit token.
 */
function refreshToken(req) {
    return new Promise((resolve, reject) => {
        if (req.session.refreshToken) {
            const data = `grant_type=refresh_token&refresh_token=${req.session.refreshToken}`;

            axios.post('https://www.reddit.com/api/v1/access_token', data, {
                auth: {
                    username: process.env.OAUTH_CLIENT,
                    password: process.env.OAUTH_SECRET,
                },
            }).then((authResponse) => {
                const authData = authResponse.data;

                if (authData.access_token) {
                    req.session.accessToken = authData.access_token;
                    resolve();
                } else {
                    reject(errorWithStatusCode('Expired login session', 401));
                }
            }).catch(() => {
                reject(errorWithStatusCode('Expired login session', 401));
            });
        } else {
            reject(errorWithStatusCode('Expired login session', 401));
        }        
    });
}

function makeRequest(req, request) {
    return new Promise((resolve, reject) => {
        if (req.session.accessToken == null) {
            reject(errorWithStatusCode('Invalid login session', 401));
        } else {
            request().then((data) => {
                resolve(data.data);
            }).catch((error) => {
                if (error.response.status === 401) {
                    // Refresh the token
                    refreshToken(req).then(() => {
                        // Then retry the request.
                        request().then((data) => {
                            resolve(data.data);
                        }).catch((error) => {
                            if (error.response.status === 401) {
                                reject(errorWithStatusCode('Expired login session', 401));
                            } else {
                                reject(errorWithStatusCode('Bad request', 400));
                            }
                        });
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    log(error).then(() => {
                        reject(errorWithStatusCode('Bad request', 400));
                    });
                }
            });
        }
    });
}

/**
 * Makes a GET request to the Reddit API.
 */
export function get(req, url) {
    function request() {
        return axios.get(url, {
            headers: {
                Authorization: `bearer ${req.session.accessToken}`,
            },
        });
    }

    return makeRequest(req, request);
}

/**
 * Makes a POST request to the Reddit API.
 */
export function post(req, url, data) {
    function request() {
        return axios.post(url, data, {
            headers: {
                Authorization: `bearer ${req.session.accessToken}`,
            },
        });
    }

    return makeRequest(req, request);
}
