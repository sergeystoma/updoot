import { get } from './reddit.js';

import { log } from './db.js';

export default function (req, res) {
    get(req, 'https://oauth.reddit.com/api/v1/me').then((me) => {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate').json({
            name: me.name,
            pinned: req.session.pinned || [],
        });
    }).catch((error) => {
        log(error).then(() => {
            if (error && error.statusCode === 401) {
                res.status(401).json({});
            } else {
                res.status(400).json({});
            }
        });
    });
}