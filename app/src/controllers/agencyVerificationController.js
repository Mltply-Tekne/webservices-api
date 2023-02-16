const fs = require("fs");

renderAgencyVerification = async function (request, response) {

    let mPath = request.url;
    mPath = hasSpecialChar(mPath);

    

    if (request.params.mode == 'approve') {

        let html = fs.readFileSync(`${process.env.srcPath}/resources/pouchSM/views/agencies-to-approve.html`, 'utf-8');
        html = html.replaceAll('{server-environment}', process.env.environment)
        response.send(html);

    } else if (request.params.mode == 'verify') {

        let html = fs.readFileSync(`${process.env.srcPath}/resources/pouchSM/views/agencies-to-verify.html`, 'utf-8');
        html = html.replaceAll('{server-environment}', process.env.environment)
        response.send(html);

    } else if (request.params.mode == 'processed') {

        let html = fs.readFileSync(`${process.env.srcPath}/resources/pouchSM/views/agencies-processed.html`, 'utf-8');
        html = html.replaceAll('{server-environment}', process.env.environment)
        response.send(html);

    } else if (request.params.mode == 'login') {

        let html = fs.readFileSync(`${process.env.srcPath}/resources/pouchSM/views/login.html`, 'utf-8');
        html = html.replaceAll('{server-environment}', process.env.environment)
        response.send(html);

    } else if (request.params.mode == 'devRegister') {

        let html = fs.readFileSync(`${process.env.srcPath}/resources/pouchSM/views/register.html`, 'utf-8');
        html = html.replaceAll('{server-environment}', process.env.environment)
        response.send(html);

    } else {

        response.json('Not found!')
        
    }
        

}

function hasSpecialChar(string) {
    return string.replace(/[^A-Za-z0-9/.:]]/g, "");
}

module.exports = {
    renderAgencyVerification
}