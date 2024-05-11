const Users = require('../model/users.model')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const { successResponse, errorResponse, catchResponse, getFileExtension } = require('../utility')

exports.add = async function (req, res) {
    try {
        let image_name = ''
        if (req.files != null) {
            let image = req.files.profile_picture
            image_name = req.files.profile_picture.name
            let file_extension = getFileExtension(image_name)
            image_name = `${uuidv4()}.${file_extension}`

            await image.mv(`public/images/user_image/${image_name}`);
        }

        let data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            user_name: req.body.user_name,
            contact_info: req.body.contact_info,
            profile_picture: image_name,
            user_role: req.body.user_role
        };

        const user = new Users(data)
        const resData = await user.save(data)
        return successResponse(res, resData, 'Users added successfully', 200)

    } catch (err) {
        return catchResponse(res, err.message, 'Something went wrong', 500)
    }
}

exports.get = async function (req, res) {
    try {
        let id = req.params.id
        let users = await Users.find({ "_id": id })
        if (users == null) {
            return errorResponse(res, {}, 'Users does not exists', 400)
        }
        if (users[0].profile_picture) {
            let base_url = req.protocol + "://" + req.headers.host
            let image = `/images/users_image/${users[0].profile_picture}`;
            users[0].profile_picture = `${base_url}${image}`;
        }

        return successResponse(res, users, 'Users deleted successfully', 200)
    } catch (e) {
        console.log(e)
        return catchResponse(res, {}, e, 'Something went wrong', 500)
    }
}

exports.getAll = async function (req, res) {
    try {
        let user = await Users.find()
        if (user == null) {
            return errorResponse(res, {}, 'There is No Users available', 400)
        }

        if (user.length > 0) {
            for (let i = 0; i < user.length; i++) {
                if (user[i].profile_picture != '') {
                    let base_url = req.protocol + "://" + req.headers.host
                    let image = `/images/user_image/${user[i].profile_picture}`;
                    user[i].profile_picture = `${base_url}${image}`;
                }
            }
        }

        return successResponse(res, user, 'User details', 200)
    } catch (e) {
        return catchResponse(res, {}, e, 'Something went wrong', 500)
    }
}

exports.update = async function (req, res) {
    try {
        let id = req.params.id
        let user = await Users.find({ "_id": id })
        if (user == null) {
            return errorResponse(res, {}, 'Users does not exist', 400)
        }

        let image_name = user[0].profile_picture;

        if (req.files != null && req.files.profile_picture) {
            let image = req.files.profile_picture
            image_name = req.files.profile_picture.name
            let file_extension = getFileExtension(image_name)
            image_name = `${uuidv4()}.${file_extension}`

            await image.mv(`public/images/user_image/${image_name}`);

            // Delete the old image file
            const filePath = `public/images/user_image/${user[0].profile_picture}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        console.log('File does not exist.');
                    } else {
                        console.error('Error deleting file:', err);
                    }
                } else {
                    console.log('File deleted successfully');
                }
            });
        }

        let updatedData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            user_name: req.body.user_name,
            contact_info: req.body.contact_info,
            profile_picture: image_name,
            user_role: req.body.user_role
        };

        const resData = await Users.findByIdAndUpdate(
            id, updatedData
        )
        return successResponse(res, resData, 'Users Updated successfully', 200)

    } catch (err) {
        return catchResponse(res, err.message, 'Something went wrong', 500)
    }
}

exports.delete = async function (req, res) {
    try {
        let id = req.params.id
        let user = await Users.find({ "_id": id })
        if (user == null) {
            return errorResponse(res, {}, 'Users does not exists', 400)
        }
        fs.unlink(`public/images/user_image/${user[0].profile_picture}`, (err) => {
            console.log("error in remove image from file system in Update data ", err);
        });

        await Users.deleteOne({ "_id": id })

        return successResponse(res, user, 'Users deleted successfully', 200)
    } catch (e) {
        console.log(e)
        return catchResponse(res, {}, e, 'Something went wrong', 500)
    }
}

exports.login = async function (req, res) {
    try {
        let email = req.body.email
        let password = req.body.password
        console.log(email, password, 111)
        let users = await Users.findOne({ "email": email })
        console.log(users)
        if (!users) {
            return errorResponse(res, {}, 'Users does not exists', 400)
        }
        if (users.password !== password) {
            return errorResponse(res, {}, "Invalid Password", 400)
        }

        return successResponse(res, users, 'Users deleted successfully', 200)
    } catch (e) {
        return catchResponse(res, {}, e, 'Something went wrong', 500)
    }
}