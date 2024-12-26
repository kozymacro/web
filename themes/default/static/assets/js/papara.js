$(document).ready(function() {
    let selectedDayCount = 0;
    let selectedButton = null;

    // Input validations
    $('#papara-email').on('input', function() {
        const isValid = validateEmail($(this).val());
        updateValidationState($(this), isValid);
    });

    $('#papara-quantity').on('input', function() {
        const isValid = validateQuantity($(this).val());
        updateValidationState($(this), isValid);
    });

    $('#papara-discount').on('input', function() {
        const isValid = validateDiscount($(this).val());
        updateValidationState($(this), isValid);
    });

    // Update validation state
    function updateValidationState(input, isValid) {
        input.removeClass('is-valid is-invalid');
        if (input.val()) {
            input.addClass(isValid ? 'is-valid' : 'is-invalid');
        }
    }

    // When discount code checkbox changes
    $('#has-discount').on('change', function() {
        const $discountGroup = $('#discount-group');
        if ($(this).is(':checked')) {
            $discountGroup.addClass('show');
        } else {
            $discountGroup.removeClass('show');
            setTimeout(() => {
                if (!$('#has-discount').is(':checked')) {
                    $('#papara-discount').val('').removeClass('is-valid is-invalid');
                    $('#discount-error').text('');
                }
            }, 150);
        }
    });

    // When clicking on Papara payment buttons
    $('.pay-with-papara').on('click', function() {
        selectedButton = $(this);
        selectedDayCount = selectedButton.data('day-count');
        
        // Show selected package details
        $('.modal-title').html('<span id="package-days">' + selectedDayCount + '</span> GÜN <span id="package-price">' + (selectedButton.find('.price-text').html() || '') + '</span>');
        
        // Show all form fields for regular payments
        $('#quantity-group, #discount-group-checkbox, #email-help').show();
        $('#email-help-special-link').hide();
        $('#discount-group').removeClass('show');
        
        resetForm();
        $('#papara-email-modal').modal('show');
    });

    // When clicking on Papara special release button
    $('.pay-special-with-papara').on('click', function() {
        selectedButton = $(this);
        
        // Set modal title to button text
        $('.modal-title').text(selectedButton.text().trim());
        
        // Hide quantity and discount fields for special release
        $('#quantity-group, #discount-group-checkbox, #email-help').hide();
        $('#email-help-special-link').show();
        $('#papara-quantity').val('1');
        
        resetForm();
        $('#papara-email-modal').modal('show');
    });

    // When clicking on Papara support button
    $('.pay-support-with-papara').on('click', function() {
        let path = '';
        const lang = $('html').attr('lang') || 'tr';
        if (lang === 'tr') {
            path = '/tr';
        }

        fetch('http://localhost:5001/v1/papara', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'manual',
            body: JSON.stringify({
                language: lang,
                quantity: 1,
                redirectUrl: 'https://kozymacro.com' + path,
                support: true
            })
        })
        .then(response => response.json())
        .then(data => {
            window.location = data.url;
        })
        .catch(error => {
            console.error('Papara payment error:', error);
        });
    });

    // Reset form
    function resetForm() {
        $('#papara-email, #papara-quantity, #papara-discount').val('').removeClass('is-valid is-invalid');
        $('#papara-quantity').val('1');
        $('#email-error, #quantity-error, #discount-error').text('');
        $('#has-discount').prop('checked', false);
        $('#discount-group').removeClass('show');
    }

    // Email validation
    function validateEmail(email) {
        const emailInput = $('#papara-email');
        const errorDiv = $('#email-error');
        
        if (!email) {
            emailInput.addClass('is-invalid');
            errorDiv.text('Email address is required.');
            return false;
        }
        
        if (!isValidEmail(email)) {
            emailInput.addClass('is-invalid');
            errorDiv.text('Please enter a valid email address.');
            return false;
        }

        emailInput.removeClass('is-invalid');
        errorDiv.text('');
        return true;
    }

    // Quantity validation
    function validateQuantity(quantity) {
        const quantityInput = $('#papara-quantity');
        const errorDiv = $('#quantity-error');
        const numQuantity = parseInt(quantity);

        if (!quantity) {
            quantityInput.addClass('is-invalid');
            errorDiv.text('Quantity is required.');
            return false;
        }

        if (isNaN(numQuantity)) {
            quantityInput.addClass('is-invalid');
            errorDiv.text('Please enter a valid number.');
            return false;
        }

        if (numQuantity < 1) {
            quantityInput.addClass('is-invalid');
            errorDiv.text('You must select at least 1 quantity.');
            return false;
        }

        if (numQuantity > 100) {
            quantityInput.addClass('is-invalid');
            errorDiv.text('You can select a maximum of 100 quantities.');
            return false;
        }

        quantityInput.removeClass('is-invalid');
        errorDiv.text('');
        return true;
    }

    // Discount code validation
    function validateDiscount(code) {
        const discountInput = $('#papara-discount');
        const errorDiv = $('#discount-error');

        if (!code) {
            discountInput.removeClass('is-invalid');
            errorDiv.text('');
            return true;
        }

        // Discount code format: Only letters, numbers and dash
        if (!/^[A-Za-z0-9-]*$/.test(code)) {
            discountInput.addClass('is-invalid');
            errorDiv.text('Invalid characters.');
            return false;
        }

        discountInput.removeClass('is-invalid');
        errorDiv.text('');
        return true;
    }

    // When clicking on continue button
    $('#papara-continue').on('click', function() {
        const email = $('#papara-email').val();
        const quantity = $('#papara-quantity').val();
        const discount = $('#has-discount').is(':checked') ? $('#papara-discount').val() : '';

        // Check validations
        const isEmailValid = validateEmail(email);
        const isQuantityValid = validateQuantity(quantity);
        const isDiscountValid = validateDiscount(discount);

        if (!isEmailValid || !isQuantityValid || !isDiscountValid) {
            return;
        }

        let path = '';
        const lang = $('html').attr('lang') || 'tr';
        if (lang === 'tr') {
            path = '/tr';
        }

        // Prepare request body based on button type
        const requestBody = {
            email: email,
            language: lang,
            quantity: parseInt(quantity),
            redirectUrl: 'https://kozymacro.com' + path,
        };

        // Add fields based on button type
        if (selectedButton.hasClass('pay-special-with-papara')) {
            requestBody.specialName = selectedButton.data('name');
        } else {
            requestBody.dayCount = selectedDayCount;
            requestBody.discountCode = discount;
        }

        // Send request to backend
        fetch('http://localhost:5001/v1/papara', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'manual',
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            window.location = data.url;
        })
        .catch(error => {
            if (error.response && error.response.json) {
                return error.response.json();
            }
            throw error;
        })
        .then(errorData => {
            if (errorData && errorData.error) {
                const field = errorData.field;
                const errorMessage = errorData.error;

                if (field === 'email') {
                    $('#papara-email').addClass('is-invalid');
                    $('#email-error').text(errorMessage + '.');
                } else if (field === 'quantity') {
                    $('#papara-quantity').addClass('is-invalid');
                    $('#quantity-error').text(errorMessage + '.');
                } else if (field === 'discount') {
                    $('#papara-discount').addClass('is-invalid');
                    $('#discount-error').text(errorMessage + '.');
                }
            }
            console.error('Papara payment error:', error);
        });
    });

    // Email validation function
    function isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }
});

$(window).on('load',function(){
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const paymentId = urlParams.get('paymentId');
    const referenceId = urlParams.get('referenceId');

    if (status === "1") {
        $('#payResultSuccessContent').show();
        
        if (referenceId) {
            try {
                const decodedData = atob(referenceId);
                const [email, type, ...params] = decodedData.split('|');
                
                let message = '';
                if (type === 'day') {
                    message = `<p>Aktivasyon anahtarınız <strong>${email}</strong> adresine gönderilmiştir.</p>`;
                } else if (type === 'special') {
                    message = `
                        <p>Özel linkiniz 5dk içinde <strong>${email}</strong> adresine gönderilecektir.</p>
                        <p class="mt-2"><small>⚠️ Spam kutusunu kontrol etmeyi unutmayınız.</small></p>
                    `;
                } else if (type === 'support') {
                    message = `
                        <p>Destek paketini kullanmak için Discord üzerinden ticket açıp aşağıdaki referans numaranızı iletiniz.</p>
                        <p class="mt-3"><strong class="text-monospace">${paymentId}</strong></p>
                    `;
                }
                
                if (message) {
                    $('#payResultSuccessContent .payment-message').html(message);
                }
            } catch (e) {
                console.error('Error decoding referenceId:', e);
            }
        }
        
        $('#payResultModal').modal('show');
    } else if (status !== null) {
        $('#payResultFailContent').show();
        $('#payResultModal').modal('show');
    }
});
