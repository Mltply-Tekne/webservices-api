function changeCancelStatus(pInvoiceNumber) {
    let policyIndex = policiesToBeCanceledOrPaused.findIndex(policy => policy['invoicenumber'] == pInvoiceNumber)
    let policyData = policiesToBeCanceledOrPaused[policyIndex]

    let body = document.getElementById('standard_popup_body')
    body.innerHTML = ""
    body.setAttribute("style", "text-align: center")

    document.getElementById('title_standard_popup').innerHTML = `<i style='margin-right: 1%;'></i> Are you sure to ${policyData.cancelstatus == 'scheduled' ? 'pause' : 'resume'} the policy automated cancellation?`

    let buttonContainer = document.createElement('div')
    buttonContainer.setAttribute('style', 'display: flex; justify-content: end;')
    body.append(buttonContainer)

    var button = document.createElement('button')
    button.classList.add('input_popup_warn')
    button.setAttribute('onclick', 'closestandard_popup()')
    button.innerHTML = "Cancel"
    buttonContainer.append(button)

    var saveButton = document.createElement('button')
    // button.setAttribute("style", "margin-top: 5%; margin-bottom: 1%; width: 50%;")
    saveButton.classList.add('input_popup_warn')
    saveButton.innerHTML = "Save"
    buttonContainer.append(saveButton)

    // var r = document.querySelector('.dropdown-menu');
    // r.style.setProperty('--bs-dropdown-link-active-bg', '#FF7327');
    // r.setAttribute('style', '--bs-dropdown-link-active-bg')

    saveButton.addEventListener('click', async function () {

        closestandard_popup()

        policiesToBeCanceledOrPaused[policyIndex].cancelstatus = policyData.cancelstatus == 'scheduled' ? 'pause' : 'scheduled'

        await postToServer('cancellations', {reviewedCancellations: [policiesToBeCanceledOrPaused[policyIndex]]})
        poblateTables()
    })

    openstandard_popup()
}