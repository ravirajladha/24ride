const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            console.error("❌ Error in asyncHandler:", error); // Optional Logging
            next(error); // Pass error to the global error handler
        }
    };
};

export { asyncHandler };
