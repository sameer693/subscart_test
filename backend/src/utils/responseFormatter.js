module.exports = {
    successResponse: (res, data, message = 'Request was successful') => {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    },

    errorResponse: (res, error, message = 'An error occurred') => {
        return res.status(500).json({
            success: false,
            message,
            error: error.message || error
        });
    },

    notFoundResponse: (res, message = 'Resource not found') => {
        return res.status(404).json({
            success: false,
            message
        });
    },

    validationErrorResponse: (res, errors) => {
        return res.status(400).json({
            success: false,
            message: 'Validation errors occurred',
            errors
        });
    }
};