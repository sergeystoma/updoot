export default function (req, res) {
    const { item } = req.query;

    let pinned = req.session.pinned || [];

    if (pinned.includes(item)) {
        pinned = pinned.filter(p => p !== item);
    }

    req.session.pinned = pinned;

    res.json({
        pinned: req.session.pinned,
    });
}
