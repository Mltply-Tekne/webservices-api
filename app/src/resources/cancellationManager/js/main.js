var approvalButton = document.getElementById("btn-submit");
var policiesToBeCanceledOrPaused;

window.addEventListener("load", async function (event) {

    // Obtaining data
    // apiData = await getFromServer('getAgentsToManage?reviewStatus=', stateToCheck)
    apiData = await getFromServer('cancellations/')
    apiData = apiData.response
    policiesToBeCanceledOrPaused = apiData

    console.log(apiData)

    await poblateTables()
});

let mObj = [{
    submissionId: 15,
    newStatus: 2
},
{
    submissionId: 11,
    newStatus: 2
}]

// If the status to check represent the review process or the status process
selectedFieldsAndNames = {

    // "invoicenumber": 2926,
    // "policynumber": "GACA_6YWV890000",
    // "subscriptionid": "AzZRCxTQ1Y8B89Afb",
    // "cancelstatus": "scheduled",
    // "cancelreason": "#txn_16CJxCTW5u3jCI1Qh Payment of $158.52 via card ending 0100 failed due to the reason \"This transaction has been declined\" on Feb 17, 2023 05:02",
    // "errortext": null,
    // "quoteref": null,
    // "createdon": "2023-02-17T11:50:06.031Z"

    'policynumber': 'Policy Number',
    // 'invoicenumber': 'Invoice Number',
    'cancelstatus': 'Cancel Status', 
    'errortext': 'Error Text',
    'pause': 'Pause'
}

nonEditableFields = ['pause', 'reviewStatus']

async function poblateTables() {

    let table = document.getElementById('main-table')

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
        tr.setAttribute('submissionId', policy['submissionId'])

        // tr.addEventListener('click', function () {
        //     let submissionId = this.getAttribute('submissionId')
        //     checkBox = document.getElementById(`checkbox_agency_${submissionId}`)

        //     if (checkBox.checked == false) {
        //         checkBox.checked = true
        //     } else {
        //         checkBox.checked = false
        //     }
        // })

        tbody.append(tr)

        for (key of Object.keys(selectedFieldsAndNames)) {

            

            // If the key corresponds to the status, then we should make the checkbox
            if (key == 'reviewStatus') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 120px; width: 30px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis; text-align: center;')
                tr.append(td)

                let label = document.createElement('label')
                label.setAttribute('for', 'approved-check')
                td.append(label)

                let input = document.createElement('input')
                input.setAttribute('type', 'checkbox')
                input.setAttribute('class', 'approvalRequired')
                input.setAttribute('name', 'approvalRequired')
                input.setAttribute('submissionId', policy['submissionId'])
                input.setAttribute('id', `checkbox_agency_${policy['submissionId']}`)
                td.append(input)

                input.addEventListener('change', function() {

                    numberOfCheckedInputs = document.querySelectorAll('input[type=checkbox]:checked').length

                    if (numberOfCheckedInputs == 0) {
                        approvalButton.classList.remove('btn-active')
                    } else {
                        approvalButton.classList.add('btn-active')

                        if (stateToCheck == 1) {
                            approvalButton.value = `Approve ${numberOfCheckedInputs}`
                        } else {
                            approvalButton.value = `Verify ${numberOfCheckedInputs}`
                        }
                        
                    }
                    
                })

            } else if (key == 'nameOfAgency') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 380px; width: 400px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                td.setAttribute('id', `td_${key}_${policy['submissionId']}`)
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
                button.setAttribute('onclick', `editAgency(${policy['submissionId']})`)
                button.setAttribute('submissionId', policy['submissionId'])
                button.setAttribute('id', `checkbox_agency_${policy['submissionId']}`)
                button.innerHTML = '<i class="fa fa-pause"></i>' //<i class="fa fa-play" aria-hidden="true"></i>
                td.append(button)

            } else if (key == 'currentStatus') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 120px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                td.setAttribute('id', `td_${key}_${policy['submissionId']}`)
                tr.append(td)

                detailedStatusDescriptions = {
                    'verified': {
                        name: 'Processing',
                        icon: `<i style='color: #000dff; margin-right: 1%; animation:spin 4s linear infinite;' class="fas fa-sync"></i>`
                    },
                    'succesfully_added': {
                        name: 'Succesfully Added',
                        icon: `<i style='color: green; margin-right: 1%;' class="fad fa-check-circle"></i>`
                    },
                    'failed': {
                        name: 'Failed to Add',
                        icon: `<i style='color: #850000; margin-right: 1%;' class="fas fa-exclamation-circle"></i>`
                    },
                    'already_added': {
                        name: 'Already Added',
                        icon: `<i style='color: #cacf78; margin-left: 1%; margin-right: 3%;' class="fas fa-exclamation"></i>`
                    }
                }

                detailedStatus = detailedStatusDescriptions[policy[key]]
                
                td.innerHTML = detailedStatus.icon + ' ' + detailedStatus.name

            } else {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 120px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                td.setAttribute('id', `td_${key}_${policy['submissionId']}`)
                tr.append(td)
                
                td.innerHTML = policy[key]

            }
            
    
        }

    }

    mainBox = document.getElementById('main-table_box')
    mainBox.classList.remove('hidden')


}


// approvalButton.addEventListener('click', async function() {

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