var baseUrl = 'https://pouch.eastus.cloudapp.azure.com/dev/api/v1/agent/'

async function getFromServer(pUrl, pStatus) {

    var result = await $.ajax({
        url: baseUrl + pUrl + `?reviewStatus=${pStatus}`,
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