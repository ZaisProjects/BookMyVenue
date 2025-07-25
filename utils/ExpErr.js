class ExpErr extends Error{
    constructor(status, message){
        super(message);
        this.status = status;
        this.message = message;
    }
}
module.exports = ExpErr;