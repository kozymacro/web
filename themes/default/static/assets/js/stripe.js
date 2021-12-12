$(document).ready(function() {
    const changeCurrency = (symbol, price) => {
        $("#js-daily-price").html(symbol + (+price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, ','));
        $("#js-special-release-price").html(symbol);
        $(".pay-with-s").each(function() {
            const own = $(this);
            const dayCount = own.data('day-count');
            own.find('small').html("(" + symbol + (+price * +dayCount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, ',') + ")");
        });
    };

    $(document).on("click", ".js-btn-currency", function() {
        const btnUsd = $(".js-btn-usd");
        const btnEur = $(".js-btn-eur");
        const usdActive = btnUsd.hasClass('active');
        if (usdActive) {
            btnEur.removeClass('btn-light btn-outline-secondary');
            btnEur.addClass('btn-dark active');
            btnUsd.removeClass('btn-dark active');
            btnUsd.addClass('btn-light btn-outline-secondary');
            const eurPrice = $('#eur-price-per-day').val();
            changeCurrency("€", eurPrice);
            return;
        }
        btnUsd.removeClass('btn-light btn-outline-secondary');
        btnUsd.addClass('btn-dark active');
        btnEur.removeClass('btn-dark active');
        btnEur.addClass('btn-light btn-outline-secondary');
        const usdPrice = $('#usd-price-per-day').val();
        changeCurrency("$", usdPrice);
    });

    $(document).on("click", ".pay-with-s", function() {

        let days = $(this).data('day-count');
        if (days <= 0) return;

        let priceId = $("#pay-with-s-price-id").val();
        if ($(".js-btn-eur").hasClass('active')) {
            priceId = $("#pay-with-s-price-id-eur").val();
        }

        let lang = $("#pay-with-s-price-id").data('lang');

        payWithStripe(priceId, days, lang, 'success', false);
    });

    $(document).on("click", ".special-release-pay-with-s", function() {
        let priceId = $(this).data('price-id');
        if ($(".js-btn-eur").hasClass('active')) {
            priceId = $(this).data('price-id-eur');
        }

        let lang = $(this).data('lang');
        
        payWithStripe(priceId, 1, lang, 'special-release-success', true);
    });

    function payWithStripe(priceId, days, lang, successValue, special) {
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
                cancelUrl: 'https://kozymacro.com' + path + '?payment=fail',
                special: special,
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
