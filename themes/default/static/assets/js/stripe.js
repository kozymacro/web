$(document).ready(function() {
    const changeCurrency = (symbol, price) => {
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

        let currency = 'usd';
        if ($(".js-btn-eur").hasClass('active')) {
            currency = 'eur';
        }

        let lang = $("#pay-with-s-price-id").data('lang');

        payWithStripe(currency, days, lang, 'success', "", false, 0);
    });

    $(document).on("click", ".special-release-pay-with-s", function() {
        let currency = 'usd';
        if ($(".js-btn-eur").hasClass('active')) {
            currency = 'eur';
        }

        let lang = $(this).data('lang');
        let name = $(this).data('name');

        payWithStripe(currency, 1, lang, 'special-release-success', name, false, 0);
    });

    $(document).on("click", ".pay-with-subscription", function() {
        $('#seatCountInput').val(1);
        showSubscriptionModal();
        if (typeof updateSubscriptionPrice === 'function') {
            updateSubscriptionPrice();
        }
    });

    $(document).on("click", "#confirmSubscription", function() {
        let seatCount = parseInt($('#seatCountInput').val());
        if (isNaN(seatCount) || seatCount <= 0) {
            seatCount = 1;
        }

        let lang = $("#pay-with-subscription-price-id").data('lang');
        let currency = lang === 'tr' ? 'try' : 'usd';

        payWithStripe(currency, 1, lang, 'subscription-success', "", true, seatCount);
    });

    function payWithStripe(currency, days, lang, successValue, specialName, isSubscription, seatCount) {
        let path = '';
        if (lang === 'en') {
            path = '/en'
        }

        const requestBody = {
            language: lang,
            currency: currency,
            quantity: parseInt(days),
            successUrl: 'https://kozymacro.com' + path + '?payment=' + successValue,
            cancelUrl: 'https://kozymacro.com' + path + '?payment=fail',
            specialName: specialName
        };

        if (isSubscription) {
            requestBody.isSubscription = true;
            requestBody.seatCount = parseInt(seatCount);
        }

        fetch("https://pay.kozymacro.com/v1/stripe", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'manual', // manual, *follow, error
            body: JSON.stringify(requestBody)
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
    else if (payResult === "subscription-success") {
        $('#payResultSubscriptionSuccessContent').show();
        $('#payResultModal').modal('show');
    }
});
