$(document).ready(function() {
    $(document).on("click", ".pay-with-s", function() {

        let days = $(this).data('day-count');
        if (days <= 0) return;

        let priceId = $("#pay-with-s-price-id").val();
        let lang = $("#pay-with-s-price-id").data('lang');

        payWithStripe(priceId, days, lang, 'success');
    });

    $(document).on("click", ".special-release-pay-with-s", function() {
        let priceId = $(this).data('price-id');
        let lang = $(this).data('lang');
        
        payWithStripe(priceId, 1, lang, 'special-release-success');
    });

    function payWithStripe(priceId, days, lang, successValue) {
        let path = '';
        if (lang === 'tr') {
            path = '/tr'
        }
        
        fetch("https://pay.kozymacro.com/v1/stripe", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'manual', // manual, *follow, error
            body: JSON.stringify({
                priceId: priceId,
                quantity: parseInt(days),
                successUrl: 'https://kozymacro.com' + path + '?payment=' + successValue,
                cancelUrl: 'https://kozymacro.com' + path + '?payment=fail'
            })
        })
        .then(response => response.json())
        .then(data => {
            window.location = data.url;
        })
        .catch(function(err) {
            console.warn(err);
        });
    }
});

$(window).on('load',function(){
    const urlParams = new URLSearchParams(window.location.search);
    const payResult = urlParams.get('payment');

    if (payResult === "success") {
        $('#payResultSuccessContent').show();
        $('#payResultModal').modal('show');
    }
    else if (payResult === "fail") {
        $('#payResultFailContent').show();
        $('#payResultModal').modal('show');
    }
    else if (payResult === "special-release-success") {
        $('#payResultSpecialReleaseSuccessContent').show();
        $('#payResultModal').modal('show');
    }
});
