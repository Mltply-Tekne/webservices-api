const fs = require("fs");

sendPathFile = async function (request, response) {

    let mPath = request.url;
    mPath = hasSpecialChar(mPath);


    fs.stat(`${process.env.srcPath}/resources/${mPath}`, (error, stats) => {
        if (error || !stats.isFile()) {
            // File or directory does not exist, or there was an issue accessing it
            // let html = fs.readFileSync(`${process.env.srcPath}/resources/errors/404/404.html`, 'utf-8');
            // html = html.replace('{error-message}', "We couldn't find your resource.")
            response.status(404);
            response.json('Not found!')
            // response.send(html);
            
        } else {
            // Serve the file to the client
            response.sendFile(`${process.env.srcPath}/resources/${mPath}`);
        }
    });

}

function hasSpecialChar(string) {
    return string.replace(/[^A-Za-z0-9/.:]]/g, "");
}

module.exports = {
    sendPathFile
}