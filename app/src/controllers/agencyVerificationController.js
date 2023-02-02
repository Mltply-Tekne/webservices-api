const fs = require("fs");

renderAgencyVerification = async function (request, response) {

    let mPath = request.url;
    mPath = hasSpecialChar(mPath);

    

    if (request.params.mode == 'approve') {
        response.sendFile(`${process.env.srcPath}/resources/pouchSM/views/agencies-to-approve.html`);
    } else if (request.params.mode == 'verify') {
        response.sendFile(`${process.env.srcPath}/resources/pouchSM/views/agencies-to-verify.html`);
    } else{
        response.json('Not found!')
    }
        

}

function hasSpecialChar(string) {
    return string.replace(/[^A-Za-z0-9/.:]]/g, "");
}

module.exports = {
    renderAgencyVerification
}