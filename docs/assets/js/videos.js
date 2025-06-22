$(document).ready(function() {
    let videoViewTemplate = 
    '<h1 style="padding-top: 80px; margin-top: -60px;"></h1>' + 
    '<div class="card text-white bg-dark">' + 
        '<div class="card-body">' + 
            '<h5 class="card-title">--title--</h5>' + 
            '<div class="embed-responsive embed-responsive-16by9">' + 
                '<iframe src="https://www.youtube.com/embed/--video-id--?autoplay=0&mute=0&start=--time--" ' + 
                'frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen ' + 
                'style="position:absolute;top:0;left:0;width:100%;height:100%;" ' + 
                'title="--title--"></iframe>' +
            '</div>' + 
        '</div>' +
    '</div>';

    if (window.location.hash != "") {
        setTimeout(function() {
            $('a[href="' + window.location.hash + '"]').trigger('click');
        }, 100);
    } 
    else {
        setTimeout(function() {
            $('a[href="#general-first-settings"]').trigger('click');
        }, 100);
    }

    function showVideo(title, videoId, time) {
        const videoHtml = videoViewTemplate
        .replace('--title--', title)
        .replace(/--video-id--/g, videoId)
        .replace('--time--', time);

        $('#video-wrapper').html(videoHtml);
    }

    $(document).on("click", ".video-item", function(){
        let current = $(this);
        let title = current.text();
        let videoId = current.data('video-id');
        let time = current.data('time');
        if (time == undefined) time = "0";

        if (current.attr('href').startsWith('#general')) {
            subtitle = "";
        }
        
        showVideo(title, videoId, time);
    });
});