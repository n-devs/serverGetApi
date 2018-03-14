// wait for the DOM to be loaded 
$(document).ready(function () {
    var options = {
        data: {
            productStatus: 1
        },
        dataType: 'json',
        success: function (responseText, statusText, xhr, $form) {
            if (responseText.status == 1) {
                alert('SUCCESS productId : ' + responseText.productId);
                $form.resetForm();
            } else
                alert(responseText.error);
        }
    };
    // bind 'myForm' and provide a simple callback function 
    $('.myForm').ajaxForm(options);
});