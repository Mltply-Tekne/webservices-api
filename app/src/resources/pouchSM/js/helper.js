var baseUrl = serverEnvironment == 'production' ? `https://pouch.eastus.cloudapp.azure.com/api/v1/agent/` : `https://pouch.eastus.cloudapp.azure.com/${serverEnvironment}/api/v1/agent/`


async function getFromServer(pUrl, pStatus) {

    var result = await $.ajax({
        url: baseUrl + pUrl + pStatus,
        type: "GET",
        dataType: 'html',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa('pouchagent' + ":" + 'TLEsCHAcYs'));
        }
    })

    return JSON.parse(result)

}

async function postToServer(pUrl, pBody) {

    var result = await $.ajax({
        url: baseUrl + pUrl,
        data: pBody,
        type: "POST",
        dataType: 'html',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa('pouchagent' + ":" + 'TLEsCHAcYs'));
        }
    })

    return JSON.parse(result)

}

async function postToAPI(pUrl, pBody) {

    var result = await $.ajax({
        url: `https://mltply.eastus.cloudapp.azure.com/microservices/${serverEnvironment}/automation/massiveInsert/`,
        data: pBody,
        type: "POST",
        dataType: 'html',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa('pouchagent' + ":" + 'TLEsCHAcYs'));
        }
    })

    return JSON.parse(result)

}
