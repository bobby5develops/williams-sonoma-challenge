var gallery = (function(window){
    'use strict';
    /* Export namespace to window object */
    window.gallery = window.gallery || {};

    /* Cache DOM elements */
    var container = document.querySelector('#gallery');
    var firstSmallImage = container.querySelector('.small-preview');
    var zoomedImage = container.querySelector('.zoomed-image');
    var labelParent = document.querySelector('.product_info');
    var labels = labelParent.getElementsByClassName('label');



    function setImageSrc() {
        return zoomedImage.style.backgroundImage = 'url('+ firstSmallImage.src +')';
    }

    function setDefaultTmpl(event) {
        var tmpl = event.target;
        var match;

        console.log(typeof tmpl);//object in this context...

    }


    function bindPreview(event) {
        var elem = event.target;
        var match;

        if (elem.classList.contains("small-preview")) {
            var imageSrc = elem.src;
            var previewState = [];

            zoomedImage.style.backgroundImage = 'url('+ imageSrc +')';
            previewState.push(elem.dataset);


            match = Object.keys(previewState).filter(function(state) {
                var preview = previewState[state].id;
                console.log('preview', preview);

                var template = Object.keys(labels).filter(function (index) {
                    var selectedElement = labels[index];
                    var templateState = labels[index].dataset.label;

                    if (templateState === preview){
                        var selected = _nextUntil.get(selectedElement, '.breakline');
                        var unselected = _getSiblings.of(selectedElement);

                        selected.filter(function (select) {
                            selectedElement.style.display = "block";
                            //modal button logic
                            if (select.classList.contains("add_to_cart")){
                                select.addEventListener('click', function () {
                                    var addcartData = this.dataset.addcart = preview;
                                    console.log('cart', this);
                                    alert(addcartData);
                                }, false);
                                //needs modal template
                            }
                            //product accordion logic
                            if (select.classList.contains("product_accordion")){
                                var row = select.querySelectorAll('.accordion');
                                for (var x = 0; x < row.length; x++) {
                                    row[x].addEventListener('click', function () {
                                        this.classList.toggle('active');
                                        var panel = this.nextElementSibling;
                                        if (panel.style.maxHeight) {
                                            panel.style.maxHeight = null;
                                        } else {
                                            panel.style.maxHeight = panel.scrollHeight + "px";
                                        }

                                    }, false);
                                }
                            }

                            select.classList.remove("selected");
                            return select.classList.add("selected");
                        });

                        unselected.filter(function (unselect) {
                            if (unselect.classList.contains("selected")){
                                unselect.classList.remove("selected");
                                unselect.style.display = "block";
                            }else {
                                unselect.style.display = "none";
                            }
                        });


                    }

                });
            });
        }
        //return match;

    }

    function enlarge() {
        // Make the dimensions larger then actual size of element
        this.style.backgroundSize = "150%";
    }

    function move(event) {
        // getBoundingClientRect gives us various information about the position of the element.
        var dimensions = this.getBoundingClientRect();

        // Calculate the position of the cursor inside the element (in pixels).
        var x = event.clientX - dimensions.left;
        var y = event.clientY - dimensions.top;

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


    window.addEventListener("load", setImageSrc, false);
    window.addEventListener("load", setDefaultTmpl, false);
    container.addEventListener("click", bindPreview, false);
    zoomedImage.addEventListener("mouseenter", enlarge, false);
    zoomedImage.addEventListener("mousemove", move, false);
    zoomedImage.addEventListener("mouseleave", leave, false);


    return {
      setImageSrc: setImageSrc,
      setDefaultTmpl: setDefaultTmpl,
      bindPreview: bindPreview,
      enlarge: enlarge,
      move: move,
      leave: leave
    }

})(window);


