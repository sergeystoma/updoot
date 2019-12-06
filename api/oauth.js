import axios from 'axios';

import { getItem, clearItem } from './db.js';

import { get } from './reddit.js';

export default function (req, res) {
    const state = req.query.state;

    if (state) {
        getItem(`updoot:state-${state}`).then((value) => {
            clearItem(`updoot:state-${state}`).then(() => {
                if (state === value) {
                    const redirectUrl = process.env.OAUTH_REDIRECT;

                    const data = `grant_type=authorization_code&code=${req.query.code}&redirect_uri=${redirectUrl}`;

                    axios.post('https://www.reddit.com/api/v1/access_token', data, {
                        auth: {
                            username: process.env.OAUTH_CLIENT,
                            password: process.env.OAUTH_SECRET,
                        },
                    }).then((authResponse) => {
                        const authData = authResponse.data;

                        if (authData.access_token) {
                            req.session.accessToken = authData.access_token;
                            req.session.refreshToken = authData.refresh_token;

                            get(req, 'https://oauth.reddit.com/api/v1/me').then((me) => {
                                req.session.username = me.name;
        
                                res.redirect('/app');
                            }).catch(() => {
                                // Weird, we just logged in...
                                res.redirect('/');
                            });
                        } else {
                            // No token, failed login?
                            res.redirect('/');            
                        }
                    }).catch(() => {
                        // Something happened, no permissions?
                        res.redirect('/');
                    });
                } else {
                    res.redirect('/');
                }
            }).catch(() => {
                res.redirect('/');
            });
        }).catch(() => {
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
}
