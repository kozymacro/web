$(document).ready(function() {
    $(document).on("click", ".buy-top", function() {
        $('.buy-bottom').trigger('click');
    });
});
