var approvalButton = document.getElementById("btn-submit");
var policiesToBeCanceledOrPaused;

window.addEventListener("load", async function (event) {

    // Obtaining data
    apiData = await getFromServer('cancellations')
    apiData = apiData.response
    policiesToBeCanceledOrPaused = apiData

    console.log(apiData)

    await poblateTables()
});

// If the status to check represent the review process or the status process
selectedFieldsAndNames = {

    'invoicenumber': 'Invoice Number',
    'policynumber': 'Policy Number',
    'errortext': 'Error Text',
    'cancelstatus': 'Cancel Status',
    'pause': 'Pause'
}

nonEditableFields = ['pause', 'reviewStatus']

async function poblateTables() {

    let table = document.getElementById('main-table')
    table.innerHTML = ''

    let thead = document.createElement('thead')
    table.append(thead)

    let tr = document.createElement('tr')
    thead.append(tr)
    
    
    

    // Iterating fields
    for (field of Object.values(selectedFieldsAndNames)) {
        
        let th = document.createElement('th')
        th.setAttribute('scope', 'col')

        if (field == 'Pause') {

            th.setAttribute('style', 'text-align: center;')
            th.innerHTML = field

        } else {

            th.innerHTML = field

        }

        tr.append(th)

    }

    let tbody = document.createElement('tbody')
    table.append(tbody)

    // Iterating contents
    for (policy of policiesToBeCanceledOrPaused) {

        let tr = document.createElement('tr')
        tr.setAttribute('invoicenumber', policy['invoicenumber'])

        tbody.append(tr)

        for (key of Object.keys(selectedFieldsAndNames)) {

            // If the key corresponds to the status, then we should make the checkbox
            if (key == 'errortext') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 380px; width: 400px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                td.setAttribute('id', `td_${key}_${policy['invoicenumber']}`)
                tr.append(td)
                
                td.innerHTML = policy[key]

            } else if (key == 'pause') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 120px; width: 30px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;')
                tr.append(td)

                let button = document.createElement('button')
                button.setAttribute('type', 'checkbox')
                button.setAttribute('class', 'approvalRequired')
                button.setAttribute('name', 'approvalRequired')
                button.setAttribute('id', `checkbox_agency_${policy['invoicenumber']}`)

                button.innerHTML = policy.cancelstatus == 'scheduled' ? '<i class="fa fa-pause"></i>' : '<i class="fa fa-play"></i>'
                button.setAttribute('onclick', `changeCancelStatus('${policy['invoicenumber']}')`)
                td.append(button)

            } else if (key == 'cancelstatus') {
                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 120px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                tr.append(td)
                
                td.innerHTML = policy[key].toUpperCase()

            } else {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 120px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                td.setAttribute('id', `td_${key}_${policy['invoicenumber']}`)
                tr.append(td)
                
                td.innerHTML = policy[key]

            }
    
        }

    }

    mainBox = document.getElementById('main-table_box')
    mainBox.classList.remove('hidden')


}


// pauseAllPolicies.addEventListener('click', async function() {

//     let checkedInputs = document.querySelectorAll('input[type=checkbox]:checked')
//     approvalButton.classList.add('btn-disabled')
//     approvalButton.setAttribute('disabled', '')

//     agentsArr = []

//     checkedInputs.forEach((input) => {

//         let agent = pendingToReviewAgents.find(agent => agent['submissionId'] == input.getAttribute('submissionId'))
//         agent['newStatus'] = stateToCheck + 1
//         agentsArr.push(agent)
        
//     });

//     bodyObj = {
//         reviewedAgents: agentsArr
//     }

//     if (stateToCheck == 1) {
//         postToAPI('', bodyObj)
//     }

//     await postToServer('updateAgentsToManage', bodyObj)
//     location.reload()


// })

// resumeAllPolicies.addEventListener('click', async function() {

// })