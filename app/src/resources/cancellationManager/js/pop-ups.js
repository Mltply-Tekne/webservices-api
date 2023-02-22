function editAgency (pSubmissionId) {

    let agentData = pendingToReviewAgents.find(agent => agent['submissionId'] == pSubmissionId)

    let body = document.getElementById('standard_popup_body')
    body.innerHTML = ""
    body.setAttribute("style", "text-align: center")
    document.getElementById('title_standard_popup').innerHTML = `<i style='margin-right: 1%;' class="fal fa-pencil"></i> Modify agency`


    for (field of Object.keys(selectedFieldsAndNames)) {

        if (!nonEditableFields.includes(field)) {


            let inputContainer = document.createElement('div')
            inputContainer.setAttribute('style', 'margin-bottom: 1%; padding: 1%;')
            body.append(inputContainer)

            var p = document.createElement('p')
            p.setAttribute("style", "width: 30%;")
            p.innerHTML = selectedFieldsAndNames[field]
            inputContainer.append(p)

            if (field == 'enabledStates') {

                var select = document.createElement('select')
                select.setAttribute("multiple", "true")
                select.setAttribute("data-live-search", 'true')
                select.setAttribute('class', 'selectpicker')
                select.setAttribute("field", field)
                select.setAttribute("style", "width: 70%;")

                inputContainer.append(select)
                
                for (state of apiData.states) {

                    let option = document.createElement('option')
                    option.value = state.code
                    option.innerHTML = state.name + ' (' + state.code + ')'

                    if (agentData.enabledStates.includes(state.code)) {
                        option.setAttribute('selected', '')
                    }
                    
                    select.append(option)

                }

                $('select').selectpicker();

            } else if (field == 'parentAgencyName') {

                var select = document.createElement('select')
                select.setAttribute("data-live-search", 'true')
                select.setAttribute('class', 'selectpicker')
                select.setAttribute("field", field)
                select.setAttribute("style", "width: 70%;")

                inputContainer.append(select)
                
                for (agent of apiData.parentAgencyData) {

                    let option = document.createElement('option')
                    option.value = agent.name
                    option.innerHTML = agent.name

                    if (agent.name == agentData[field]) {
                        option.setAttribute('selected', '')
                    }

                    select.append(option)

                }

                // Changes the commission input based on the selection
                select.addEventListener('change', function() {

                    let agencyData = apiData.parentAgencyData.find(agency => agency['name'] == this.value)
                    let inputCommission = document.getElementById('inputCommission')
                    inputCommission.value = agencyData.commission

                })

                $('select').selectpicker();

            } else {
                
                var input = document.createElement('input')
                input.setAttribute("class", "input_popup")
                input.setAttribute("field", field)
                input.setAttribute("placeholder", "Opcional")
                input.setAttribute("style", "width: 90%;")

                if (field == 'parentAgencyCommission') {
                    input.setAttribute("type", "number")
                    input.setAttribute("step", "0.01")
                    input.setAttribute("id", 'inputCommission')
                }
                    

                input.value = agentData[field]
                inputContainer.append(input)

            }

            

        }
    }

    var input = document.createElement('input')
    input.setAttribute("class", "input_popup")
    input.setAttribute("hidden", "")
    input.setAttribute("field", 'submissionId')
    input.value = agentData.submissionId
    body.append(input)

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

    var r = document.querySelector('.dropdown-menu');
r.style.setProperty('--bs-dropdown-link-active-bg', '#FF7327');

    saveButton.addEventListener('click', async function () {

        closestandard_popup()

        newDataObj = {}

        agentDataInputs = document.querySelectorAll('.input_popup')

        agentDataInputs.forEach((input) => {

            fieldName = input.getAttribute('field')
            newDataObj[fieldName] = input.value
            
        });

        agentDataSelects = document.querySelectorAll('.selectpicker')
        
        agentDataSelects.forEach((select) => {

            fieldName = select.getAttribute('field')

            var selected = $(select).find("option:selected");

            if (select.getAttribute('multiple')) {

                var arrSelected = [];
                selected.each(function(){
                    arrSelected.push($(this).val());
                });

                newDataObj[fieldName] = arrSelected

            } else {

                newDataObj[fieldName] = select.value

            }
            

        });

        for (newDataValue in newDataObj) {

            let tdElement = document.getElementById(`td_${newDataValue}_${newDataObj.submissionId}`)

            try {
                tdElement.innerHTML = newDataObj[newDataValue]
            } catch {
                continue
            }

        }

        originalAgencyData = pendingToReviewAgents.find(agent => agent['submissionId'] == newDataObj.submissionId)
        
        agencyData = apiData.parentAgencyData.find(agency => agency['name'] == newDataObj.parentAgencyName)

        for (newData in newDataObj) {
            originalAgencyData[newData] = newDataObj[newData]
        }

        originalAgencyData['parentAgencyRefCode'] = agencyData.refcode
        originalAgencyData['parentAgencyId'] = agencyData.agentgroupid

        originalAgencyData.updated = true
        originalAgencyData.newStatus = stateToCheck


        await postToServer('updateAgentsToManage', {reviewedAgents: [originalAgencyData]})

        originalAgencyData.updated = false
        originalAgencyData.hasBeenModified = true

        

    })


    openstandard_popup()

  }