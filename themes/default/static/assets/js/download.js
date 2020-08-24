$(document).ready(function(){
    $('.btn-download-modal').on('click', function(){
        if ($(this).hasClass('beta')){
            clickToLink($('#beta-download-link').data('link'));
        } else {
            clickToLink($('#download-link').data('link'));
        }
        $('#downloadModal').modal('hide');
            setTimeout(function (){
            clickToLink('#guide');
        }, 500);
    });
    $('#click-for-payment').on('click', function(){
        $('#downloadModal').modal('hide');
        setTimeout(function (){
            clickToLink('#pricing');
        }, 500);
    });
});

function clickToLink(uri) 
{
    var link = document.createElement("a");
    link.href = uri;
    link.click();
}
