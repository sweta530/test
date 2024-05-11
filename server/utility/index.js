
const successResponse = (res, data, message = "", status) => {
    res.send({
        success: "API called successfully",
        status: status,
        message: message,
        data: data
    })
}

const errorResponse = (res, error, message = "", status) => {
    res.send({
        success: "API call having Error",
        status: status,
        message: message,
        error: error
    })
}

const catchResponse = (res, responseError, message, status) => {
    res.status(500).send(errorResponse(res, responseError, message, status))
}

const getFileExtension = (fileName) => {
    let items = fileName.split(/\.(?=[^.]+$)/)
    if (items.length === 2) {
        return items[1]
    }
    return ''
}

module.exports = {
    successResponse,
    errorResponse,
    catchResponse,
    getFileExtension
}