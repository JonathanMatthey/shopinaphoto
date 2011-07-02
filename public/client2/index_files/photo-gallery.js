/*

Script:     WENN Photo Gallery
Author:     Scott Gray
Version:    1.0

*/

var curImageIndex = 1;
function getImage(direction){
    // This function will get the requested image.

    imageCount = (galleryImages.length * 1) - 1;

    if  (direction == "forward")
    {
        if (curImageIndex != (imageCount * 1))
        {
            curImageIndex = (curImageIndex * 1) + 1;
        }
        else
        {
            curImageIndex = 0;
        }
    }

    if (direction == "backward")
    {
        if (curImageIndex != 0 )
        {
            curImageIndex = (curImageIndex * 1) - 1;
        }
        else
        {
            curImageIndex = imageCount;
        }
    }
    Shadowbox.init();
    document.getElementById('image-viewer-container').src = galleryImages[curImageIndex];
    document.getElementById('gallery-shadow-link').href = "javascript: openShadowBox('" + galleryImages[curImageIndex] + "');";
    if((curImageIndex * 1) < 9)
    {
        counter = "0" + ((curImageIndex * 1) + 1);
    }
    else
    {
        counter = ((curImageIndex * 1) + 1);
    }
    document.getElementById('image-counter').innerHTML = counter + ' of ' + ((imageCount *1) + 1);
    //document.getElementById('image-viewer-celeb-name').innerHTML = celebNamesArray[curImage];
    //document.getElementById('image-viewer-location').innerHTML = locationsArray[curImage];
    if(typeof(captionsArray) != "undefined")
    {
        if(captionsArray[curImageIndex] != '')
        {
            document.getElementById('main-gallery-write-panel').style.height = '54px';
            document.getElementById('image-viewer-caption').innerHTML = captionsArray[curImageIndex];
        }
        else
        {
            document.getElementById('image-viewer-caption').innerHTML = captionsArray[curImageIndex];
            document.getElementById('main-gallery-write-panel').style.height = '0px';
        }
    }
    else
    {
        if(typeof(document.getElementById('image-viewer-caption')) == 'undefined')
        {
            document.getElementById('image-viewer-caption').style.height = 0;
        }
    }
    sg_preload_inline(galleryImages);
}

function openShadowBox(image){
    /*
        This function was written to ensure that the correct image opens in the
        Shadow Box.
    */

    Shadowbox.open({

        content: image,
        player: "img"


    });

}

function sg_preload_old(theImages) {

    // THIS FUNCTION IS DEPRECATED (original preloader )#########################
    //Takes the images passed as an array, and preloads them.
    //i=1;
    var img = new Array;
    return;
    theImages_count = theImages.length;
    //if(theImages_count >= 1){theImages_count=1;}
//    for(i in theImages)
    for(i=0;i<theImages_count;i++)
    {
       img[i] = new Image();
       img[i].src = theImages[i];
    }
}

function sg_preload(theImages) {
    //Takes the images passed as an array, and preloads them.
    //i=1;

    theImages_count = theImages.length; // Get the count of images in the current gallery.
    theCurrentImage = curImageIndex;    /// Get the the image currently being viewed.

    var img = new Array; // Create a new array of images to load.
    // Check to ensure that we are not going to load more images than are available.
    if (theCurrentImage == 1)
    {
        img[0] = new Image();
        img[1] = new Image();
        img[0].src = theImages[((theCurrentImage * 1))]; // Add the next image to the cache.
        img[1].src = theImages[((theCurrentImage * 1) + 1)]; // Add the second image in line to the cache.
    }




    return;
}

function sg_preload_inline(theImages) {
    //Takes the images passed as an array, and preloads them.
    //i=1;

    theImages_count = theImages.length; // Get the count of images in the current gallery.
    theCurrentImage = curImageIndex;    /// Get the the image currently being viewed.
    var img = new Array; // Create a new array of images to load.
    // Check to ensure that we are not going to load more images than are available.
    if(((theCurrentImage*1) + 3) <= (theImages_count*1))
    {
    img[2] = new Image();
    img[2].src = theImages[(theCurrentImage*1)+2]; // Preload the next image to the cache.
    //alert(((theCurrentImage*1) + 3));
    }



    return;

    //if(theImages_count >= 1){theImages_count=1;}
/*    for(i in theImages)
    for(i=0;i<theImages_count;i++)
    {
       img[i] = new Image();
       img[i].src = theImages[i];
    }*/
}
