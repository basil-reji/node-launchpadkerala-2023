
const access_controll = (asset, permission) => {
    return (req, res, next) => {
        let user = req.user;

        if (user) {
            try {
                if (user.permissions[asset][permission]) {
                    next()
                } else if (user.permissions[asset]['all']) {
                    next()
                } else if (user.permissions['all']) {
                    next()
                } else {
                    res.redirect('/')
                }
            } catch (error) {
                res.redirect('/')
            }
        } else {
            res.redirect('/login')
        }
    }
}

const admin_vadlidation = () => {
    return (req, res, next) => {
        let user = req.user;

        if (user) {

            if (user.permissions.admin) {
                next()
            } else if (user.role == 'admin') {
                next()
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/login')
        }

    }
}

module.exports = {
    access_controll,
    admin_vadlidation
}