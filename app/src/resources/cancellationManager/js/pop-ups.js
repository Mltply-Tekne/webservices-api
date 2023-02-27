function changeCancelStatus(pInvoiceNumber, pCancelStatus) {
    let policyIndex = policiesToBeCanceledOrPaused.findIndex(policy => policy['invoicenumber'] == pInvoiceNumber)

    let body = document.getElementById('standard_popup_body')
    body.innerHTML = ""
    body.setAttribute("style", "text-align: center")

    let textContainer = document.createElement('div')
    textContainer.setAttribute('style', 'display: flex; justify-content: center; flex-direction: column;')
    body.append(textContainer)

    let icon = document.createElement('p')
    icon.innerHTML = `<i style='font-size: 40px; color: var(--orange);' class="fas fa-question-circle"></i>`
    textContainer.append(icon)


    let p = document.createElement('p')
    p.setAttribute('style', 'text-align: center; font-size: 20px;')
    p.innerHTML = `<i style='margin-right: 1%;'></i> Are you sure to ${pCancelStatus == 'scheduled' ? 'pause' : pCancelStatus == 'paused' ? 'resume' : 'delete'} the policy automated cancellation?`
    textContainer.append(p)

    let buttonContainer = document.createElement('div')
    buttonContainer.setAttribute('style', 'display: flex; justify-content: end;')
    body.append(buttonContainer)

    var button = document.createElement('button')
    button.classList.add('input_popup_warn')
    button.setAttribute('onclick', 'closestandard_popup()')
    button.innerHTML = "Cancel"
    buttonContainer.append(button)

    var confirmButton = document.createElement('button')
    confirmButton.classList.add('input_popup_warn')
    confirmButton.innerHTML = "Confirm"
    buttonContainer.append(confirmButton)

    confirmButton.addEventListener('click', async function () {

        closestandard_popup()

        policiesToBeCanceledOrPaused[policyIndex].cancelstatus = pCancelStatus == 'scheduled' ? 'paused' : 
                                                                pCancelStatus == 'paused' ? 'scheduled' : 'deleted'

        await postToServer('cancellations', {reviewedCancellations: [policiesToBeCanceledOrPaused[policyIndex]]})

        if (pCancelStatus == 'deleted') policiesToBeCanceledOrPaused.splice(policyIndex, 1)

        poblateTables()
    })

    openstandard_popup()
}