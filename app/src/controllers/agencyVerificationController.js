const fs = require("fs");

renderAgencyVerification = async function (request, response) {

    let mPath = request.url;
    mPath = hasSpecialChar(mPath);

    

    if (request.params.mode == 'approve') {

        let html = fs.readFileSync(`${process.env.srcPath}/resources/pouchSM/views/agencies-to-approve.html`, 'utf-8');
        html = html.replaceAll('{server-environment}', process.env.environment)
        response.send(html);

    } else if (request.params.mode == 'verify') {

        response.sendFile(`${process.env.srcPath}/resources/pouchSM/views/agencies-to-verify.html`);

        let html = fs.readFileSync(`${process.env.srcPath}/resources/pouchSM/views/agencies-to-verify.html`, 'utf-8');
        html = html.replaceAll('{server-environment}', process.env.environment)
        response.send(html);

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