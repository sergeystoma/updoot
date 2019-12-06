export default function (req, res) {
    const { item } = req.query;

    let pinned = req.session.pinned || [];

    if (!pinned.includes(item)) {
        pinned.unshift(item);
        pinned = pinned.slice(0, 64);
    }

    req.session.pinned = pinned;

    res.json({
        pinned: req.session.pinned,
    });
}
