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

        payWithStripe(currency, days, lang, 'success', "");
    });

    $(document).on("click", ".special-release-pay-with-s", function() {
        let currency = 'usd';
        if ($(".js-btn-eur").hasClass('active')) {
            currency = 'eur';
        }

        let lang = $(this).data('lang');
        let name = $(this).data('name');
        
        payWithStripe(currency, 1, lang, 'special-release-success', name);
    });

    function payWithStripe(currency, days, lang, successValue, specialName) {
        let path = '';
        if (lang === 'en') {
            path = '/en'
        }
        
        fetch("https://pay.kozymacro.com/v1/stripe", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'manual', // manual, *follow, error
            body: JSON.stringify({
                language: lang,
                currency: currency,
                quantity: parseInt(days),
                successUrl: 'https://kozymacro.com' + path + '?payment=' + successValue,
                cancelUrl: 'https://kozymacro.com' + path + '?payment=fail',
                specialName: specialName
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
