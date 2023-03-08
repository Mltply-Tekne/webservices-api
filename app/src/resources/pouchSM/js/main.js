var approvalButton = document.getElementById("btn-submit");
var pendingToReviewAgents;

var tbody = document.createElement('tbody')

var shownResults = {
    start: 0,
    end: 20
}

window.addEventListener("load", async function (event) {

    // Obtaining data
    apiData = await getFromServer('getAgentsToManage?reviewStatus=', stateToCheck)
    apiData = apiData.response
    pendingToReviewAgents = apiData.submissions

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
selectedFieldsAndNames = stateToCheck < 2 ?
{
    // 'submissionId': 'Submission ID', 
    'nameOfAgency': 'Agency Name', 
    'state': 'State', 
    'enabledStates': 'Enabled States', 
    'parentAgencyName': 'Parent Agency', 
    'parentAgencyCommission': 'Commission',
    'existingAgentId': 'Agent Group Id',
    'edit': 'Edit',
    'reviewStatus': 'checkbox',
    'delete': 'Delete'
    
} : {

    // 'submissionId': 'Submission ID', 
    'nameOfAgency': 'Agency Name', 
    'state': 'State', 
    'enabledStates': 'Enabled States', 
    'parentAgencyName': 'Parent Agency',
    'parentAgencyCommission': 'Commission',
    'agentGroupId': 'Agent Group Id',
    'salesPerson': 'Sales People',
    'currentStatus': 'Status'

}

nonEditableFields = ['edit', 'reviewStatus', 'delete', 'existingAgentId']

function addToTable(pPendingToReviewAgents) {
    // Iterating contents
    for (pendingToReviewAgent of pPendingToReviewAgents) {

        let tr = document.createElement('tr')
        tr.setAttribute('submissionId', pendingToReviewAgent['submissionId'])
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
                input.setAttribute('submissionId', pendingToReviewAgent['submissionId'])
                input.setAttribute('id', `checkbox_agency_${pendingToReviewAgent['submissionId']}`)

                if (pendingToReviewAgent.alreadyExists == true) {
                    input.setAttribute('disabled', '')
                }

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
                td.setAttribute('id', `td_${key}_${pendingToReviewAgent['submissionId']}`)
                tr.append(td)
                
                td.innerHTML = pendingToReviewAgent[key]

            } else if (key == 'parentAgencyName') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 300px; width: 300px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                tr.append(td)
                
                td.innerHTML = pendingToReviewAgent[key]

            } else if (key == 'edit') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 120px; width: 30px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;')
                tr.append(td)

                let button = document.createElement('button')
                button.setAttribute('type', 'checkbox')
                button.setAttribute('class', 'approvalRequired')
                button.setAttribute('name', 'approvalRequired')
                button.setAttribute('onclick', `editAgency(${pendingToReviewAgent['submissionId']})`)
                button.setAttribute('submissionId', pendingToReviewAgent['submissionId'])
                button.setAttribute('id', `checkbox_agency_${pendingToReviewAgent['submissionId']}`)
                button.innerHTML = '<i class="fal fa-pencil"></i>'
                td.append(button)

            } else if (key == 'salesPerson') {
                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 70px; width: 70px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis; text-align: center;')
                tr.append(td)
                
                td.innerHTML = pendingToReviewAgent[key].length

            }else if (key == 'currentStatus') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 200px; width: 200px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                td.setAttribute('id', `td_${key}_${pendingToReviewAgent['submissionId']}`)
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

                detailedStatus = detailedStatusDescriptions[pendingToReviewAgent[key]]
                
                td.innerHTML = detailedStatus.icon + ' ' + detailedStatus.name

            } else if (key == 'delete') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 120px; width: 30px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;')
                tr.append(td)

                let buttonDelete = document.createElement('button')
                buttonDelete.innerHTML = '<i class="fal fa-trash"></i>'
                // buttonDelete.setAttribute('onclick', `editAgency(${pendingToReviewAgent['submissionId']}, 'delete')`)
                buttonDelete.setAttribute('onclick', `confirmationPopup('Are you sure delete?', 'This will not be reversible.', 'updateAgentStatus([{submissionId: ${pendingToReviewAgent['submissionId']}, newStatus: -3}])')`)
                td.append(buttonDelete)

            } else if (['agentGroupId', 'existingAgentId'].includes(key)) {

                let td = document.createElement('td')

                if (key == 'agentGroupId') {
                    td.setAttribute('style', 'max-width: 160px; width: 160px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                } else {
                    td.setAttribute('style', 'max-width: 120px; width: 120px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                }
                
                td.setAttribute('id', `td_${key}_${pendingToReviewAgent['submissionId']}`)
                tr.append(td)

                let a = document.createElement('a')
                a.setAttribute('href', 'https://design.instanda.us/Agent/EditAgentGroup?agentGroupId=' + pendingToReviewAgent[key])
                a.setAttribute('target', '_blank')
                // a.setAttribute('style', 'color: var(--darkGray)')
                a.innerHTML = pendingToReviewAgent[key] == undefined ? '' : pendingToReviewAgent[key]

                td.append(a)

                
                

            } else {

                let td = document.createElement('td')

                if (stateToCheck < 2) {
                    td.setAttribute('style', 'max-width: 70px; width: 70px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                }
                
                td.setAttribute('id', `td_${key}_${pendingToReviewAgent['submissionId']}`)
                tr.append(td)
                
                td.innerHTML = pendingToReviewAgent[key]

            }
            
    
        }

    }
}

async function updateChangedAgents(pArraySubmissionIds) {
    arrayObjects = pendingToReviewAgents.filter(agent => pArraySubmissionIds.includes(agent.submissionId));
    await postToServer('updateAgentsToManage', {reviewedAgents: arrayObjects})
}

async function updateAgentStatus(pArrayObjSubmissionIds) {

    changedSubmission = []

    for (submission of pArrayObjSubmissionIds) {
        changedSubmission.push(submission.submissionId)
        index = pendingToReviewAgents.findIndex(agent => agent.submissionId == submission.submissionId)
        pendingToReviewAgents[index].newStatus = submission.newStatus

        if (submission.newStatus == -3) {
            td = document.querySelector(`[submissionId="${submission.submissionId}"]`)
            td.remove()
        }
    }

    updateChangedAgents(changedSubmission)
}

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

        if (field == 'checkbox') {

            th.setAttribute('style', 'text-align: center;')
            
            if (stateToCheck == 1) {
                th.innerHTML = `Approve`
            } else {
                th.innerHTML = `Verify`
            }

        } else if (field == 'Edit') {

            th.setAttribute('style', 'text-align: center;')
            th.innerHTML = field

        } else if (field == 'Sales People') {
            th.setAttribute("data-tooltip", 'Number of Sales People')
            th.setAttribute("class", "link")
            th.setAttribute("style", "--top_box: -6px; text-align: center;")
            th.innerHTML = '<i class="fad fa-users"></i>'

        } else {

            th.innerHTML = field

        }

        
        tr.append(th)

    }

    
    table.append(tbody)

    addToTable(pendingToReviewAgents)

    mainBox = document.getElementById('main-table_box')
    mainBox.classList.remove('hidden')


}


approvalButton.addEventListener('click', async function() {

    let checkedInputs = document.querySelectorAll('input[type=checkbox]:checked')
    approvalButton.classList.add('btn-disabled')
    approvalButton.setAttribute('disabled', '')

    agentsArr = []

    checkedInputs.forEach((input) => {

        let agent = pendingToReviewAgents.find(agent => agent['submissionId'] == input.getAttribute('submissionId'))
        agent['newStatus'] = stateToCheck + 1
        agentsArr.push(agent)
        
    });

    bodyObj = {
        reviewedAgents: agentsArr
    }

    if (stateToCheck == 1) {
        postToAPI('', bodyObj)
    }

    await postToServer('updateAgentsToManage', bodyObj)
    location.reload()


})