const user = {
    user: {
        fname: '',
        sname: '',
        email: '',
        phone: null,
        password: null,
        role: 'user',
        status: 'active',
        profile: {
            image: '/assets/images/user/user.png',
            primary_address: {}
        },
        permissions: {
            restricted: true,
            self: {
                all: true,
            }
        },
        events: {
            joined: '',
            general: []
        },
        flags: {
            profile_completion: false
        }
    },

    recruiter: {
        id: '',
        pool: '',
        interviews: [],
        fname: '',
        sname: '',
        email: '',
        phone: null,
        password: null,
        role: 'recruiter',
        status: 'active',
        profile: {
            image: '/assets/images/user/user.png',
            primary_address: {}
        },
        permissions: {
            restricted: false,
            admin: true,
            recuruiter: true,
            self: {
                all: true,
            },
            interviews: {
                view: true,
                update: true,
                edit: true,
            },
        },
        events: {
            joined: '',
            general: []
        },
        flags: {
            profile_completed: false,
        }
    },

    reg_volunteer: {
        fname: '',
        sname: '',
        email: '',
        phone: null,
        password: null,
        role: 'registration_volunteer',
        status: 'active',
        profile: {
            image: '/assets/images/user/user.png',
            primary_address: {}
        },
        permissions: {
            restricted: false,
            admin: true,
            volunteer: true,
            self: {
                all: true,
            },
            registrations: {
                view: true,
                add: true,
                edit: true,
                update: true,
            },
        },
        events: {
            joined: '',
            general: []
        },
        flags: {
            profile_completed: false,
        }
    },

    admin: {
        fname: '',
        sname: '',
        email: '',
        phone: null,
        password: null,
        role: 'admin',
        status: 'active',
        profile: {
            image: '/assets/images/user/user.png',
            primary_address: {}
        },
        permissions: {
            restricted: false,
            admin: true,
            all: false,
            self: {
                all: false,
                view: true,
                edit: true,
                update: true,
            },
            messages: {
                all: false,
                view: true,
            },
            users: {
                all: false,
                view: true,
                edit: true,
                update: true,
            },
            candidates: {
                all: false,
                view: true,
                edit: true,
                update: true,
            },
            recuruiters: {
                all: false,
                view: true,
                add: true,
                edit: true,
                update: true,
            },
            interviews: {
                all: false,
                view: true,
                add: true,
                edit: true,
                update: true,
            },
            registrations: {
                all: false,
                view: true,
                add: true,
                edit: true,
                update: true,
            },
        },
        events: {
            joined: '',
            general: []
        },
        flags: {
            profile_completed: false,
        }
    },

    super_admin: {
        fname: '',
        sname: '',
        email: '',
        phone: null,
        password: null,
        role: 'super_admin',
        status: 'active',
        profile: {
            image: '/assets/images/user/user.png',
            primary_address: {}
        },
        permissions: {
            restricted: false,
            admin: true,
            all: true,
            self: {
                all: true,
            },
            messages: {
                all: true,
            },
            users: {
                all: true,
            },
            candidates: {
                all: true,
            },
            recuruiters: {
                all: true,
            },
            interviews: {
                all: true,
            },
            registrations: {
                all: true,
            },
            admins: {
                all: true,
            },
        },
        events: {
            joined: '',
            general: []
        },
        flags: {
            profile_completed: false,
        }
    },
};

// const registrations = {
//     registration: {
//         _id : '',
//         id: '',
//         name: '',
//         time: '',
//         date: '',
//         pool: '',
//         location: '',
//         description: '',
//     }
// }

module.exports.models = {
    user
};