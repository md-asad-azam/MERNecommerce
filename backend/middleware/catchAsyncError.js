// Async errors:-- the error that is present in request body... 
// suppose if the name is not sent in the request but it is required in our Schema
// then the server will get destroyed due to this error.... so we need to handle it

module.exports = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next)
}

/* 

.catch(callback){
    const e = new Error("the error we got in catch")
    callback(e)
} 


here, in our case the callback func. is "next" and it will be called inside of the 
catch as descried in above example i.e. catch func.
*/