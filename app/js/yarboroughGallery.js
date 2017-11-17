// Avoid `console` errors in browsers that lack a console.
(function(window){
    function define_library() {
        var yarboroughGallery = {};
        yarboroughGallery.init = function(el) {

            var product_container = document.querySelector(el);
            if(!product_container) {
                console.error('No product_container element');
                return;
            }

            var firstSmallImage = product_container.querySelector('.small-preview');
            var zoomedImage = product_container.querySelector('.zoomed-image');

            if(!zoomedImage) {
                console.error('No zoomed image element');
                return;
            }

            if(!firstSmallImage) {
                console.error('No preview images on page');
                return;
            }
            else {
                // Set the source of the zoomed image.
                zoomedImage.style.backgroundImage = 'url('+ firstSmallImage.src +')';
            }

            // Change the selected image to be zoomed when clicking on the previews.
            product_container.addEventListener("click", function (event) {
                var elem = event.target;

                if (elem.classList.contains("small-preview")) {
                    var imageSrc = elem.src;
                    zoomedImage.style.backgroundImage = 'url('+ imageSrc +')';
                }
            });

            // Zoom image on mouse enter.
            zoomedImage.addEventListener('mouseenter', function(e) {
                // Make the dimensions larger then actual size of element
                this.style.backgroundSize = "250%";
            }, false);


            // Show different parts of image depending on cursor position.
            zoomedImage.addEventListener('mousemove', function(e) {

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

            }, false);


            // When leaving the product_container zoom out the image back to normal size.
            zoomedImage.addEventListener('mouseleave', function(e) {
                this.style.backgroundSize = "cover";
                this.style.backgroundPosition = "center";
            }, false);

        };
        return yarboroughGallery;
    }

    // Add the yarboroughGallery object to global scope.
    if(typeof(yarboroughGallery) === 'undefined') {
        window.yarboroughGallery = define_library();
    }
    else{
        console.log("Library already defined.");
    }
})(window);
