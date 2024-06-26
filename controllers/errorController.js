// Express automatically knows that this entire function is an error handling middleware by specifying 4 parameters
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    console.log("Error: ", err.statusCode, err.message);
    err.status = err.status || "error"
    console.log("Stack: ", err.stack);
    if(err.code===11000){
        Object.keys(err.keyValue).forEach(key=>{
            err.message = `Duplicate value for the field : [${key}] Please use another value!`;
        })
        err.statusCode = 409;
    }
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: "You Do not Forget to remove this in production at any cost  __!!_!_!!__            "+err.stack
    });

};
