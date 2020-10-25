$(document).ready(function() {
    let videoViewTemplate = '<h1 style="padding-top: 80px; margin-top: -60px;"></h1>' + 
        '<div class="card text-white bg-dark">' + 
            '<div class="card-body">' + 
                '<h5 class="card-title">--title--</h5>' + 
                '<div class="embed-responsive embed-responsive-16by9">' + 
                    '<iframe loading="lazy" class="embed-responsive-item" src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fmacrokozy%2Fvideos%2F--video-id--%2F&show_text=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' + 
                '</div>' + 
            '</div>' + 
            '<div class="card-footer text-muted"><small>--video-not-working-- <a href="https://www.facebook.com/macrokozy/videos/--video-id--" target="_blank" class="text-muted">--video-not-working-here--</a>.</small></div>' +
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

    function showVideo(title, videoId) {
        let langContentElement = $('#video-content-by-lang');
        let videoHtml = videoViewTemplate
        .replace('--title--', title)
        .replaceAll('--video-id--', videoId)
        .replace('--video-not-working--', langContentElement.data('video-not-working'))
        .replace('--video-not-working-here--', langContentElement.data('video-not-working-here'));

        $('#video-wrapper').html(videoHtml);
    }

    $(document).on("click", ".video-item", function(){
        let current = $(this);
        let title = current.text();
        let videoId = current.data('video-id');

        if (current.attr('href').startsWith('#general')) {
            subtitle = "";
        }
        
        showVideo(title, videoId);
    });
});