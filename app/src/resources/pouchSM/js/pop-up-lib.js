const overlay = document.getElementById('overlay')

overlay.addEventListener('click', () => {
    const All_PopUps = document.querySelectorAll('.active')
    All_PopUps.forEach(PopUp => {
        closestandard_popup(PopUp)
        PopUp.setAttribute('style', '')
    })
})

// Standard PopUp

function openstandard_popup() {
    if (standard_popup == null) return
    standard_popup.classList.add('active');
    

    overlay.classList.add('active');
    popup_abierto = 1

    // var body = document.getElementById('standard_popup_body')
    document.addEventListener('keydown', function(event){
        if (popup_abierto == 1) {
            if(event.key === "Escape"){
                closestandard_popup()
            }
        } 
    });
}

function closestandard_popup() { 
    if (standard_popup == null) return
    standard_popup.setAttribute('style', '')
    standard_popup.classList.remove('active');
    overlay.classList.remove('active');
    popup_abierto = 0
}