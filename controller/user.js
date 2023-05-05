const db = require('../database/connection');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const collections = require('../database/collections.json');

const contact = {
    message: (data) => {
        return new Promise(async (resolve, reject) => {
            delete data[''];
            data._id = new ObjectId();
            data.date = new Date();
            db.get()
                .collection(collections.MESSAGE)
                .insertOne(data)
                .then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
                })
        })
    },
}

const candidate = {

    viewCandidate: (data) => {
        return new Promise(async (resolve, reject) => {

            // let data.lpk_id = data.data.lpk_id;
            if (data.lpk_id.startsWith(" ")) {
                data.lpk_id = data.lpk_id.substring(1);
            }
            if (data.lpk_id.endsWith(" ")) {
                data.lpk_id = data.lpk_id.substring(0, 8);
            }

            if (String(data.lpk_id.length) == 8 && data.lpk_id.includes("LPK1")) {
                db.get()
                    .collection(collections.CANDIDATES)
                    .findOne({
                        "id": data.lpk_id
                    })
                    .then((response) => {
                        // console.log(response)
                        if (response) {
                            if (data.email.startsWith(" ")) {
                                data.email = data.email.substring(1);
                            }
                            if (data.email.endsWith(" ")) {
                                data.email = data.email.substring(0, 8);
                            }
                            if (response.email == data.email) {
                                resolve(response)
                            } else if (response.other_email.original == data.email) {
                                resolve(response)
                            } else if (response.other_email.corrected == data.email) {
                                resolve(response)
                            } else if (response.other_email.hackerearth == data.email) {
                                resolve(response)
                            } else {
                                reject("Please enter the correct email address.")
                            }
                        } else {
                            reject("We regret to inform you that we are unable to proceed with your application to the next round. We wish you all the best for your future endeavors.")
                        }
                    }).catch((error) => {
                        reject(error)
                    })
            } else {
                reject("Please enter a valid Launchpad Kerala ID.")
            }
        })
    },

    view: (id) => {
        return new Promise(async (resolve, reject) => {

            db.get()
                .collection(collections.CANDIDATES)
                .findOne({
                    "id": id
                })
                .then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject("Something Went wrong please try again later.")
                })
        })
    }

}

const allotment = {
    apply: (id, data) => {
        return new Promise(async (resolve, reject) => {
            let preference = [];
            let options = ['A', 'B', 'C', 'D'];
            for (i = 0; i < 4; i++) {
                let option = data[`preference_${i + 1}`];
                if (options.indexOf(option) != -1 && preference.indexOf(option) == -1 && option != undefined && option != null && option != "") {
                    preference.push(option);
                } else {
                    reject("Please select preferences correctly.")
                }
            }
            let allotment = {
                applied: true,
                preference: preference
            }
            db.get()
                .collection(collections.CANDIDATES)
                .update(
                    { id: id },
                    {
                        $set:
                        {
                            "allotment": allotment
                        }
                    }
                )
                .then((response) => {
                    candidate.view(id).then((candidate) => {
                        resolve(candidate)
                    }).catch((error) => {
                        reject("Something Went wrong please try again later.")
                    })
                }).catch((error) => {
                    reject(error)
                })

        })
    }
}

const recruiter = {
    view: (id) => {
        return new Promise(async (resolve, reject) => {

            db.get()
                .collection(collections.RECRUITERS)
                .findOne({
                    "id": id
                })
                .then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject("Something Went wrong please try again later.")
                })
        })
    },
    getPool: (pool) => {
        return new Promise(async (resolve, reject) => {

            db.get()
                .collection(collections.RECRUITERS)
                .find({
                    "pool": pool.toUpperCase()
                })
                .toArray()
                .then((response) => {
                    // console.log(response)
                    resolve(response)
                }).catch((error) => {
                    reject("Something Went wrong please try again later.")
                })
        })
    }
}

module.exports = {
    contact,
    candidate,
    allotment,
    recruiter
}