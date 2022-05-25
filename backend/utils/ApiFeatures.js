class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"   //case insensitive
            }
        } : {}
        this.query = this.query.find({...keyword})
        return this
    }
    filter(){
        const queryStrCopy = {...this.queryStr} //object in JS are passed by reference i.e change are reflected
        // therefore we are using spread operator to make its copy

        const removeFields = ["keyword", "page", "limit"]//we remove these fields from the queryStrCopy
        
        removeFields.forEach((key) => delete queryStrCopy[key]);
        
        // filter for price and rating
        let queryStr = JSON.stringify(queryStrCopy)//converting to string
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)
        // in above line we found all the occurances of(gt, gte, lt, lte) and replaced 
        // them with $gt, $gte, $lt, $lte to match the mongoDB syntax as we get these without $ in uri

        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)
        return this
    }
}

module.exports = ApiFeatures