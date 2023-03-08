var approvalButton = document.getElementById("btn-submit");
var policiesToBeCanceledOrPaused;

window.addEventListener("load", async function (event) {

    // Obtaining data
    apiData = await getFromServer('cancellations')
    policiesToBeCanceledOrPaused = apiData.response

    console.log(apiData)

    await poblateTables()
});

// If the status to check represent the review process or the status process
selectedFieldsAndNames = {

    'invoicenumber': 'Invoice Number',
    'policynumber': 'Policy Number',
    'subscriptionid': 'Subscription Id',
    'cancelreason': 'Cancel Reason',
    'status': 'Invoice Status',
    'cancelstatus': 'Status',
    'action': 'Action'
}

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

        if (field == 'Action') {

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
            if (['invoicenumber', 'policynumber', 'subscriptionid'].includes(key)) {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 120px; width: 120px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                td.setAttribute('id', `td_${key}_${policy['invoicenumber']}`)
                tr.append(td)

                
                urlObject = {
                    'invoicenumber': {
                        url: 'https://pouch.chargebee.com/d/invoices/'
                    },
                    'subscriptionid': {
                        url: 'https://pouch.chargebee.com/d/subscriptions/'
                    }
                }

                if (Object.keys(urlObject).includes(key)) {

                    let a = document.createElement('a')
                    a.setAttribute('href', urlObject[key].url + policy[key])
                    a.setAttribute('target', '_blank')
                    // a.setAttribute('style', 'color: var(--darkGray)')
                    a.innerHTML = policy[key]

                    td.append(a)
                } else 
                    td.innerHTML = policy[key]

            } else if (key == 'action') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 80px; width: 30px; white-space: nowrap; text-overflow: ellipsis; text-align: center;')
                tr.append(td)

                if (!['paid', 'deleted'].includes(policy.status)) {

                    let button = document.createElement('button')
                    button.setAttribute('id', `checkbox_agency_${policy['invoicenumber']}`)
    
                    button.innerHTML = policy.cancelstatus == 'scheduled' ? '<i class="fal fa-pause-circle"></i>' : '<i class="fal fa-clock"></i>'
                    // button.title = policy.cancelstatus == 'scheduled' ? 'Pause' : 'Resume'
                    button.setAttribute("data-tooltip", policy.cancelstatus == 'scheduled' ? 'Pause' : 'Resume')
                    button.setAttribute("class", "link")
                    button.setAttribute('onclick', `changeCancelStatus('${policy['invoicenumber']}', '${policy.cancelstatus == 'scheduled' ? 'paused' : 'scheduled'}')`)
                    td.append(button)
                }

                let buttonDelete = document.createElement('button')
                buttonDelete.innerHTML = '<i class="fal fa-trash"></i>'
                // buttonDelete.title = 'Remove'
                buttonDelete.setAttribute('onclick', `changeCancelStatus('${policy['invoicenumber']}', 'deleted')`)
                buttonDelete.setAttribute("data-tooltip", "Delete")
                buttonDelete.setAttribute("class", "link")
                td.append(buttonDelete)

            } else if (key == 'status') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 90px; width: 90px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;')
                tr.append(td)

                detailedStatusDescriptions = {
                    'not_paid': {
                        name: 'Not Paid',
                        icon: `<i style='color: #800000; margin-right: 1%;' class="far fa-credit-card"></i>`
                    },
                    'paid': {
                        name: 'Paid',
                        icon: `<i style='color: #50C878; margin-right: 1%;' class="far fa-credit-card"></i>`
                    },
                    'deleted': {
                        name: 'Deleted',
                        icon: `<i style='color: #6A6A6A; margin-right: 1%;' class="fas fa-times-circle"></i>`
                    }
                }

                detailedStatus = detailedStatusDescriptions[policy[key]]
                console.log(policy[key])
                td.innerHTML = detailedStatus.icon + ' ' + detailedStatus.name

            } else if (key == 'cancelstatus') {
                
                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 90px; width: 90px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;')
                tr.append(td)

                detailedStatusDescriptions = {
                    'scheduled': {
                        name: 'Scheduled',
                        icon: `<i style='color: #0047AB; margin-right: 1%;' class="fas fa-clock"></i>`
                    },
                    'paused': {
                        name: 'Paused',
                        icon: `<i style='color: #E49B0F; margin-right: 1%;' class="fas fa-pause-circle"></i>`
                    },
                    'other': {
                        name: 'Not Applicable',
                        icon: `<i style='color: #6A6A6A; margin-right: 1%;' class="fas fa-times-circle"></i>`
                    }
                }

                detailedStatus = (policy.status == 'paid') || (policy.status == 'deleted') ? detailedStatusDescriptions.other : detailedStatusDescriptions[policy[key]]

                td.innerHTML = detailedStatus.icon + ' ' + detailedStatus.name

            } else if (key == 'cancelreason') {

                let td = document.createElement('td')
                td.setAttribute('style', 'max-width: 400px; width: 400px; white-space: nowrap; overflow: hidden;  line-break: nowrap; text-overflow: ellipsis;')
                td.setAttribute('title', policy[key])
                tr.append(td)
                
                td.innerHTML = policy[key]

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


// })

// resumeAllPolicies.addEventListener('click', async function() {

// })