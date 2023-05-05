var express = require('express');
var router = express.Router();
const admin = require('../controller/admin');
const authenticate = require('../controller/authentication')
const { access_controll, admin_vadlidation } = require('../middlewares/access_control')

const app_name = process.env.APP_NAME

router.use(admin_vadlidation())

router.get('/', function (req, res, next) {
    let user = req.user
    res.render('admin/dashboard', {
        title: app_name,
        page_title: 'Dashboard',
        breadcrumbs: [
            {
                page_name: 'Dashboard',
                active: true,
            }
        ],
        dashboard_page: true,
        user
    });
});

router.get('/messages', access_controll('messages', 'view'), function (req, res, next) {
    let user = req.user;
    admin.message.getAll()
        .then((data) => {
            // console.log(data)
            res.render('admin/messages', {
                title: app_name,
                page_title: 'Contacts',
                breadcrumbs: [
                    {
                        page_name: 'Messages',
                        active: true,
                    }
                ],
                messages_page: true,
                user,
                data
            });
        })
});

router.post('/messages/delete', access_controll('messages', 'delete'), function (req, res, next) {
    let user = req.user
    admin.message.delete(req.body.id).then((response) => {
        res.send(
            {
                response: "acknowledged",
                status: true
            }
        );
    })
});

router.get('/admins', access_controll('admins', 'view'), function (req, res, next) {
    let user = req.user
    admin.admins.getAll()
        .then((admins) => {
            // console.log(response);
            res.render('admin/admins', {
                title: app_name,
                page_title: 'Admins',
                breadcrumbs: [
                    {
                        page_name: 'Admins',
                        active: true,
                    }
                ],
                admins_page: true,
                user,
                admins
            });
        })
});

router.get('/add-admin', access_controll('admins', 'add'), function (req, res, next) {
    let user = req.user;
    let message = req.flash('message');
    res.render('admin/admins/add_admin', {
        title: app_name,
        page_title: 'Admins',
        breadcrumbs: [
            {
                page_name: 'Admins',
                page_link: '/admins'
            },
            {
                page_name: 'Add Admin',
                active: true,
            }
        ],
        admins_page: true,
        user,
        message
    });
});

router.post('/add-admin', access_controll('admins', 'add'), function (req, res, next) {
    // console.log(req.body);
    let user = req.body

    authenticate.check_user_exist(user.email).then((response) => {
        if (user.password == user.cpassword) {
            admin.admins.add(user).then((response) => {
                res.redirect('/admin/admins')
            })
        } else {
            req.flash('message', `Password not match`);
            res.redirect('/admin/add-admin');
        }
    }).catch((error) => {
        req.flash('message', `${error}`);
        res.redirect('/admin/add-admin');
    })

});

router.get('/admins/:id', access_controll('admins', 'edit'), function (req, res, next) {
    let user = req.user
    admin.admins.get(req.params.id)
        .then((admin) => {
            // console.log(response);
            res.render('admin/admins/edit_admin', {
                title: app_name,
                page_title: 'Admins',
                breadcrumbs: [
                    {
                        page_name: 'Admins',
                        page_link: '/admins'
                    },
                    {
                        page_name: 'Edit Admin',
                        active: true,
                    }
                ],
                admins_page: true,
                user,
                admin
            });
        })
});

router.post('/admins/update/:id', access_controll('admins', 'update'), function (req, res, next) {
    // console.log(req.params.id);
    // console.log(req.body)
    let user = req.user
    admin.admins.update(req.params.id, req.body)
        .then((response) => {
            res.redirect('/admin/admins/')
        })
});

router.post('/admins/remove/', access_controll('admins', 'remove'), function (req, res, next) {
    let user = req.user
    admin.admins.remove(req.body.id).then((response) => {
        res.send(
            {
                response: "ok",
                status: true
            }
        );
    })
});

router.get('/account', function (req, res, next) {
    let user = req.user
    res.render('admin/account', {
        title: app_name,
        page_title: 'My Account',
        breadcrumbs: [
            {
                page_name: 'account',
                active: true,
            }
        ],
        account_page: true,
        user
    });
});

router.post('/account/update/profile', function (req, res, next) {
    let user = req.user
    // console.log(req.body)
    admin.account.update(user._id, req.body)
        .then((response) => {
            res.send({
                status: true,
                message: 'ok'
            })
        })
});

router.post('/account/update/password', function (req, res, next) {
    let user = req.user
    // console.log(req.body)
    admin.account.update(user._id, req.body)
        .then((response) => {
            res.send({
                status: true,
                message: 'ok'
            })
        })
});

//candidates
router.get('/candidates', access_controll('candidates', 'view'), function (req, res, next) {
    let user = req.user
    res.render('admin/candidates', {
        title: app_name,
        page_title: 'Candidates',
        breadcrumbs: [
            {
                page_name: 'Candidates',
                active: true,
            }
        ],
        candidates_page: true,
        user,
    });
});

router.post('/candidates/search', access_controll('candidates', 'view'), function (req, res, next) {
    let user = req.user
    admin.candidates.search(req.body.text)
        .then((candidates) => {
            res.render('admin/candidates/view', {
                title: app_name,
                page_title: 'Candidates',
                breadcrumbs: [
                    {
                        page_name: 'Candidates',
                        active: true,
                    }
                ],
                candidates_page: true,
                candidates,
                user,
            });
        })
});

router.get('/candidates/:id', access_controll('candidates', 'view'), function (req, res, next) {
    let user = req.user
    admin.candidates.get(req.params.id)
        .then((candidate) => {
            // console.log(response);
            res.render('admin/candidates/view_one', {
                title: app_name,
                page_title: 'Candidates',
                breadcrumbs: [
                    {
                        page_name: 'Candidates',
                        page_link: '/candidates'
                    },
                    {
                        page_name: 'View Candidate',
                        active: true,
                    }
                ],
                candidates_page: true,
                user,
                candidate,
                message
            });
        })
});

router.get('/candidates/edit/:id', access_controll('candidates', 'edit'), function (req, res, next) {
    let user = req.user
    let message = req.flash('message')
    admin.candidates.get(req.params.id)
        .then((candidate) => {
            // console.log(response);
            res.render('admin/candidates/edit', {
                title: app_name,
                page_title: 'Candidates',
                breadcrumbs: [
                    {
                        page_name: 'Candidates',
                        page_link: '/candidates'
                    },
                    {
                        page_name: 'Edit Candidate',
                        active: true,
                    }
                ],
                candidates_page: true,
                user,
                candidate,
                message
            });
        })
});

router.post('/candidates/update/:id', access_controll('candidates', 'update'), function (req, res, next) {
    let user = req.user
    console.log(req.body)
    if(req.body.id == req.params.id){
        console.log(req.body)
        admin.candidates.get(req.params.id)
            .then((candidate) => {
                // console.log(response);
                res.render('admin/candidates/edit', {
                    title: app_name,
                    page_title: 'Candidates',
                    breadcrumbs: [
                        {
                            page_name: 'Candidates',
                            page_link: '/candidates'
                        },
                        {
                            page_name: 'Edit Candidate',
                            active: true,
                        }
                    ],
                    candidates_page: true,
                    user,
                    candidate
                });
            })
    }else{
        req.flash('message', `Invalid Request, Try again`);
        res.redirect('/admin/candidates/edit/'+req.params.id)
    }
});

module.exports = router;
