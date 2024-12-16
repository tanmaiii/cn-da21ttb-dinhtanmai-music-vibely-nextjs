"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = validateData;
const zod_1 = require("zod");
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = require("../utils/ApiError");
function validateData(schema) {
    return (req, res, next) => {
        try {
            schema.parse({
                body: JSON.parse(JSON.stringify(req.body)),
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const message = error.errors
                    .map((issue) => `${issue.message}`)
                    .join(", ");
                const customErr = new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, message);
                next(customErr);
                // Kiểu error cũ
                // const errorMessages = error.errors.map((issue: any) => ({
                //   message: `${issue.path.join(".")} is ${issue.message}`,
                // }));
                // res
                //   .status(StatusCodes.BAD_REQUEST)
                //   .json({ error: "Invalid data", details: errorMessages });
            }
            else {
                throw new Error("Internal Server Error");
                // res
                //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
                //   .json({ error: "Internal Server Error" });
            }
        }
    };
}
//# sourceMappingURL=validate.middleware.js.map