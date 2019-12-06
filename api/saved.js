import { get } from './reddit.js';

import { log } from './db.js';

function empty(v) {
    return v == null || v.length === 0;
}

export default function (req, res) {
    let url = `https://oauth.reddit.com/user/${encodeURIComponent(req.session.username)}/saved?limit=100`;

    if (req.query.after) {
        url += `&after=${encodeURIComponent(req.query.after)}`;
    }

    const pinned = req.session.pinned || [];

    get(req, url).then((saved) => {
        if (saved && saved.data && saved.data.children) {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate').json(saved.data.children.filter(thing => thing.data).map((thing) => {
                const mapped = {
                    permalink: thing.data.permalink,
                    name: thing.data.name,
                    pinned: pinned.includes(thing.data.name),
                    created_utc: thing.data.created_utc,
                    author: thing.data.author,
                    subreddit: thing.data.subreddit_name_prefixed,
                    domain: thing.data.domain,
                    url: thing.data.url,
                    nsfw: thing.data.over_18,
                    title: thing.data.title,
                    text: thing.data.selftext,
                    html: thing.data.selftext_html,
                };

                if (empty(mapped.title) && thing.data.link_title) {
                    mapped.title = thing.data.link_title;
                }

                if (empty(mapped.text) && thing.data.body) {
                    mapped.text = thing.data.body;
                }

                if (empty(mapped.html) && thing.data.body_html) {
                    mapped.html = thing.data.body_html;
                }

                if (thing.data.preview) {
                    if (thing.data.preview.images && thing.data.preview.images.length > 0) {
                        const image = thing.data.preview.images[0];

                        if (image.source) {
                            mapped.preview = {
                                url: image.source.url,
                                width: image.source.width,
                                height: image.source.height,
                            };

                            if (image.variants && image.variants.nsfw && image.variants.nsfw.source) {
                                mapped.previewBlurred = {
                                    url: image.variants.nsfw.source.url,
                                    width: image.variants.nsfw.source.width,
                                    height: image.variants.nsfw.source.height,
                                };                                
                            } else if (image.variants && image.variants.obfuscated && image.variants.obfuscated.source) {
                                mapped.previewBlurred = {
                                    url: image.variants.obfuscated.source.url,
                                    width: image.variants.obfuscated.source.width,
                                    height: image.variants.obfuscated.source.height,
                                };                                
                            }
                        }
                    }
                }

                return mapped;
            }));
        }
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