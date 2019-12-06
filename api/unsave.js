import { post } from './reddit.js';

import { log } from './db.js';

export default function (req, res) {
    const { item } = req.query;

    post(req, 'https://oauth.reddit.com/api/unsave', `id=${encodeURIComponent(item)}`).then(() => {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate').json({});
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