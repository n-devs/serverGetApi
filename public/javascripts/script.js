// wait for the DOM to be loaded 
$(document).ready(function () {
    var options = {
        data: {
            productStatus: 1
        },
        dataType: 'json',
        success: (responseText, statusText, xhr, $form) => {
            alert('SUCCESS productId : ' + responseText.productId);
            $form.resetForm();
        },
        error: (jqXHR, textStatus, errorThrown) => {
            var responseText = JSON.parse(jqXHR.responseText);
            alert(errorThrown + ': ' + responseText.error);
        }
    };
    // bind 'myForm' and provide a simple callback function 
    $('.myForm').ajaxForm(options);
});