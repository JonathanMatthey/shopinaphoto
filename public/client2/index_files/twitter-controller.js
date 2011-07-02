var timer;

jQuery(document).ready(function() {

getTweets();

});

function getTweets()
{
    clearTimeout(timer);

        jQuery.post(blogURL + '/getTweets.php?theaccount=0', function(data) {
            jQuery('#twitter-content-main').html(data);
        });
/*
        jQuery.post(blogURL + '/getTweets.php?theaccount=1', function(data) {
            jQuery('#twitter-content-news').html(data);
        });
*/

        /*jQuery.post(blogURL + '/getTweets.php?theaccount=2', function(data) {
            jQuery('#twitter-content-pix').html(data);
        });*/

    timer = setTimeout('getTweets()', 60000);
}
