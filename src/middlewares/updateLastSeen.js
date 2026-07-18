const User = require("../modules/user/user.model");

async function updateLastSeen(req, res, next) {
    if (req.user && req.user.id) {
        await User.update(
            { lastSeen: new Date() },
            { where: { id: req.user.id } }
        );
    }
    next();
}

module.exports = updateLastSeen;