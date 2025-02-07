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
        user
    });
});

//admins

router.get('/admins/admins', access_controll('admins', 'view'), function (req, res, next) {
    let user = req.user
    admin.admins.getAdmins(['super_admin', 'admin'])
        .then((admins) => {
            // console.log(response);
            res.render('admin/admins/view_admins', {
                title: app_name,
                page_title: 'Admins',
                breadcrumbs: [
                    {
                        page_name: 'Admins',
                        active: true,
                    }
                ],
                admins_page: true,
                admin_type: 'admins',
                user,
                admins,
            });
        })
});

router.get('/admins/recruiters', access_controll('admins', 'view'), function (req, res, next) {
    let user = req.user
    admin.admins.getAdmins(['recruiter'])
        .then((admins) => {
            // console.log(response);
            res.render('admin/admins/view_recruiters', {
                title: app_name,
                page_title: 'Admins',
                breadcrumbs: [
                    {
                        page_name: 'Admins',
                        active: true,
                    }
                ],
                admins_page: true,
                admin_type: 'recruiters',
                user,
                admins,
            });
        })
});

router.get('/admins/volunteers', access_controll('admins', 'view'), function (req, res, next) {
    let user = req.user
    admin.admins.getAdmins(['registration_volunteer'])
        .then((admins) => {
            // console.log(response);
            res.render('admin/admins/view_volunteers', {
                title: app_name,
                page_title: 'Admins',
                breadcrumbs: [
                    {
                        page_name: 'Admins',
                        active: true,
                    }
                ],
                admins_page: true,
                admin_type: 'volunteers',
                user,
                admins,
            });
        })
});

router.get('/admins/admins/add', access_controll('admins', 'add'), function (req, res, next) {
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

router.post('/admins/admins/add', access_controll('admins', 'add'), function (req, res, next) {
    let user = req.body

    authenticate.check_user_exist(user.email).then((response) => {
        if (user.password == user.cpassword) {
            admin.admins.add(user).then((response) => {
                res.redirect('/admin/admins/admins')
            })
        } else {
            req.flash('message', `Password not match`);
            res.redirect('/admin/admins/admins/add');
        }
    }).catch((error) => {
        req.flash('message', `${error}`);
        res.redirect('/admin/admins/admins/add');
    })
});

router.get('/admins/volunteers/add', access_controll('admins', 'add'), function (req, res, next) {
    let user = req.user;
    let message = req.flash('message');
    res.render('admin/admins/add_volunteer', {
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

router.post('/admins/volunteers/add', access_controll('admins', 'add'), function (req, res, next) {
    let user = req.body

    authenticate.check_user_exist(user.email).then((response) => {
        if (user.password == user.cpassword) {
            admin.admins.add(user).then((response) => {
                res.redirect('/admin/admins/volunteers')
            })
        } else {
            req.flash('message', `Password not match`);
            res.redirect('/admin/admins/volunteers/add');
        }
    }).catch((error) => {
        req.flash('message', `${error}`);
        res.redirect('/admin/admins/volunteers/add');
    })
});

router.get('/admins/recruiters/add', access_controll('admins', 'add'), function (req, res, next) {
    let user = req.user;
    let message = req.flash('message');
    res.render('admin/admins/add_recruiter', {
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

router.post('/admins/recruiters/add', access_controll('admins', 'add'), function (req, res, next) {
    let user = req.body

    authenticate.check_user_exist(user.email).then((response) => {
        if (user.password == user.cpassword) {
            admin.admins.add(user).then((response) => {
                res.redirect('/admin/admins/recruiters')
            })
        } else {
            req.flash('message', `Password not match`);
            res.redirect('/admin/admins/recruiters/add');
        }
    }).catch((error) => {
        req.flash('message', `${error}`);
        res.redirect('/admin/admins/recruiters/add');
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

router.get('/admins/admins/edit/:id', access_controll('admins', 'edit'), function (req, res, next) {
    let user = req.user;
    let message = req.flash('message');
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
                admin,
                message
            });
        });
});

router.get('/admins/recruiters/edit/:id', access_controll('admins', 'edit'), function (req, res, next) {
    let user = req.user;
    let message = req.flash('message');
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
                admin,
                message
            });
        });
});

router.get('/admins/volunteers/edit/:id', access_controll('admins', 'edit'), function (req, res, next) {
    let user = req.user;
    let message = req.flash('message');
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
                admin,
                message
            });
        });
});

router.post('/admins/admins/update/:id', access_controll('admins', 'update'), function (req, res, next) {
    // console.log(req.params.id);
    // console.log(req.body)
    let user = req.user
    admin.admins.update(req.params.id, req.body)
        .then((response) => {
            res.redirect('/admin/admins/admins/')
        }).catch((error) => {
            res.redirect('/admin/admins/admins/' + req.params.id)
        })
});

router.post('/admins/volunteers/update/:id', access_controll('admins', 'update'), function (req, res, next) {
    // console.log(req.params.id);
    // console.log(req.body)
    let user = req.user
    admin.admins.update(req.params.id, req.body)
        .then((response) => {
            res.redirect('/admin/admins/volunteers/')
        }).catch((error) => {
            res.redirect('/admin/admins/volunteers/' + req.params.id)
        })
});

router.post('/admins/recruiters/update/:id', access_controll('admins', 'update'), function (req, res, next) {
    // console.log(req.params.id);
    // console.log(req.body)
    let user = req.user
    admin.admins.update(req.params.id, req.body)
        .then((response) => {
            res.redirect('/admin/admins/recruiters/')
        }).catch((error) => {
            res.redirect('/admin/admins/recruiters/' + req.params.id)
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
    let user = req.user;
    let message = req.flash('message');
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
        message
    });
});

router.post('/candidates/search', access_controll('candidates', 'view'), function (req, res, next) {
    let user = req.user
    let message = req.flash('message');
    admin.candidates.search(req.body.text)
        .then((candidates) => {
            // console.log(candidates)
            if (candidates.length == 0) {
                req.flash('message', 'No Candidates Found');
                res.redirect('/admin/candidates/');
            } else if (candidates.length == 1) {
                res.redirect('/admin/candidates/' + candidates[0].id);
            } else {
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
                    message,
                    user,
                });
            }
        })
});

router.get('/candidates/:id', access_controll('candidates', 'view'), function (req, res, next) {
    let user = req.user
    let message = req.flash('message')
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
    // console.log(req.body)
    // console.log(req.params.id)
    if (req.body.lpk_id == req.params.id) {
        // console.log(req.body)
        admin.candidates.update(req.params.id, req.body)
            .then((candidate) => {
                // console.log(response);
                admin.candidates.get(req.params.id)
                    .then((candidate) => {
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
                            success: 'Candidate Updated Successfully!',
                            user,
                            candidate
                        });
                    })
                    .catch((error) => {
                        console.log(error)
                        res.redirect('/admin/candidates/edit/' + req.params.id);
                    })
            })
            .catch((error) => {
                console.log(error)
                req.flash('message', error);
                res.redirect('/admin/candidates/edit/' + req.params.id);
            })
    } else {
        req.flash('message', `Invalid Request, Try again`);
        res.redirect('/admin/candidates/edit/' + req.params.id)
    }
});


//Interview Registrations
router.get('/registrations', access_controll('registrations', 'view'), function (req, res, next) {
    let user = req.user
    admin.registrations.getCount()
        .then((count) => {
            res.render('admin/registrations', {
                title: app_name,
                page_title: 'Registrations',
                breadcrumbs: [
                    {
                        page_name: 'Registrations',
                        active: true,
                    }
                ],
                registrations_page: true,
                user,
                count
            });
        })
})

router.get('/registrations/candidates/find', access_controll('registrations', 'view'), function (req, res, next) {
    let user = req.user;
    let message = req.flash('message');
    res.render('admin/registrations/find_candidates', {
        title: app_name,
        page_title: 'Registrations',
        breadcrumbs: [
            {
                page_name: 'Registrations',
                page_link: '/registrations'
            },
            {
                page_name: 'Find Candidates',
                active: true,
            }
        ],
        registrations_page: true,
        user,
        message
    });
})

router.post('/registrations/candidates/search', access_controll('registrations', 'view'), function (req, res, next) {
    let user = req.user
    admin.candidates.search(req.body.text)
        .then((candidates) => {
            if (candidates.length == 0) {
                req.flash('message', 'No Candidates Found');
                res.redirect('/admin/registrations/candidates/find');
            } else if (candidates.length == 1) {
                res.redirect('/admin/registrations/add/' + candidates[0].id);
            } else {
                // console.log(candidates);
                res.render('admin/registrations/view_candidates', {
                    title: app_name,
                    page_title: 'Registrations',
                    breadcrumbs: [
                        {
                            page_name: 'Registrations',
                            page_link: '/registrations'
                        },
                        {
                            page_name: 'Find Candidates',
                            active: true,
                        }
                    ],
                    registrations_page: true,
                    candidates,
                    user,
                });
            }
        })
});

router.get('/registrations/find', access_controll('registrations', 'view'), function (req, res, next) {
    let user = req.user;
    let message = req.flash('message');
    res.render('admin/registrations/find_registrations', {
        title: app_name,
        page_title: 'Registrations',
        breadcrumbs: [
            {
                page_name: 'Registrations',
                page_link: '/registrations'
            },
            {
                page_name: 'Find Registered Candidates',
                active: true,
            }
        ],
        registrations_page: true,
        user,
        message
    });
})

router.post('/registrations/search', access_controll('registrations', 'view'), function (req, res, next) {
    let user = req.user
    admin.registrations.search(req.body.text)
        .then((registrations) => {
            if (registrations.length == 0) {
                req.flash('message', 'No Registrations Found');
                res.redirect('/admin/registrations/find');
            } else {
                // console.log(candidates);
                res.render('admin/registrations/view_registrations', {
                    title: app_name,
                    page_title: 'Registrations',
                    breadcrumbs: [
                        {
                            page_name: 'Registrations',
                            page_link: '/registrations'
                        },
                        {
                            page_name: 'Find Registered Candidate',
                            active: true,
                        }
                    ],
                    registrations_page: true,
                    registrations,
                    user,
                });
            }
        })
});

router.get('/registrations/:id', access_controll('registrations', 'view'), function (req, res, next) {
    let user = req.user
    let message = req.flash('message')
    admin.registrations.get(req.params.id)
        .then((candidate) => {
            // console.log(response);
            res.render('admin/registrations/view_registration', {
                title: app_name,
                page_title: 'Registration',
                breadcrumbs: [
                    {
                        page_name: 'Registrations',
                        page_link: '/registrations'
                    },
                    {
                        page_name: 'Candidate',
                        active: true,
                    }
                ],
                registrations_page: true,
                user,
                candidate,
                message
            });
        })
});

router.get('/registrations/candidates/view/:id', access_controll('registrations', 'view'), function (req, res, next) {
    let user = req.user
    let message = req.flash('message')
    admin.candidates.get(req.params.id)
        .then((candidate) => {
            // console.log(response);
            res.render('admin/registrations/view_candidate', {
                title: app_name,
                page_title: 'Registration',
                breadcrumbs: [
                    {
                        page_name: 'Registrations',
                        page_link: '/registrations'
                    },
                    {
                        page_name: 'Candidate',
                        active: true,
                    }
                ],
                registrations_page: true,
                user,
                candidate,
                message
            });
        })
});

router.post('/registrations/candidates/update/:id', access_controll('registrations', 'update'), function (req, res, next) {
    let user = req.user
    admin.candidates.partialUpdate(req.params.id, req.body)
        .then((response) => {
            // console.log(response);
            admin.candidates.get(req.params.id)
                .then((candidate) => {
                    res.render('admin/registrations/view_candidate', {
                        title: app_name,
                        page_title: 'Registration',
                        breadcrumbs: [
                            {
                                page_name: 'Registrations',
                                page_link: '/registrations'
                            },
                            {
                                page_name: 'Candidate',
                                active: true,
                            }
                        ],
                        registrations_page: true,
                        user,
                        candidate,
                        success: 'Candidate Updated Successfully!'
                    });
                }).catch((error) => {
                    // console.log(error)
                    req.flash('message', error);
                    res.redirect('/admin/registrations/candidates/view/' + req.params.id);
                })
        }).catch((error) => {
            // console.log(error)
            req.flash('message', error);
            res.redirect('/admin/registrations/candidates/view/' + req.params.id);
        })
});

router.get('/registrations/add/:id', access_controll('registrations', 'add'), function (req, res, next) {
    let user = req.user
    let message = req.flash('message')
    // console.log(message)
    admin.candidates.get(req.params.id)
        .then((candidate) => {
            // console.log(response);
            res.render('admin/registrations/add', {
                title: app_name,
                page_title: 'Registrations',
                breadcrumbs: [
                    {
                        page_name: 'Registrations',
                        page_link: '/registrations'
                    },
                    {
                        page_name: 'Add Registration',
                        active: true,
                    }
                ],
                registrations_page: true,
                user,
                candidate,
                message
            });
        })
});

router.post('/registrations/add/:id', access_controll('registrations', 'add'), function (req, res, next) {
    let user = req.user
    // console.log(req.body)
    // console.log(req.params.id)
    if (req.body.lpk_id == req.params.id) {
        admin.registrations.add(req.params.id, req.body, req.user)
            .then((candidate) => {
                // console.log(candidate);
                admin.interviews.add(candidate)
                    .then((info) => {
                        candidate.pools = info.pools
                        res.render('admin/registrations/confirmation', {
                            title: app_name,
                            page_title: 'Registrations',
                            breadcrumbs: [
                                {
                                    page_name: 'Registrations',
                                    page_link: '/registrations'
                                },
                                {
                                    page_name: 'Confirmation Page',
                                    active: true,
                                }
                            ],
                            registrations_page: true,
                            success: 'Candidate Registered Successfully!',
                            user,
                            candidate
                        });
                    }).catch((error) => {
                        console.log(error)
                        req.flash('message', "Invalid Request, Try again");
                        res.redirect('/admin/registrations/add/' + req.params.id);
                    })
            })
            .catch((error) => {
                // console.log("Error")                
                req.flash('message', "Invalid Request, Try again");
                res.redirect('/admin/registrations/add/' + req.params.id);
            })
    } else {
        req.flash('message', "Invalid Request, Try again");
        res.redirect('/admin/registrations/add/' + req.params.id);
    }
});

//interviews
router.get('/interviews', access_controll('interviews', 'view'), function (req, res, next) {
    let user = req.user
    res.render('admin/interviews', {
        title: app_name,
        page_title: 'Interviews',
        breadcrumbs: [
            {
                page_name: 'Interviews',
                active: true,
            }
        ],
        interviews_page: true,
        user,
    });
});

router.get('/interviews/new', access_controll('interviews', 'view'), function (req, res, next) {
    let user = req.user
    let message = req.flash('message')
    res.render('admin/interviews/new', {
        title: app_name,
        page_title: 'New Interview',
        breadcrumbs: [
            {
                page_name: 'New Interview',
                active: true,
            }
        ],
        new_interviews_page: true,
        user,
        message
    });
});

router.post('/interviews/candidates/search', access_controll('interviews', 'view'), function (req, res, next) {
    let user = req.user
    admin.interviews.search(req.body.text, user)
        .then((candidates) => {
            if (candidates.length == 0) {
                req.flash('message', 'No Candidates Found');
                res.redirect('/admin/interviews/new');
            } else if (candidates.length == 1) {
                // console.log(candidates[0].id)
                res.redirect('/admin/interviews/' + candidates[0].id);
            } else {
                res.render('admin/interviews/view', {
                    title: app_name,
                    page_title: 'Interviews',
                    breadcrumbs: [
                        {
                            page_name: 'Interviews',
                            active: true,
                        }
                    ],
                    new_interviews_page: true,
                    candidates,
                    user,

                });
            }
        });
});

router.get('/interviews/:id', access_controll('interviews', 'view'), function (req, res, next) {
    let user = req.user
    let message = req.flash('message');
    let success = req.flash('success');
    admin.interviews.get(req.params.id)
        .then((candidate) => {
            // console.log(response);
            if (candidate) {
                res.render('admin/interviews/view_one', {
                    title: app_name,
                    page_title: 'Interviews',
                    breadcrumbs: [
                        {
                            page_name: 'Interviews',
                            page_link: '/interviews'
                        },
                        {
                            page_name: 'View Candidate',
                            active: true,
                        }
                    ],
                    new_interviews_page: true,
                    user,
                    candidate,
                    message,
                    success
                });
            } else {
                req.flash('message', 'No Candidates Found');
                res.redirect('/admin/interviews/new');
            }
        })
});

router.post('/interviews/add/:id', access_controll('interviews', 'update'), function (req, res, next) {
    let user = req.user
    let time = new Date()
    // console.log(req.params.id)
    if (req.params.id == req.body.lpk_id) {
        admin.interviews.completeInterview(req.params.id, req.body, user)
            .then((candidate) => {
                res.render('admin/interviews/confirmation', {
                    title: app_name,
                    page_title: 'Interviews',
                    breadcrumbs: [
                        {
                            page_name: 'Interviews',
                            active: true,
                        }
                    ],
                    new_interviews_page: true,
                    candidate,
                    user,
                    time
                });
            })
    } else {
        req.flash('message', 'Something Went Wrong!, Try again');
        res.redirect('/admin/interviews/' + req.params.id);
    }
});

module.exports = router;
