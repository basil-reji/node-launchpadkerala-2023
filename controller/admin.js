const db = require('../database/connection');
const { models } = require('../database/models');
const collections = require('../database/collections.json');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const account = {

    update: (id, data) => {
        let user = {};
        user.fname = data.fname;
        user.sname = data.sname;
        if (data.phone.length > 5) {
            user.phone = data.phone;
        }
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.USER)
                .updateOne(
                    {
                        '_id': ObjectId(id)
                    },
                    {
                        $set: user,
                    }
                )
                .then((response) => {
                    // console.log(response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        })
    },

    updatePassword: (id, data) => {

    }
}

const admins = {

    getAll: () => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.USER)
                .find(
                    {
                        'role': {
                            '$in': ['admin', 'super_admin', 'recruiter', 'registration_volunteer']
                        }
                    },
                    {
                        projection: {
                            password: 0,
                            permission: 0,
                            events: 0,
                            flags: 0
                        }
                    }
                )
                .toArray()
                .then((response) => {
                    // console.log(response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        })
    },

    get: (id) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.USER)
                .findOne(
                    {
                        '_id': ObjectId(id)
                    },
                    {
                        projection: {
                            password: 0,
                            permission: 0,
                            events: 0,
                            flags: 0
                        }
                    }
                )
                .then((response) => {
                    // console.log(response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        })
    },

    add: (inf) => {
        // console.log(inf)
        return new Promise(async (resolve, reject) => {
            let user = models.user.user;
            if (inf.role == 'super_admin') {
                user = models.user.super_admin;
            } else if (inf.role == 'admin') {
                user = models.user.admin;
            } else if (inf.role == 'recruiter') {
                user = models.user.recruiter;
                user.id = inf.cid;
                user.pool = inf.pool;
            } else if (info.role == 'registration_volunteer') {
                user = models.user.reg_volunteer;
            } else {
                user = models.user.user;
            }
            user._id = new ObjectId();
            user.fname = inf.fname;
            user.sname = inf.sname;
            user.email = inf.email;
            user.password = await bcrypt.hash(inf.password, 10);
            user.events.joined = new Date();
            db.get()
                .collection(collections.USER)
                .insertOne(user)
                .then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
                })
        })
    },

    update: (id, data) => {
        let user = {};
        if (data.role == 'admin') {
            let model = models.user.admin;
            user.permissions = model.permissions;
            user.fname = data.fname;
            user.sname = data.sname;
            user.role = model.role;
            user.status = data.status;
        } else if (data.role == 'super_admin') {
            let model = models.user.super_admin;
            user.permissions = model.permissions;
            user.fname = data.fname;
            user.sname = data.sname;
            user.role = model.role;
            user.status = data.status;
        } else if (data.role == 'recruiter') {
            let model = models.user.recruiter;
            user.id = data.cid;
            user.pool = data.pool;
            user.permissions = model.permissions;
            user.fname = data.fname;
            user.sname = data.sname;
            user.role = model.role;
            user.status = data.status;
        } else if (data.role == 'registration_volunteer') {
            let model = models.user.reg_volunteer;
            user.permissions = model.permissions;
            user.fname = data.fname;
            user.sname = data.sname;
            user.role = model.role;
            user.status = data.status;
        } else {
            user = {}
        }
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.USER)
                .updateOne(
                    {
                        '_id': ObjectId(id)
                    },
                    {
                        $set: user,
                    }
                )
                .then((response) => {
                    // console.log(response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        })
    },

    remove: (id) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.USER)
                .remove(
                    {
                        _id: ObjectId(id)
                    }
                )
                .then((response) => {
                    // console.log(response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        })
    },
}

const message = {

    getAll: () => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.MESSAGE)
                .find()
                .toArray()
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        })
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.MESSAGE)
                .remove(
                    {
                        _id: ObjectId(id)
                    }
                )
                .then((response) => {
                    // console.log(response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        })
    },

}

const candidates = {

    getAll: () => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.CANDIDATES)
                .find()
                .toArray()
                .then((response) => {
                    // console.log(response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        })
    },

    search: (text) => {
        return new Promise((resolve, reject) => {
            // console.log(text)
            try {
                db.get()
                    .collection(collections.CANDIDATES)
                    .createIndex({ name: "text", id: "text", email: "text" })
                    .then((response) => {
                        db.get()
                            .collection(collections.CANDIDATES)
                            .find(
                                { $text: { $search: text } }
                            )
                            .toArray()
                            .then((response) => {
                                // console.log(response)
                                resolve(response);
                            }).catch((error) => {
                                reject(error);
                            })
                    }).catch((error) => {
                        reject(error);
                    })
            } catch {
                reject("Tiemout");
            }
        })
    },

    get: (id) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.CANDIDATES)
                .findOne(
                    {
                        'id': id
                    },
                    {
                        projection: {
                            _id: 0
                        }
                    }
                )
                .then((response) => {
                    // console.log(response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        })
    },

    update: (id, data) => {
        return new Promise((resolve, reject) => {
            // console.log(data)
            db.get()
                .collection(collections.CANDIDATES)
                .findOne(
                    {
                        'id': id
                    },
                    {
                        projection: {
                            _id: 0
                        }
                    }
                )
                .then((candidate) => {
                    candidate.other_id.kkem = data.kkem_id;
                    candidate.other_id.aadhar = data.aadhar_id;
                    candidate.name = data.name;
                    candidate.email = data.email;
                    candidate.phone = data.phone;
                    candidate.college = data.college;
                    candidate.degree = data.degree;
                    candidate.year_of_graduation = data.year_of_graduation;
                    candidate.accademic.cgpa = data.cgpa;
                    candidate.accademic.total_backlogs = data.total_backlogs;
                    candidate.accademic.active_backlogs = data.active_backlogs;

                    if (data.allotted == "1") {
                        candidate.allotment.allotted = true;
                        candidate.allotment.pool = data.pool;
                        if (data.pool == "A" || data.pool == "B") {
                            candidate.allotment.location = "Technopark, Trivandrum";
                            candidate.allotment.date = "08-05-2023";
                            if (data.time) {
                                candidate.allotment.time = data.time;
                            } else {
                                candidate.allotment.time = "09:00 AM";
                            }
                        } else if (data.pool == "C" || data.pool == "D") {
                            candidate.allotment.location = "Infopark, Kochi";
                            candidate.allotment.date = "13-05-2023";
                            if (data.r_time) {
                                candidate.allotment.time = data.r_time;
                            } else {
                                candidate.allotment.time = "09:00 AM";
                            }
                        } else if (data.pool == "W") {
                            candidate.allotment.waitlisted = true;
                            candidate.allotment.allotted = false;
                        } else {
                            candidate.allotment.allotted = false;
                        }
                        if (candidate.allotment.time) {
                            candidate.allotment.waitlisted = true;
                        } else {
                            candidate.allotment.allotted = false;
                            if (candidate.allotment.pool == "W") {
                                candidate.allotment.waitlisted = true;
                            } else {
                                candidate.allotment.waitlisted = false;
                            }
                        }
                    } else {
                        candidate.allotment.allotted = false;
                        if (candidate.applied) {
                            candidate.allotment.waitlisted = true;
                        } else {
                            candidate.allotment.waitlisted = false;
                        }
                    }

                    db.get()
                        .collection(collections.CANDIDATES)
                        .updateOne(
                            {
                                'id': id
                            },
                            {
                                $set: candidate,
                            }
                        )
                        .then((response) => {
                            // console.log(response)
                            resolve(response);
                        }
                        ).catch((error) => {
                            reject(error);
                        })
                })
        })
    },

    partialUpdate: (id, data) => {
        return new Promise((resolve, reject) => {
            // console.log(data)
            db.get()
                .collection(collections.CANDIDATES)
                .findOne(
                    {
                        'id': id
                    },
                    {
                        projection: {
                            _id: 0
                        }
                    }
                )
                .then((candidate) => {
                    candidate.other_id.kkem = data.kkem_id;
                    candidate.other_id.aadhar = data.aadhar_id;
                    candidate.name = data.name;
                    candidate.email = data.email;
                    candidate.phone = data.phone;
                    candidate.college = data.college;
                    candidate.degree = data.degree;
                    candidate.year_of_graduation = data.year_of_graduation;
                    candidate.accademic.cgpa = data.cgpa;
                    candidate.accademic.total_backlogs = data.total_backlogs;
                    candidate.accademic.active_backlogs = data.active_backlogs;

                    db.get()
                        .collection(collections.CANDIDATES)
                        .updateOne(
                            {
                                'id': id
                            },
                            {
                                $set: candidate,
                            }
                        )
                        .then((response) => {
                            // console.log(response)
                            resolve(response);
                        }
                        ).catch((error) => {
                            reject(error);
                        })
                })
        })
    }

}

const registrations = {

    get: (id) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.REGISTRATIONS)
                .findOne(
                    {
                        'id': id
                    },
                    {
                        projection: {
                            _id: 0
                        }
                    }
                )
                .then((response) => {
                    // console.log(response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        })
    },

    getCount: () => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.REGISTRATIONS)
                .find()
                .toArray()
                .then((registrations) => {
                    let count = {
                        total: registrations.length,
                        A: 0,
                        B: 0,
                        C: 0,
                        D: 0,
                        kochi: 0,
                        trivandrum: 0,
                    }

                    registrations.forEach((registration) => {
                        count[registration.pool] += 1;
                        if (registration.location == 'Kochi') {
                            count.kochi += 1;
                        } else if (registration.location == 'Trivandrum') {
                            count.trivandrum += 1;
                        }
                    })

                    resolve(count);

                }).catch((error) => {
                    reject(error);
                })
        })
    },

    add: (id, data, admin) => {
        return new Promise((resolve, reject) => {
            // console.log(data)
            // console.log(id)
            // console.log(id.length)
            db.get()
                .collection(collections.CANDIDATES)
                .findOne(
                    {
                        'id': id
                    },
                    {
                        projection: {
                            _id: 0
                        }
                    }
                )
                .then((candidate) => {
                    let location = '';
                    if (data.pool == 'A' || data.pool == 'B') {
                        location = 'Trivandrum';
                    } else if (data.pool == 'C' || data.pool == 'D') {
                        location = 'Kochi';
                    } else {
                        location = '';
                        reject('Invalid Pool');
                    }

                    let registration = {
                        _id: new ObjectId(),
                        id: id,
                        name: candidate.name,
                        time: new Date(),
                        pool: data.pool,
                        location: location,
                        remarks: data.remarks,
                        registered_by: {
                            id: admin._id,
                            name: admin.fname + ' ' + admin.sname,
                        },
                    }
                    // console.log(registration);

                    db.get()
                        .collection(collections.REGISTRATIONS)
                        .insertOne(registration)
                        .then((response) => {
                            // console.log(response)
                            db.get()
                                .collection(collections.REGISTRATIONS)
                                .findOne(
                                    {
                                        '_id': registration._id
                                    },
                                    {
                                        projection: {
                                            _id: 0
                                        }
                                    }
                                )
                                .then((candidate) => {
                                    resolve(candidate);
                                }).catch((error) => {
                                    reject(error);
                                })
                        }).catch((error) => {
                            reject(error);
                        })
                })
                .catch((error) => {
                    reject("Something went wrong!");
                })
        })
    },

    search: (text) => {
        return new Promise((resolve, reject) => {
            // console.log(text)
            try {
                db.get()
                    .collection(collections.REGISTRATIONS)
                    .createIndex({ name: "text", id: "text", email: "text" })
                    .then((response) => {
                        db.get()
                            .collection(collections.REGISTRATIONS)
                            .find(
                                { $text: { $search: text } }
                            )
                            .toArray()
                            .then((response) => {
                                // console.log(response)
                                resolve(response);
                            }).catch((error) => {
                                reject(error);
                            })
                    }).catch((error) => {
                        reject(error);
                    })
            } catch {
                reject("Tiemout");
            }
        })
    },
}

const interviews = {
    add: (info) => {
        return new Promise((resolve, reject) => {
            // console.log(info)

            db.get()
                .collection(collections.INTERVIEWS)
                .findOne(
                    {
                        'id': info.id
                    },
                )
                .then((candidate) => {
                    // console.log(info)
                    if (candidate) {
                        candidate.pools.includes(info.pool)
                        reject("Candidate already exists and is registered for the same pool");
                    } else {
                        let data = {
                            _id: new ObjectId(),
                            id: info.id,
                            name: info.name,
                            pools: [info.pool],
                            recruiters: [],
                            interviews: {},
                        }

                        db.get()
                            .collection(collections.INTERVIEWS)
                            .insertOne(data)
                            .then((response) => {
                                resolve(response);
                            }).catch((error) => {
                                reject("Something went wrong!");
                            })
                    }
                }).catch((error) => {
                    reject(error);
                })
        })
    },

    search: (text, recruiter) => {
        return new Promise((resolve, reject) => {
            // console.log(text)
            try {
                db.get()
                    .collection(collections.INTERVIEWS)
                    .createIndex({ name: "text", id: "text", email: "text" })
                    .then((response) => {
                        db.get()
                            .collection(collections.INTERVIEWS)
                            .find(
                                {
                                    $text: { $search: text },
                                    pools: { $in: [recruiter.pool] }
                                }
                            )
                            .toArray()
                            .then((candidates) => {
                                // console.log(response)
                                resolve(candidates);
                            }).catch((error) => {
                                reject(error);
                            })
                    }).catch((error) => {
                        reject(error);
                    })
            } catch {
                reject("Tiemout");
            }
        })
    },

    get: (id) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.CANDIDATES)
                .findOne(
                    {
                        'id': id
                    },
                )
                .then((response) => {
                    // console.log(response)
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
        })
    },

    addFeedback: (id, data, user) => {
        // console.log(id)
        // console.log(data)
        // console.log(user)

        return new Promise((resolve, reject) => {
            db.get()
                .collection(collections.INTERVIEWS)
                .findOne(
                    {
                        'id': id
                    },
                )
                .then((candidate) => {
                    candidate.recruiters.push(user.id);
                    candidate.interviews[user.id] = {
                        feedback: data.feedback,
                        time: new Date(),
                    }

                    // console.log(candidate);

                    db.get()
                        .collection(collections.INTERVIEWS)
                        .updateOne(
                            {
                                'id': id
                            },
                            {
                                $set: candidate,
                            }
                        )
                        .then((response) => {
                            // console.log(response)
                            resolve(candidate);
                        }
                        ).catch((error) => {
                            reject(error);
                        })
                })
                .catch((error) => {
                    reject("Something went wrong!");
                }
                )
        })
    }   
}

module.exports = {
        account,
        admins,
        message,
        candidates,
        registrations,
        interviews
    }