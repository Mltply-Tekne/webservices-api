
(function ($) {
    "use strict";

    
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(e){

        e.preventDefault()
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        const data = new FormData(e.target);
        

        console.log(Object.fromEntries(data.entries()))
        // console.log(Object.fromEntries(data.entries()).username)
        console.log(e)

        var baseUrl = serverEnvironment == 'production' ? `https://pouch.eastus.cloudapp.azure.com/api/v1/agent/` : `https://mltply.eastus.cloudapp.azure.com/webservices/${serverEnvironment}/auth/api/auth/signup`

        $.ajax({
            url: baseUrl,
            type: "POST",
            dataType: 'html',
            // data: {
            //     username: Object.fromEntries(data.entries()).username,
            //     email: Object.fromEntries(data.entries()).email,
            //     password: Object.fromEntries(data.entries()).pass,
            //     role: $('#role').val()
            // },
           data:  $("#signup-form").serializeArray(),
            success: function(response){
                console.log(response)
                document.getElementById("text-message").innerHTML = response;
                document.getElementById("text-message").style.display = "block"
                document.getElementById("text-message").style.color = "darkgreen" 
            },
            error: function(xhr, status, error) {
                console.log('Error:', xhr.responseText);
                console.log('Error:', error);
            }
        })

        // return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);