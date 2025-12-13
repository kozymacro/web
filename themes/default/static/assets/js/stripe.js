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

        payWithStripe(currency, days, lang, 'success', "", false, 0, false, false);
    });

    $(document).on("click", ".special-release-pay-with-s", function() {
        let currency = 'usd';
        if ($(".js-btn-eur").hasClass('active')) {
            currency = 'eur';
        }

        let lang = $(this).data('lang');
        let name = $(this).data('name');

        payWithStripe(currency, 1, lang, 'special-release-success', name, false, 0, false, false);
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

        payWithStripe(currency, 1, lang, 'subscription-success', "", true, seatCount, false, false);
    });

    $(document).on("click", ".pay-with-stripe-tr", function() {
        let days = $(this).data('days');
        let price = $(this).data('price');
        if (!days || days <= 0) return;

        const buttonText = $(this).clone().find('small').remove().end().text().trim();

        $('#stripeTRModalTitle').attr('data-days', days);
        $('#stripeTRModalTitle').attr('data-price', price);
        $('#stripeTRModalTitle').text('Kozy ' + buttonText);
        $('#stripeTRQuantityInput').val(1);

        if (typeof updateStripeTRPrice === 'function') {
            updateStripeTRPrice();
        }

        if (typeof showStripeTRModal === 'function') {
            showStripeTRModal();
        }
    });

    $(document).on("click", "#confirmStripeTR", function() {
        let days = parseInt($('#stripeTRModalTitle').attr('data-days'));
        let quantity = parseInt($('#stripeTRQuantityInput').val());

        if (!days || days <= 0) return;

        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        } else if (quantity > 100) {
            quantity = 100;
        }

        const btn = $(this);
        if (btn.prop('disabled')) return;

        btn.prop('disabled', true);
        btn.addClass('btn-loading-wrapper');

        payWithStripe('try', days, 'tr', 'success', '', false, quantity, true, false, function() {
            btn.prop('disabled', false);
            btn.removeClass('btn-loading-wrapper');
        });
    });

    $(document).on("click", ".pay-hardware-stripe", function() {
        const btn = $(this);
        if (btn.prop('disabled')) return;

        btn.prop('disabled', true);
        btn.addClass('btn-loading-wrapper');

        let lang = btn.data('lang') || 'tr';

        payWithStripe('try', 1, lang, 'hardware-success', '', false, 1, false, true, function() {
            btn.prop('disabled', false);
            btn.removeClass('btn-loading-wrapper');
        });
    });

    function payWithStripe(currency, days, lang, successValue, specialName, isSubscription, seatCount, useDaysProperty, isHardware, onError) {
        let path = '';
        if (lang === 'en') {
            path = '/en'
        }

        const requestBody = {
            language: lang,
            currency: currency,
            successUrl: 'https://kozymacro.com' + path + '?payment=' + successValue,
            cancelUrl: 'https://kozymacro.com' + path + '?payment=fail',
            specialName: specialName
        };

        if (useDaysProperty) {
            requestBody.days = parseInt(days);
            requestBody.quantity = parseInt(seatCount);
        } else {
            requestBody.quantity = parseInt(days);
        }

        if (isSubscription) {
            requestBody.isSubscription = true;
            requestBody.seatCount = parseInt(seatCount);
        }

        if (isHardware) {
            requestBody.hardware = true;
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
            if (data && data.url) {
                window.location = data.url;
            } else {
                if (onError) onError();
            }
        })
        .catch(function(err) {
            console.warn(err);
            if (onError) onError();
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
    else if (payResult === "hardware-success") {
        $('#payResultHardwareSuccessContent').show();
        $('#payResultModal').modal('show');
    }
});
