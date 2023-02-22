var baseUrl = serverEnvironment == 'production' ? `https://pouch.eastus.cloudapp.azure.com/internal/production/api/` : `https://pouch.eastus.cloudapp.azure.com/internal/${serverEnvironment}/api/`

async function getFromServer(pUrl) {

    var result = await $.ajax({
        url: baseUrl + pUrl,
        type: "GET",
        dataType: 'html',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("token", "lwo09tpDykEXLs1aL2UeYgKfC3Tmz4P3s4oEndo9");
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
