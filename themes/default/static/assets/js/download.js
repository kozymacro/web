$(document).ready(function(){
    $('.btn-download-modal').on('click', function(){
        clickToLink($('#download-link').data('link'));
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
    $('.js-click-for-special-release').on('click', function(){
        $('#downloadModal').modal('hide');
        setTimeout(function (){
            clickToLink('#special-release');
        }, 500);
    });
    $('#download-modal-link').on('click', function(){
        $('#downloads-tab a:first-child').tab('show');
    });
});

function clickToLink(uri) 
{
    var link = document.createElement("a");
    link.href = uri;
    link.click();
}
