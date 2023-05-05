var express = require('express');
var router = express.Router();
const controller = require('../controller/user');

var app_name = 'Launchpad Kerala'

/* GET home page. */

/* GET home page. */
router.get('/', (req, res, next) => {
    let user = req.user
    // console.log(req.user);
    if (user && user.permissions.admin) {
        res.redirect('/admin/')
    } else {
        res.render('index', {
            title: app_name,
            home_page: true
        });
    }
});

router.get('/contact', (req, res, next) => {
    let user = req.user;
    res.render('pages/contact', {
        title: `Test Page | ${app_name}`,
        user
    });
});

router.post('/contact', (req, res, next) => {
    let user = req.user;
    if (user) {
        req.body.user = user.id;
    } else {
        req.body.user = null;
    }
    // console.log(req.body)
    controller.contact.message(req.body)
        .then((response) => {
            res.send(
                {
                    response: "acknowledged",
                    status: true
                }
            );
        })
        .catch((error) => {
            res.send(
                {
                    error,
                    status: false
                }
            );
        })
});

router.get('/updates', function (req, res, next) {
    res.render('updates',
        {
            title: `Updates | ${app_name}`,
            page_head: 'News & Updates',
            page_nav_name: 'Updates',
            breadcrumbs: true,
            updates_page: true
        });
});


router.get('/privacy-policy', function (req, res, next) {
    res.render('pages/privacy_policy',
        {
            title: `User Pricay Policy | ${app_name}`,
            page_head: 'User Pricay Policy',
            page_nav_name: 'pricay policy'
        });
});

router.get('/results', function (req, res, next) {
    res.render('pages/results',
        {
            title: `Results | ${app_name}`,
            page_head: 'Results',
            page_nav_name: 'Results',
            reults_page: true
        });
});

router.get('/results/view', function (req, res, next) {
    let message = req.flash('message');
    res.render('pages/result',
        {
            title: `Results | ${app_name}`,
            page_head: 'Results',
            page_nav_name: 'Results',
            reults_page: true,
            no_preloader: true,
            message,
        });
});

router.post('/results/view', function (req, res, next) {
    controller.candidate.viewCandidate(req.body)
        .then((candidate) => {
            res.render('pages/view_result',
                {
                    title: `View Result | ${app_name}`,
                    page_head: 'Results',
                    page_nav_name: 'Results',
                    reults_page: true,
                    candidate
                });
        })
        .catch((error) => {
            req.flash('message', error);
            res.redirect('/results/view');
        })
});

router.get('/allotment', function (req, res, next) {
    res.render('pages/allotment',
        {
            title: `Allotment | ${app_name}`,
            page_head: 'Allotment',
            page_nav_name: 'Allotment',
            allotment_page: true
        });
});

// router.get('/allotment/apply', function (req, res, next) {
//     let message = req.flash('message');
//     res.render('pages/allotment/apply',
//         {
//             title: `Allotment Application| ${app_name}`,
//             page_head: 'Allotment',
//             page_nav_name: 'Allotment',
//             allotment_page: true,
//             no_preloader: true,
//             message
//         });
// });

router.get('/allotment/view', function (req, res, next) {
    let message = req.flash('message');
    res.render('pages/allotment/view',
        {
            title: `Allotment Application| ${app_name}`,
            page_head: 'Allotment',
            page_nav_name: 'Allotment',
            allotment_page: true,
            no_preloader: true,
            message
        });
});

router.get('/allotment/instructions', function (req, res, next) {
    let message = req.flash('message');
    res.render('pages/allotment/instructions',
        {
            title: `Instructions | ${app_name}`,
            page_head: 'Instructions',
            page_nav_name: 'Instructions',
            allotment_page: true,
            no_preloader: true,
            message
        });
});

router.post('/allotment/view', function (req, res, next) {
    controller.candidate.viewCandidate(req.body)
        .then((candidate) => {
            if (candidate.allotment.allotted) {
                req.session.candidate = null;
                res.render('pages/allotment/success',
                    {
                        title: `Allotment Application | ${app_name}`,
                        page_head: 'Allotment',
                        page_nav_name: 'Allotment',
                        allotment_page: true,
                        success_message: 'You have been alloted a pool.',
                        candidate
                    });
            } else if (candidate.allotment.waitlisted) {
                req.session.candidate = null;
                res.render('pages/allotment/success',
                    {
                        title: `Allotment Application | ${app_name}`,
                        page_head: 'Allotment',
                        page_nav_name: 'Allotment',
                        allotment_page: true,
                        failure_message: 'Sorry to inorm you that you are waitlisted for allotment.',
                        candidate
                    });
            } else {
                req.flash('message', "");
                res.redirect('/allotment/view');
            }
        })
        .catch((error) => {
            req.flash('message', error);
            res.redirect('/allotment/view');
        })
});

// router.post('/allotment/apply', function (req, res, next) {
//     controller.candidate.viewCandidate(req.body)
//         .then((candidate) => {
//             if (candidate.allotment.applied) {
//                 req.session.candidate = null;
//                 res.render('pages/allotment/success',
//                     {
//                         title: `Allotment Application | ${app_name}`,
//                         page_head: 'Allotment',
//                         page_nav_name: 'Allotment',
//                         allotment_page: true,
//                         success_message: 'You have already applied for allotment',
//                         candidate
//                     });
//             } else {
//                 req.session.candidate = candidate;
//                 // console.log(req.session.candidate);
//                 res.render('pages/allotment/application',
//                     {
//                         title: `Allotment Application | ${app_name}`,
//                         page_head: 'Allotment',
//                         page_nav_name: 'Allotment',
//                         allotment_page: true,
//                         candidate
//                     });
//             }
//         })
//         .catch((error) => {
//             req.flash('message', error);
//             res.redirect('/allotment/apply');
//         })
// });

// router.get('/allotment/application/complete/', function (req, res, next) {
//     let candidate = req.session.candidate;
//     let message = req.flash('message');
//     if (candidate) {
//         res.render('pages/allotment/application',
//             {
//                 title: `Allotment Application | ${app_name}`,
//                 page_head: 'Allotment',
//                 page_nav_name: 'Allotment',
//                 allotment_page: true,
//                 candidate,
//                 message
//             });
//     } else {
//         req.session.candidate = null;
//         req.flash('message', 'Please fill the application form');
//         res.redirect('/allotment/apply');
//     }
// });

// router.post('/allotment/application/submit/', function (req, res, next) {
//     let candidate = req.session.candidate;
//     if (candidate) {
//         controller.allotment.apply(candidate.id, req.body)
//             .then((candidate) => {
//                 req.session.candidate = null;
//                 res.render('pages/allotment/success',
//                     {
//                         title: `Allotment Application | ${app_name}`,
//                         page_head: 'Allotment',
//                         page_nav_name: 'Allotment',
//                         allotment_page: true,
//                         success_message: 'Your application has been submitted successfully',
//                         candidate,
//                     });
//             })
//             .catch((error) => {
//                 req.flash('message', error);
//                 res.redirect('/allotment/application/complete/');
//             })
//     } else {
//         res.redirect('/allotment/application/complete/');
//     }
// });

// router.get('/allotment/recruiters', function (req, res, next) {
//     res.render('pages/allotment/recruiters',
//         {
//             title: `Allotment | ${app_name}`,
//             page_head: 'Allotment',
//             page_nav_name: 'Allotment',
//             allotment_page: true
//         });
// });

//recruiters
router.get('/recruiters', function (req, res, next) {
    res.render('pages/recruiters',
        {
            title: `Recruiters | ${app_name}`,
            page_head: 'Recruiters',
            page_nav_name: 'Recruiters',
            recruiters_page: true,
            breadcrumbs: true
        });
});

router.get('/recruiters/:id', function (req, res, next) {
    controller.recruiter.view(req.params.id)
        .then((recruiter) => {
            res.render('pages/recruiters/recruiter',
                {
                    title: `Recruiters | ${app_name}`,
                    page_head: 'Recruiters',
                    page_nav_name: 'Recruiters',
                    recruiters_page: true,
                    breadcrumbs: true,
                    no_preloader: true,
                    recruiter
                });
        })
        .catch((error) => {
            res.redirect('/recruiters');
        })
});

router.get('/recruiters/pool/:pool', function (req, res, next) {
    controller.recruiter.getPool(req.params.pool)
        .then((pool) => {
            res.render('pages/recruiters/pool',
                {
                    title: `Recruiters | ${app_name}`,
                    page_head: 'Recruiters',
                    page_nav_name: 'Recruiters',
                    recruiters_page: true,
                    breadcrumbs: true,
                    pool_name: req.params.pool,
                    no_preloader: true,
                    pool
                });
        })
});

module.exports = router;