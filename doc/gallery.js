var gallery = (function(window){
    'use strict';
    //export namespace to window object
    window.gallery = window.gallery || {};

    var init = function (el) {
        var galleryEl = document.querySelector(el);
        var zoomedImage = galleryEl.querySelector('.zoomed-image');
        this.zoom = zoom();
        this.enlarge = enlarge();
        this.move = move();
        this.leave = leave();
        this.setImageSrc = setImageSrc();
        this.logger = logger();
    };

    function setImageSrc() {
        var firstSmallImage = galleryEl.querySelector('.small-preview');
        if(!firstSmallImage) {
            console.error('No preview images on page');
            return;
        }
        else {
            // Set the source of the zoomed image.
            zoomedImage.style.backgroundImage = 'url('+ firstSmallImage.src +')';
        }
    }

    function logger() {
        if(!galleryEl) {
            console.error('No galleryEl element');
            return;
        }

        if(!zoomedImage) {
            console.error('No zoomed image element');
            return;
        }
    }

    function zoom(event) {
        var elem = event.target;

        if (elem.classList.contains("small-preview")) {
            var imageSrc = elem.src;
            zoomedImage.style.backgroundImage = 'url('+ imageSrc +')';
        }
    }

    function enlarge() {
        // Make the dimensions larger then actual size of element
        this.style.backgroundSize = "250%";
    }

    function move() {
        // getBoundingClientRect gives us various information about the position of the element.
        var dimensions = this.getBoundingClientRect();

        // Calculate the position of the cursor inside the element (in pixels).
        var x = e.clientX - dimensions.left;
        var y = e.clientY - dimensions.top;

        // Calculate the position of the cursor as a percentage of the total width/height of the element.
        var xpercent = Math.round(100 / (dimensions.width / x));
        var ypercent = Math.round(100 / (dimensions.height / y));

        // Update the background position of the image.
        this.style.backgroundPosition = xpercent+'% ' + ypercent+'%';
    }

    function leave() {
        this.style.backgroundSize = "cover";
        this.style.backgroundPosition = "center";
    }

    galleryEl.addEventListener("click", zoom, false);
    zoomedImage.addEventListener("mouseenter", enlarge, false);
    zoomedImage.addEventListener("mousemove", move, false);
    zoomedImage.addEventListener("mouseleave", leave, false);

    return {
      init: init
    }

})(window);
