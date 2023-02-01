function getTimeStamp() {
    var timestamp = new Date().toISOString();
    return timestamp
}

module.exports = {getTimeStamp}