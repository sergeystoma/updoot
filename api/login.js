import randomstring from 'randomstring';

import { setItem } from './db.js';

/**
 * Initiate the login sequence and redirect to Reddit for OAuth authorization.
 */
export default function (req, res) {
    const state = randomstring.generate(64);

    req.session.destroy();

    // Is 15 minutes to login enough?
    setItem(`updoot:state-${state}`, state, 900).then(() => {
        const client = process.env.OAUTH_CLIENT;
        const redirectUrl = process.env.OAUTH_REDIRECT;

        const url = `https://www.reddit.com/api/v1/authorize?client_id=${client}&response_type=code&state=${state}&redirect_uri=${redirectUrl}&duration=permanent&scope=identity history save`;

        res.redirect(url);
    }).catch(() => {
        res.redirect('/');
    });
}
