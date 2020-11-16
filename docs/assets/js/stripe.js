var stripe = Stripe('pk_live_51Gz2YCEFbqhraEwxuuB9FIhACdV1Sui5pzzuACNZJnTv9AtzZWB2VjhIOZpzz1Q326Dj2uPmfbUFyVu4jdM5CiFb00L0XGT5wt');

$(document).ready(function() {
    $(document).on("click", ".pay-with-s", function() {

        let days = $(this).data('day-count');
        if (days <= 0) return;

        let priceId = $("#pay-with-s-price-id").val();
        let lang = $("#pay-with-s-price-id").data('lang');

        payWithStripe(priceId, days, lang, 'success');
    });

    $(document).on("click", ".special-release-pay-with-s", function() {
        console.log('asdfs');
        let priceId = $(this).data('price-id');
        let lang = $(this).data('lang');
        
        payWithStripe(priceId, 1, lang, 'special-release-success');
    });

    function payWithStripe(priceId, days, lang, successValue) {
        let path = '';
        if (lang === 'tr') {
            path = '/tr'
        }

        stripe.redirectToCheckout({
                lineItems: [{
                    price: priceId,
                    quantity: parseInt(days),
                }],
                mode: 'payment',
                successUrl: 'https://kozymacro.com' + path + '?payment=success' + successValue,
                cancelUrl: 'https://kozymacro.com' + path + '?payment=fail'
            }).then(function (result) {
                // If `redirectToCheckout` fails due to a browser or network
                // error, display the localized error message to your customer
                // using `result.error.message`.
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