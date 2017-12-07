/**
 * Get all siblings of an element
 * @param {Node} elem The element
 *
 * @return {Array} The siblings */


var _getSiblings = (function () {
    'use strict';
    window._getSiblings = window._getSiblings || {};

    function of(elem) {
        var siblings = [];
        var sibling = elem.parentNode.firstChild;

        for ( ; sibling; sibling = sibling.nextSibling ) {

            if ( sibling.nodeType === 1 && sibling !== elem ){
                 siblings.push( sibling );
            }

        }

        return siblings;
    }

    return {
        of: of
    }


})();

/**
 * nextUntil() gets all sibling elements following an element until you reach an element with a particular selector.
 * You can optionally filter sibling elements by a selector as well (for example, only returning elements with a certain
 * class or data attribute).
 */

var _nextUntil = (function () {
    'use strict';
    window._nextUntil = window._nextUntil || {};


    //iterate arguments
    function get(element, selector, filter) {

        //siblings cache array
        var siblings = [];
        //private variables
        element = element.nextElementSibling;

        while (element){
            //if we reached the limit, bail-out!
            if (element.matches(selector)) break;

            //after we check to see if element matches the selector
            //check to see if a filter was specified,
            //if a filter was specified, check to see if element matches the filter
            if (filter && !element.matches(filter)){
                element = element.nextElementSibling;
                continue;
            }

            //otherwise, push it to the siblings array
            siblings.push(element);

            //get the next sibling element
            element = element.nextElementSibling;
        }

        //return the siblings array
        return siblings;
    }

    return {
        get: get
    }


})();



var accordionMenu = (function (window) {
    'use strict';
    //export namespace to window object
    window.accordionMenu = window.accordionMenu || {};

    var acc = document.querySelectorAll('.accordion');

    //initialize all public vars and methods in global scope
    /*function init() {
        this.activateAccordion = activateAccordion();
        this.openIt = openIt();
        this.closeIt = closeIt();
    }*/

    function openIt(){
        return this.nextSibling.style.display = "block";
    }

    function closeIt() {
        return this.nextSibling.style.display = "none";
    }

    function activateAccordion() {
        for (var x = 0; x < acc.length; x++){
            //console.log(acc[x].classList.contains("active"));
            acc[x].addEventListener("click", function (event) {
                console.log('clicked');
                /* Toggle between adding and removing the "active" class,
				   to highlight the button that controls the panel */
                this.classList.toggle("active");

                /* Toggle between hiding and showing the active panel */
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight){
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            })
        }
    }

    return {
        /*init: init*/
        activateAccordion: activateAccordion,
        open: openIt,
        close: closeIt
    }


})(window);

accordionMenu.activateAccordion();


var app = (function (window) {
    'use strict';
    /* Export namespace to window object */
    window.app = window.app || {};
    //initialize all modules here...
    function init() {
        this.tmplMap = tmplMap.run();
        this.navMenu = navMenu.openHamburger();
        this.accordionMenu = accordionMenu.activateAccordion();
        this.gallery = gallery.setImageSrc();
        this.modal = modal.modalFn();
    }

    return {
        init: init
    }



})(window);

//events - a super-basic Javascript (publish subscribe) pattern
var events = {
    events: {},
    onThis: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    offThis: function(eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            };
        }
    },
    emitThis: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
    }
};

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

    function zoomDefault() {

    }

    function bindPreview(event) {
        var elem = event.target;
        var match;

        if (elem.classList.contains("small-preview")) {
            var imageSrc = elem.src;
            var previewState = [];
            //console.log('previewState array', previewState);
            zoomedImage.style.backgroundImage = 'url('+ imageSrc +')';
            previewState.push(elem.dataset);


            match = Object.keys(previewState).filter(function(state) {
                console.log('previewState array', previewState);
                var preview = previewState[state].id;
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
                return template;
            });
        }
        return match;

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




    container.addEventListener("click", bindPreview, false);
    zoomedImage.addEventListener("mouseenter", enlarge, false);
    zoomedImage.addEventListener("mousemove", move, false);
    zoomedImage.addEventListener("mouseleave", leave, false);

    return {
      setImageSrc: setImageSrc,
      bindPreview: bindPreview,
      enlarge: enlarge,
      move: move,
      leave: leave
    }

})(window);
// TODO: find a cleaner way to initialize this method...
gallery.setImageSrc();


var modal = (function () {
    'use strict';
    /* Export namespace to window object */
    window.modalModule = window.modalModule || {};

    function modalFn() {

        // Define the modal template

        // Get the modal
        var modal = document.querySelectorAll('#modalId');
        console.log(modal);
        // Get the button that opens the modal
        var btnEl = document.querySelector('.add_to_cart');
        console.log(btnEl);
        // Get the <span> element that closes the modal
        //var spanEl = document.querySelector('.close')[0];
        //console.log(spanEl);
        // When the user clicks on the button, open the modal
        btnEl.onclick = function() {
            return modal.style.display = 'block';
        };

        // When the user clicks on <span> (x), close the modal
        /*spanEl.onclick = function() {
            return modal.style.display = 'none';
        };*/

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
        return modal;
    }

    return {
        modalFn: modalFn
    }
})(event);



var navMenu = (function (window) {
    'use strict';
    window.navMenu = window.navMenu || {};

    var navEl = document.querySelector('#nav-menu');
    var hamburgerEl = document.querySelector('.icon');

    /*function init() {
        this.openHamburger = openHamburger();
    }*/

    function openHamburger() {
        this.classList.toggle("hamburger");
        if (navEl.className === 'navigation-menu') {
            navEl.className += "hamburger";
        } else {
            navEl.className = "navigation-menu";
        }
    }

    hamburgerEl.addEventListener('click', function (event) {
        console.log('mmm...hamburger');
        return openHamburger();
    });





    return {
        /*init: init*/
        openHamburger: openHamburger
    }
})(window);


var tmplMap = (function (window) {
    'use strict';
    /* Export namespace to window object */
    window.tmplMap = window.tmplMap || {};

    /* Cache DOM elements for the template */
    var template = document.getElementById("template-product-info");
    var tmplHtml = template.innerHTML;
    var _tmplData = "./js/data/productTemplate.json";

    /* Bind Events */

    /* Render to DOM */

    /* Utility Functions */
    // Ajax Request for json string
    function ajaxCall(callback) {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('GET', _tmplData, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // On success
                if (xhr.status == "200") {
                    if (callback) {
                        callback(xhr.responseText);
                    }
                } else {
                    console.log('status of xhr request', xhr.status);
                }
            }
        };
        xhr.send(null);
    }

    // Function accepts _tmplData as callback parameter, and parses it to template
    function loopData() {
        return (ajaxCall(function (response) {
            var parsedRes = JSON.parse(response),
            // Final HTML variable as an empty string
            productHtml = "";
            // Loop through _tmpData object, replace placeholder tags
            // with actual data, and generate final HTML
            for (var key in parsedRes) {
                if (parsedRes.hasOwnProperty(key)){
                    productHtml += tmplHtml.replace(/{{label}}/g, parsedRes[key]["label"])
                        .replace(/{{description}}/g, parsedRes[key]["description"])
                        .replace(/{{price}}/g, parsedRes[key]["price"])
                        .replace(/{{quantity}}/g, parsedRes[key]["quantity"])
                        .replace(/{{addCart}}/g, parsedRes[key]["addCart"])
                        .replace(/{{panelLabel}}{{collapsed}}/g, parsedRes[key].panelLabel.collapsed)

                }
            }

            Object.keys(parsedRes).filter(function (response) {
                console.log(response);
            });

            document.querySelector(".product_info").innerHTML = productHtml;

        }.bind(this)));
    }

    // Function takes the zoomGalleries element as an argument, and renders the value to the product name in template
    function setName(currentEl) {
        var name = currentEl;
        _render();
    }

    // Function instantiates loopData
    function run() {
        loopData();
    }



    return {
        run: run,
        ajaxCall: ajaxCall,
        setName: setName
    }

})(window);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9nZXRTaWJsaW5ncy5qcyIsIl9uZXh0VW50aWwuanMiLCJhY2NvcmRpb25NZW51LmpzIiwiYXBwLmpzIiwiZXZlbnRfZGlzcGF0Y2hlci5qcyIsImdhbGxlcnkuanMiLCJtb2RhbC5qcyIsIm5hdk1lbnUuanMiLCJ0bXBsTWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdldCBhbGwgc2libGluZ3Mgb2YgYW4gZWxlbWVudFxuICogQHBhcmFtIHtOb2RlfSBlbGVtIFRoZSBlbGVtZW50XG4gKlxuICogQHJldHVybiB7QXJyYXl9IFRoZSBzaWJsaW5ncyAqL1xuXG5cbnZhciBfZ2V0U2libGluZ3MgPSAoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB3aW5kb3cuX2dldFNpYmxpbmdzID0gd2luZG93Ll9nZXRTaWJsaW5ncyB8fCB7fTtcblxuICAgIGZ1bmN0aW9uIG9mKGVsZW0pIHtcbiAgICAgICAgdmFyIHNpYmxpbmdzID0gW107XG4gICAgICAgIHZhciBzaWJsaW5nID0gZWxlbS5wYXJlbnROb2RlLmZpcnN0Q2hpbGQ7XG5cbiAgICAgICAgZm9yICggOyBzaWJsaW5nOyBzaWJsaW5nID0gc2libGluZy5uZXh0U2libGluZyApIHtcblxuICAgICAgICAgICAgaWYgKCBzaWJsaW5nLm5vZGVUeXBlID09PSAxICYmIHNpYmxpbmcgIT09IGVsZW0gKXtcbiAgICAgICAgICAgICAgICAgc2libGluZ3MucHVzaCggc2libGluZyApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2libGluZ3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgb2Y6IG9mXG4gICAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIG5leHRVbnRpbCgpIGdldHMgYWxsIHNpYmxpbmcgZWxlbWVudHMgZm9sbG93aW5nIGFuIGVsZW1lbnQgdW50aWwgeW91IHJlYWNoIGFuIGVsZW1lbnQgd2l0aCBhIHBhcnRpY3VsYXIgc2VsZWN0b3IuXG4gKiBZb3UgY2FuIG9wdGlvbmFsbHkgZmlsdGVyIHNpYmxpbmcgZWxlbWVudHMgYnkgYSBzZWxlY3RvciBhcyB3ZWxsIChmb3IgZXhhbXBsZSwgb25seSByZXR1cm5pbmcgZWxlbWVudHMgd2l0aCBhIGNlcnRhaW5cbiAqIGNsYXNzIG9yIGRhdGEgYXR0cmlidXRlKS5cbiAqL1xuXG52YXIgX25leHRVbnRpbCA9IChmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHdpbmRvdy5fbmV4dFVudGlsID0gd2luZG93Ll9uZXh0VW50aWwgfHwge307XG5cblxuICAgIC8vaXRlcmF0ZSBhcmd1bWVudHNcbiAgICBmdW5jdGlvbiBnZXQoZWxlbWVudCwgc2VsZWN0b3IsIGZpbHRlcikge1xuXG4gICAgICAgIC8vc2libGluZ3MgY2FjaGUgYXJyYXlcbiAgICAgICAgdmFyIHNpYmxpbmdzID0gW107XG4gICAgICAgIC8vcHJpdmF0ZSB2YXJpYWJsZXNcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIHdoaWxlIChlbGVtZW50KXtcbiAgICAgICAgICAgIC8vaWYgd2UgcmVhY2hlZCB0aGUgbGltaXQsIGJhaWwtb3V0IVxuICAgICAgICAgICAgaWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIGJyZWFrO1xuXG4gICAgICAgICAgICAvL2FmdGVyIHdlIGNoZWNrIHRvIHNlZSBpZiBlbGVtZW50IG1hdGNoZXMgdGhlIHNlbGVjdG9yXG4gICAgICAgICAgICAvL2NoZWNrIHRvIHNlZSBpZiBhIGZpbHRlciB3YXMgc3BlY2lmaWVkLFxuICAgICAgICAgICAgLy9pZiBhIGZpbHRlciB3YXMgc3BlY2lmaWVkLCBjaGVjayB0byBzZWUgaWYgZWxlbWVudCBtYXRjaGVzIHRoZSBmaWx0ZXJcbiAgICAgICAgICAgIGlmIChmaWx0ZXIgJiYgIWVsZW1lbnQubWF0Y2hlcyhmaWx0ZXIpKXtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vb3RoZXJ3aXNlLCBwdXNoIGl0IHRvIHRoZSBzaWJsaW5ncyBhcnJheVxuICAgICAgICAgICAgc2libGluZ3MucHVzaChlbGVtZW50KTtcblxuICAgICAgICAgICAgLy9nZXQgdGhlIG5leHQgc2libGluZyBlbGVtZW50XG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIH1cblxuICAgICAgICAvL3JldHVybiB0aGUgc2libGluZ3MgYXJyYXlcbiAgICAgICAgcmV0dXJuIHNpYmxpbmdzO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldDogZ2V0XG4gICAgfVxuXG5cbn0pKCk7XG5cblxuIiwidmFyIGFjY29yZGlvbk1lbnUgPSAoZnVuY3Rpb24gKHdpbmRvdykge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvL2V4cG9ydCBuYW1lc3BhY2UgdG8gd2luZG93IG9iamVjdFxuICAgIHdpbmRvdy5hY2NvcmRpb25NZW51ID0gd2luZG93LmFjY29yZGlvbk1lbnUgfHwge307XG5cbiAgICB2YXIgYWNjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbicpO1xuXG4gICAgLy9pbml0aWFsaXplIGFsbCBwdWJsaWMgdmFycyBhbmQgbWV0aG9kcyBpbiBnbG9iYWwgc2NvcGVcbiAgICAvKmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVBY2NvcmRpb24gPSBhY3RpdmF0ZUFjY29yZGlvbigpO1xuICAgICAgICB0aGlzLm9wZW5JdCA9IG9wZW5JdCgpO1xuICAgICAgICB0aGlzLmNsb3NlSXQgPSBjbG9zZUl0KCk7XG4gICAgfSovXG5cbiAgICBmdW5jdGlvbiBvcGVuSXQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dFNpYmxpbmcuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZUl0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0U2libGluZy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGVBY2NvcmRpb24oKSB7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWNjLmxlbmd0aDsgeCsrKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coYWNjW3hdLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSk7XG4gICAgICAgICAgICBhY2NbeF0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJyk7XG4gICAgICAgICAgICAgICAgLyogVG9nZ2xlIGJldHdlZW4gYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgXCJhY3RpdmVcIiBjbGFzcyxcblx0XHRcdFx0ICAgdG8gaGlnaGxpZ2h0IHRoZSBidXR0b24gdGhhdCBjb250cm9scyB0aGUgcGFuZWwgKi9cbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIik7XG5cbiAgICAgICAgICAgICAgICAvKiBUb2dnbGUgYmV0d2VlbiBoaWRpbmcgYW5kIHNob3dpbmcgdGhlIGFjdGl2ZSBwYW5lbCAqL1xuICAgICAgICAgICAgICAgIHZhciBwYW5lbCA9IHRoaXMubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpe1xuICAgICAgICAgICAgICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyppbml0OiBpbml0Ki9cbiAgICAgICAgYWN0aXZhdGVBY2NvcmRpb246IGFjdGl2YXRlQWNjb3JkaW9uLFxuICAgICAgICBvcGVuOiBvcGVuSXQsXG4gICAgICAgIGNsb3NlOiBjbG9zZUl0XG4gICAgfVxuXG5cbn0pKHdpbmRvdyk7XG5cbmFjY29yZGlvbk1lbnUuYWN0aXZhdGVBY2NvcmRpb24oKTtcblxuIiwidmFyIGFwcCA9IChmdW5jdGlvbiAod2luZG93KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qIEV4cG9ydCBuYW1lc3BhY2UgdG8gd2luZG93IG9iamVjdCAqL1xuICAgIHdpbmRvdy5hcHAgPSB3aW5kb3cuYXBwIHx8IHt9O1xuICAgIC8vaW5pdGlhbGl6ZSBhbGwgbW9kdWxlcyBoZXJlLi4uXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgdGhpcy50bXBsTWFwID0gdG1wbE1hcC5ydW4oKTtcbiAgICAgICAgdGhpcy5uYXZNZW51ID0gbmF2TWVudS5vcGVuSGFtYnVyZ2VyKCk7XG4gICAgICAgIHRoaXMuYWNjb3JkaW9uTWVudSA9IGFjY29yZGlvbk1lbnUuYWN0aXZhdGVBY2NvcmRpb24oKTtcbiAgICAgICAgdGhpcy5nYWxsZXJ5ID0gZ2FsbGVyeS5zZXRJbWFnZVNyYygpO1xuICAgICAgICB0aGlzLm1vZGFsID0gbW9kYWwubW9kYWxGbigpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXQ6IGluaXRcbiAgICB9XG5cblxuXG59KSh3aW5kb3cpO1xuIiwiLy9ldmVudHMgLSBhIHN1cGVyLWJhc2ljIEphdmFzY3JpcHQgKHB1Ymxpc2ggc3Vic2NyaWJlKSBwYXR0ZXJuXG52YXIgZXZlbnRzID0ge1xuICAgIGV2ZW50czoge30sXG4gICAgb25UaGlzOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgICB9LFxuICAgIG9mZlRoaXM6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZW1pdFRoaXM6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAgICAgICAgICAgICAgIGZuKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwidmFyIGdhbGxlcnkgPSAoZnVuY3Rpb24od2luZG93KXtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyogRXhwb3J0IG5hbWVzcGFjZSB0byB3aW5kb3cgb2JqZWN0ICovXG4gICAgd2luZG93LmdhbGxlcnkgPSB3aW5kb3cuZ2FsbGVyeSB8fCB7fTtcblxuICAgIC8qIENhY2hlIERPTSBlbGVtZW50cyAqL1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ2FsbGVyeScpO1xuICAgIHZhciBmaXJzdFNtYWxsSW1hZ2UgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNtYWxsLXByZXZpZXcnKTtcbiAgICB2YXIgem9vbWVkSW1hZ2UgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnpvb21lZC1pbWFnZScpO1xuICAgIHZhciBsYWJlbFBhcmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0X2luZm8nKTtcbiAgICB2YXIgbGFiZWxzID0gbGFiZWxQYXJlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbGFiZWwnKTtcblxuXG5cblxuXG4gICAgZnVuY3Rpb24gc2V0SW1hZ2VTcmMoKSB7XG4gICAgICAgIHJldHVybiB6b29tZWRJbWFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcrIGZpcnN0U21hbGxJbWFnZS5zcmMgKycpJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB6b29tRGVmYXVsdCgpIHtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJpbmRQcmV2aWV3KGV2ZW50KSB7XG4gICAgICAgIHZhciBlbGVtID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgbWF0Y2g7XG5cbiAgICAgICAgaWYgKGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwic21hbGwtcHJldmlld1wiKSkge1xuICAgICAgICAgICAgdmFyIGltYWdlU3JjID0gZWxlbS5zcmM7XG4gICAgICAgICAgICB2YXIgcHJldmlld1N0YXRlID0gW107XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdwcmV2aWV3U3RhdGUgYXJyYXknLCBwcmV2aWV3U3RhdGUpO1xuICAgICAgICAgICAgem9vbWVkSW1hZ2Uuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybCgnKyBpbWFnZVNyYyArJyknO1xuICAgICAgICAgICAgcHJldmlld1N0YXRlLnB1c2goZWxlbS5kYXRhc2V0KTtcblxuXG4gICAgICAgICAgICBtYXRjaCA9IE9iamVjdC5rZXlzKHByZXZpZXdTdGF0ZSkuZmlsdGVyKGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3ByZXZpZXdTdGF0ZSBhcnJheScsIHByZXZpZXdTdGF0ZSk7XG4gICAgICAgICAgICAgICAgdmFyIHByZXZpZXcgPSBwcmV2aWV3U3RhdGVbc3RhdGVdLmlkO1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IE9iamVjdC5rZXlzKGxhYmVscykuZmlsdGVyKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRFbGVtZW50ID0gbGFiZWxzW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlU3RhdGUgPSBsYWJlbHNbaW5kZXhdLmRhdGFzZXQubGFiZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlbXBsYXRlU3RhdGUgPT09IHByZXZpZXcpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gX25leHRVbnRpbC5nZXQoc2VsZWN0ZWRFbGVtZW50LCAnLmJyZWFrbGluZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVuc2VsZWN0ZWQgPSBfZ2V0U2libGluZ3Mub2Yoc2VsZWN0ZWRFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQuZmlsdGVyKGZ1bmN0aW9uIChzZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL21vZGFsIGJ1dHRvbiBsb2dpY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3QuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWRkX3RvX2NhcnRcIikpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWRkY2FydERhdGEgPSB0aGlzLmRhdGFzZXQuYWRkY2FydCA9IHByZXZpZXc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2FydCcsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoYWRkY2FydERhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbmVlZHMgbW9kYWwgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wcm9kdWN0IGFjY29yZGlvbiBsb2dpY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3QuY2xhc3NMaXN0LmNvbnRhaW5zKFwicHJvZHVjdF9hY2NvcmRpb25cIikpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCByb3cubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1t4XS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYW5lbCA9IHRoaXMubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYW5lbC5zdHlsZS5tYXhIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3QuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHVuc2VsZWN0ZWQuZmlsdGVyKGZ1bmN0aW9uICh1bnNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1bnNlbGVjdC5jbGFzc0xpc3QuY29udGFpbnMoXCJzZWxlY3RlZFwiKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuc2VsZWN0LmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5zZWxlY3Quc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuc2VsZWN0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXRjaDtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVubGFyZ2UoKSB7XG4gICAgICAgIC8vIE1ha2UgdGhlIGRpbWVuc2lvbnMgbGFyZ2VyIHRoZW4gYWN0dWFsIHNpemUgb2YgZWxlbWVudFxuICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCIxNTAlXCI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW92ZShldmVudCkge1xuICAgICAgICAvLyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZ2l2ZXMgdXMgdmFyaW91cyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgcG9zaXRpb24gb2YgdGhlIGVsZW1lbnQuXG4gICAgICAgIHZhciBkaW1lbnNpb25zID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBjdXJzb3IgaW5zaWRlIHRoZSBlbGVtZW50IChpbiBwaXhlbHMpLlxuICAgICAgICB2YXIgeCA9IGV2ZW50LmNsaWVudFggLSBkaW1lbnNpb25zLmxlZnQ7XG4gICAgICAgIHZhciB5ID0gZXZlbnQuY2xpZW50WSAtIGRpbWVuc2lvbnMudG9wO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIGN1cnNvciBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHdpZHRoL2hlaWdodCBvZiB0aGUgZWxlbWVudC5cbiAgICAgICAgdmFyIHhwZXJjZW50ID0gTWF0aC5yb3VuZCgxMDAgLyAoZGltZW5zaW9ucy53aWR0aCAvIHgpKTtcbiAgICAgICAgdmFyIHlwZXJjZW50ID0gTWF0aC5yb3VuZCgxMDAgLyAoZGltZW5zaW9ucy5oZWlnaHQgLyB5KSk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBiYWNrZ3JvdW5kIHBvc2l0aW9uIG9mIHRoZSBpbWFnZS5cbiAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSB4cGVyY2VudCsnJSAnICsgeXBlcmNlbnQrJyUnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxlYXZlKCkge1xuICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb3ZlclwiO1xuICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IFwiY2VudGVyXCI7XG4gICAgfVxuXG5cblxuXG4gICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBiaW5kUHJldmlldywgZmFsc2UpO1xuICAgIHpvb21lZEltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIGVubGFyZ2UsIGZhbHNlKTtcbiAgICB6b29tZWRJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdmUsIGZhbHNlKTtcbiAgICB6b29tZWRJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBsZWF2ZSwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNldEltYWdlU3JjOiBzZXRJbWFnZVNyYyxcbiAgICAgIGJpbmRQcmV2aWV3OiBiaW5kUHJldmlldyxcbiAgICAgIGVubGFyZ2U6IGVubGFyZ2UsXG4gICAgICBtb3ZlOiBtb3ZlLFxuICAgICAgbGVhdmU6IGxlYXZlXG4gICAgfVxuXG59KSh3aW5kb3cpO1xuLy8gVE9ETzogZmluZCBhIGNsZWFuZXIgd2F5IHRvIGluaXRpYWxpemUgdGhpcyBtZXRob2QuLi5cbmdhbGxlcnkuc2V0SW1hZ2VTcmMoKTtcblxuIiwidmFyIG1vZGFsID0gKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyogRXhwb3J0IG5hbWVzcGFjZSB0byB3aW5kb3cgb2JqZWN0ICovXG4gICAgd2luZG93Lm1vZGFsTW9kdWxlID0gd2luZG93Lm1vZGFsTW9kdWxlIHx8IHt9O1xuXG4gICAgZnVuY3Rpb24gbW9kYWxGbigpIHtcblxuICAgICAgICAvLyBEZWZpbmUgdGhlIG1vZGFsIHRlbXBsYXRlXG5cbiAgICAgICAgLy8gR2V0IHRoZSBtb2RhbFxuICAgICAgICB2YXIgbW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjbW9kYWxJZCcpO1xuICAgICAgICBjb25zb2xlLmxvZyhtb2RhbCk7XG4gICAgICAgIC8vIEdldCB0aGUgYnV0dG9uIHRoYXQgb3BlbnMgdGhlIG1vZGFsXG4gICAgICAgIHZhciBidG5FbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZGRfdG9fY2FydCcpO1xuICAgICAgICBjb25zb2xlLmxvZyhidG5FbCk7XG4gICAgICAgIC8vIEdldCB0aGUgPHNwYW4+IGVsZW1lbnQgdGhhdCBjbG9zZXMgdGhlIG1vZGFsXG4gICAgICAgIC8vdmFyIHNwYW5FbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZScpWzBdO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHNwYW5FbCk7XG4gICAgICAgIC8vIFdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIHRoZSBidXR0b24sIG9wZW4gdGhlIG1vZGFsXG4gICAgICAgIGJ0bkVsLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBXaGVuIHRoZSB1c2VyIGNsaWNrcyBvbiA8c3Bhbj4gKHgpLCBjbG9zZSB0aGUgbW9kYWxcbiAgICAgICAgLypzcGFuRWwub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH07Ki9cblxuICAgICAgICAvLyBXaGVuIHRoZSB1c2VyIGNsaWNrcyBhbnl3aGVyZSBvdXRzaWRlIG9mIHRoZSBtb2RhbCwgY2xvc2UgaXRcbiAgICAgICAgd2luZG93Lm9uY2xpY2sgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PSBtb2RhbCkge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBtb2RhbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBtb2RhbEZuOiBtb2RhbEZuXG4gICAgfVxufSkoZXZlbnQpO1xuXG5cbiIsInZhciBuYXZNZW51ID0gKGZ1bmN0aW9uICh3aW5kb3cpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgd2luZG93Lm5hdk1lbnUgPSB3aW5kb3cubmF2TWVudSB8fCB7fTtcblxuICAgIHZhciBuYXZFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuYXYtbWVudScpO1xuICAgIHZhciBoYW1idXJnZXJFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pY29uJyk7XG5cbiAgICAvKmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIHRoaXMub3BlbkhhbWJ1cmdlciA9IG9wZW5IYW1idXJnZXIoKTtcbiAgICB9Ki9cblxuICAgIGZ1bmN0aW9uIG9wZW5IYW1idXJnZXIoKSB7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZShcImhhbWJ1cmdlclwiKTtcbiAgICAgICAgaWYgKG5hdkVsLmNsYXNzTmFtZSA9PT0gJ25hdmlnYXRpb24tbWVudScpIHtcbiAgICAgICAgICAgIG5hdkVsLmNsYXNzTmFtZSArPSBcImhhbWJ1cmdlclwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmF2RWwuY2xhc3NOYW1lID0gXCJuYXZpZ2F0aW9uLW1lbnVcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbWJ1cmdlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtbW0uLi5oYW1idXJnZXInKTtcbiAgICAgICAgcmV0dXJuIG9wZW5IYW1idXJnZXIoKTtcbiAgICB9KTtcblxuXG5cblxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyppbml0OiBpbml0Ki9cbiAgICAgICAgb3BlbkhhbWJ1cmdlcjogb3BlbkhhbWJ1cmdlclxuICAgIH1cbn0pKHdpbmRvdyk7XG5cbiIsInZhciB0bXBsTWFwID0gKGZ1bmN0aW9uICh3aW5kb3cpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyogRXhwb3J0IG5hbWVzcGFjZSB0byB3aW5kb3cgb2JqZWN0ICovXG4gICAgd2luZG93LnRtcGxNYXAgPSB3aW5kb3cudG1wbE1hcCB8fCB7fTtcblxuICAgIC8qIENhY2hlIERPTSBlbGVtZW50cyBmb3IgdGhlIHRlbXBsYXRlICovXG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZW1wbGF0ZS1wcm9kdWN0LWluZm9cIik7XG4gICAgdmFyIHRtcGxIdG1sID0gdGVtcGxhdGUuaW5uZXJIVE1MO1xuICAgIHZhciBfdG1wbERhdGEgPSBcIi4vanMvZGF0YS9wcm9kdWN0VGVtcGxhdGUuanNvblwiO1xuXG4gICAgLyogQmluZCBFdmVudHMgKi9cblxuICAgIC8qIFJlbmRlciB0byBET00gKi9cblxuICAgIC8qIFV0aWxpdHkgRnVuY3Rpb25zICovXG4gICAgLy8gQWpheCBSZXF1ZXN0IGZvciBqc29uIHN0cmluZ1xuICAgIGZ1bmN0aW9uIGFqYXhDYWxsKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm92ZXJyaWRlTWltZVR5cGUoXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIub3BlbignR0VUJywgX3RtcGxEYXRhLCB0cnVlKTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgICAvLyBPbiBzdWNjZXNzXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gXCIyMDBcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N0YXR1cyBvZiB4aHIgcmVxdWVzdCcsIHhoci5zdGF0dXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgfVxuXG4gICAgLy8gRnVuY3Rpb24gYWNjZXB0cyBfdG1wbERhdGEgYXMgY2FsbGJhY2sgcGFyYW1ldGVyLCBhbmQgcGFyc2VzIGl0IHRvIHRlbXBsYXRlXG4gICAgZnVuY3Rpb24gbG9vcERhdGEoKSB7XG4gICAgICAgIHJldHVybiAoYWpheENhbGwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgcGFyc2VkUmVzID0gSlNPTi5wYXJzZShyZXNwb25zZSksXG4gICAgICAgICAgICAvLyBGaW5hbCBIVE1MIHZhcmlhYmxlIGFzIGFuIGVtcHR5IHN0cmluZ1xuICAgICAgICAgICAgcHJvZHVjdEh0bWwgPSBcIlwiO1xuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIF90bXBEYXRhIG9iamVjdCwgcmVwbGFjZSBwbGFjZWhvbGRlciB0YWdzXG4gICAgICAgICAgICAvLyB3aXRoIGFjdHVhbCBkYXRhLCBhbmQgZ2VuZXJhdGUgZmluYWwgSFRNTFxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcnNlZFJlcykge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZWRSZXMuaGFzT3duUHJvcGVydHkoa2V5KSl7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RIdG1sICs9IHRtcGxIdG1sLnJlcGxhY2UoL3t7bGFiZWx9fS9nLCBwYXJzZWRSZXNba2V5XVtcImxhYmVsXCJdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL3t7ZGVzY3JpcHRpb259fS9nLCBwYXJzZWRSZXNba2V5XVtcImRlc2NyaXB0aW9uXCJdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL3t7cHJpY2V9fS9nLCBwYXJzZWRSZXNba2V5XVtcInByaWNlXCJdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL3t7cXVhbnRpdHl9fS9nLCBwYXJzZWRSZXNba2V5XVtcInF1YW50aXR5XCJdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL3t7YWRkQ2FydH19L2csIHBhcnNlZFJlc1trZXldW1wiYWRkQ2FydFwiXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC97e3BhbmVsTGFiZWx9fXt7Y29sbGFwc2VkfX0vZywgcGFyc2VkUmVzW2tleV0ucGFuZWxMYWJlbC5jb2xsYXBzZWQpXG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHBhcnNlZFJlcykuZmlsdGVyKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2R1Y3RfaW5mb1wiKS5pbm5lckhUTUwgPSBwcm9kdWN0SHRtbDtcblxuICAgICAgICB9LmJpbmQodGhpcykpKTtcbiAgICB9XG5cbiAgICAvLyBGdW5jdGlvbiB0YWtlcyB0aGUgem9vbUdhbGxlcmllcyBlbGVtZW50IGFzIGFuIGFyZ3VtZW50LCBhbmQgcmVuZGVycyB0aGUgdmFsdWUgdG8gdGhlIHByb2R1Y3QgbmFtZSBpbiB0ZW1wbGF0ZVxuICAgIGZ1bmN0aW9uIHNldE5hbWUoY3VycmVudEVsKSB7XG4gICAgICAgIHZhciBuYW1lID0gY3VycmVudEVsO1xuICAgICAgICBfcmVuZGVyKCk7XG4gICAgfVxuXG4gICAgLy8gRnVuY3Rpb24gaW5zdGFudGlhdGVzIGxvb3BEYXRhXG4gICAgZnVuY3Rpb24gcnVuKCkge1xuICAgICAgICBsb29wRGF0YSgpO1xuICAgIH1cblxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBydW46IHJ1bixcbiAgICAgICAgYWpheENhbGw6IGFqYXhDYWxsLFxuICAgICAgICBzZXROYW1lOiBzZXROYW1lXG4gICAgfVxuXG59KSh3aW5kb3cpO1xuIl19
