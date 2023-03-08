function changeCancelStatus(pInvoiceNumber, pNewCancelStatus) {
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
    p.setAttribute('style', 'text-align: center; font-size: 21px;')
    p.innerHTML = `<i style='margin-right: 1%;'></i> Are you sure to ${pNewCancelStatus == 'scheduled' ? 'resume' : pNewCancelStatus == 'paused' ? 'pause' : 'delete'} the policy automated cancellation?`
    textContainer.append(p)

    let pSub = document.createElement('p')
    pSub.setAttribute('style', 'text-align: center; font-size: 15px; width: 50%; color: rgb(80,80,80)')
    pSub.innerHTML = `<i style='margin-right: 1%;'></i> The specified policy will ${pNewCancelStatus == 'scheduled' ? 'be cancelled on the next cancellation run.' : pNewCancelStatus == 'paused' ? 'remain paused until you have manually resume it, or the invoice is paid.' : 'not be cancelled.'}`
    textContainer.append(pSub)

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

        policiesToBeCanceledOrPaused[policyIndex].cancelstatus = pNewCancelStatus == 'scheduled' ? 'scheduled' : 
                                                                pNewCancelStatus == 'paused' ? 'paused' : 'deleted'

        await postToServer('cancellations', {reviewedCancellations: [policiesToBeCanceledOrPaused[policyIndex]]})

        if (pNewCancelStatus == 'deleted') policiesToBeCanceledOrPaused.splice(policyIndex, 1)

        poblateTables()
    })

    openstandard_popup()
}