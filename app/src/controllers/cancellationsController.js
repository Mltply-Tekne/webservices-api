const fs = require("fs");

renderPoliciesCancellations = async function (request, response) {

    let html = fs.readFileSync(`${process.env.srcPath}/resources/cancellationManager/views/cancellations.html`, 'utf-8');
    html = html.replaceAll('{server-environment}', process.env.environment)
    response.send(html);
}

module.exports = {
    renderPoliciesCancellations
}