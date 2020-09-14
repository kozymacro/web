var stripe = Stripe('pk_live_51Gz2YCEFbqhraEwxuuB9FIhACdV1Sui5pzzuACNZJnTv9AtzZWB2VjhIOZpzz1Q326Dj2uPmfbUFyVu4jdM5CiFb00L0XGT5wt');

$(document).ready(function() {
    $(document).on("click","#pay-with-s",function() {

        let days = $('#pay-with-s-select').val();
        if (days <= 0) return;

        let priceId = $("#pay-with-s-price-id").val();

        let lang = $("#pay-with-s-price-id").data('lang');
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
                successUrl: 'https://kozymacro.com' + path + '?payment=success',
                cancelUrl: 'https://kozymacro.com' + path + '?payment=fail'
            }).then(function (result) {
                // If `redirectToCheckout` fails due to a browser or network
                // error, display the localized error message to your customer
                // using `result.error.message`.
            });
    });
});

$(window).on('load',function(){
    const urlParams = new URLSearchParams(window.location.search);
    const payResult = urlParams.get('payment');

    console.log(urlParams);
    console.log(payResult);

    if (payResult === "success") {
        $('#payResultSuccessContent').show();
        $('#payResultModal').modal('show');
    }
    else if (payResult === "fail") {
        $('#payResultFailContent').show();
        $('#payResultModal').modal('show');
    }
});