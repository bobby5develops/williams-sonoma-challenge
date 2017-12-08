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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9nZXRTaWJsaW5ncy5qcyIsIl9uZXh0VW50aWwuanMiLCJhY2NvcmRpb25NZW51LmpzIiwiYXBwLmpzIiwiZXZlbnRfZGlzcGF0Y2hlci5qcyIsImdhbGxlcnkuanMiLCJtb2RhbC5qcyIsIm5hdk1lbnUuanMiLCJ0bXBsTWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBHZXQgYWxsIHNpYmxpbmdzIG9mIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB7Tm9kZX0gZWxlbSBUaGUgZWxlbWVudFxuICpcbiAqIEByZXR1cm4ge0FycmF5fSBUaGUgc2libGluZ3MgKi9cblxuXG52YXIgX2dldFNpYmxpbmdzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgd2luZG93Ll9nZXRTaWJsaW5ncyA9IHdpbmRvdy5fZ2V0U2libGluZ3MgfHwge307XG5cbiAgICBmdW5jdGlvbiBvZihlbGVtKSB7XG4gICAgICAgIHZhciBzaWJsaW5ncyA9IFtdO1xuICAgICAgICB2YXIgc2libGluZyA9IGVsZW0ucGFyZW50Tm9kZS5maXJzdENoaWxkO1xuXG4gICAgICAgIGZvciAoIDsgc2libGluZzsgc2libGluZyA9IHNpYmxpbmcubmV4dFNpYmxpbmcgKSB7XG5cbiAgICAgICAgICAgIGlmICggc2libGluZy5ub2RlVHlwZSA9PT0gMSAmJiBzaWJsaW5nICE9PSBlbGVtICl7XG4gICAgICAgICAgICAgICAgIHNpYmxpbmdzLnB1c2goIHNpYmxpbmcgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNpYmxpbmdzO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIG9mOiBvZlxuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBuZXh0VW50aWwoKSBnZXRzIGFsbCBzaWJsaW5nIGVsZW1lbnRzIGZvbGxvd2luZyBhbiBlbGVtZW50IHVudGlsIHlvdSByZWFjaCBhbiBlbGVtZW50IHdpdGggYSBwYXJ0aWN1bGFyIHNlbGVjdG9yLlxuICogWW91IGNhbiBvcHRpb25hbGx5IGZpbHRlciBzaWJsaW5nIGVsZW1lbnRzIGJ5IGEgc2VsZWN0b3IgYXMgd2VsbCAoZm9yIGV4YW1wbGUsIG9ubHkgcmV0dXJuaW5nIGVsZW1lbnRzIHdpdGggYSBjZXJ0YWluXG4gKiBjbGFzcyBvciBkYXRhIGF0dHJpYnV0ZSkuXG4gKi9cblxudmFyIF9uZXh0VW50aWwgPSAoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB3aW5kb3cuX25leHRVbnRpbCA9IHdpbmRvdy5fbmV4dFVudGlsIHx8IHt9O1xuXG5cbiAgICAvL2l0ZXJhdGUgYXJndW1lbnRzXG4gICAgZnVuY3Rpb24gZ2V0KGVsZW1lbnQsIHNlbGVjdG9yLCBmaWx0ZXIpIHtcblxuICAgICAgICAvL3NpYmxpbmdzIGNhY2hlIGFycmF5XG4gICAgICAgIHZhciBzaWJsaW5ncyA9IFtdO1xuICAgICAgICAvL3ByaXZhdGUgdmFyaWFibGVzXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZztcblxuICAgICAgICB3aGlsZSAoZWxlbWVudCl7XG4gICAgICAgICAgICAvL2lmIHdlIHJlYWNoZWQgdGhlIGxpbWl0LCBiYWlsLW91dCFcbiAgICAgICAgICAgIGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSBicmVhaztcblxuICAgICAgICAgICAgLy9hZnRlciB3ZSBjaGVjayB0byBzZWUgaWYgZWxlbWVudCBtYXRjaGVzIHRoZSBzZWxlY3RvclxuICAgICAgICAgICAgLy9jaGVjayB0byBzZWUgaWYgYSBmaWx0ZXIgd2FzIHNwZWNpZmllZCxcbiAgICAgICAgICAgIC8vaWYgYSBmaWx0ZXIgd2FzIHNwZWNpZmllZCwgY2hlY2sgdG8gc2VlIGlmIGVsZW1lbnQgbWF0Y2hlcyB0aGUgZmlsdGVyXG4gICAgICAgICAgICBpZiAoZmlsdGVyICYmICFlbGVtZW50Lm1hdGNoZXMoZmlsdGVyKSl7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL290aGVyd2lzZSwgcHVzaCBpdCB0byB0aGUgc2libGluZ3MgYXJyYXlcbiAgICAgICAgICAgIHNpYmxpbmdzLnB1c2goZWxlbWVudCk7XG5cbiAgICAgICAgICAgIC8vZ2V0IHRoZSBuZXh0IHNpYmxpbmcgZWxlbWVudFxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9yZXR1cm4gdGhlIHNpYmxpbmdzIGFycmF5XG4gICAgICAgIHJldHVybiBzaWJsaW5ncztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IGdldFxuICAgIH1cblxuXG59KSgpO1xuXG5cbiIsInZhciBhY2NvcmRpb25NZW51ID0gKGZ1bmN0aW9uICh3aW5kb3cpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy9leHBvcnQgbmFtZXNwYWNlIHRvIHdpbmRvdyBvYmplY3RcbiAgICB3aW5kb3cuYWNjb3JkaW9uTWVudSA9IHdpbmRvdy5hY2NvcmRpb25NZW51IHx8IHt9O1xuXG4gICAgdmFyIGFjYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24nKTtcblxuICAgIC8vaW5pdGlhbGl6ZSBhbGwgcHVibGljIHZhcnMgYW5kIG1ldGhvZHMgaW4gZ2xvYmFsIHNjb3BlXG4gICAgLypmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICB0aGlzLmFjdGl2YXRlQWNjb3JkaW9uID0gYWN0aXZhdGVBY2NvcmRpb24oKTtcbiAgICAgICAgdGhpcy5vcGVuSXQgPSBvcGVuSXQoKTtcbiAgICAgICAgdGhpcy5jbG9zZUl0ID0gY2xvc2VJdCgpO1xuICAgIH0qL1xuXG4gICAgZnVuY3Rpb24gb3Blbkl0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHRTaWJsaW5nLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2VJdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dFNpYmxpbmcuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlQWNjb3JkaW9uKCkge1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFjYy5sZW5ndGg7IHgrKyl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGFjY1t4XS5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpO1xuICAgICAgICAgICAgYWNjW3hdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xuICAgICAgICAgICAgICAgIC8qIFRvZ2dsZSBiZXR3ZWVuIGFkZGluZyBhbmQgcmVtb3ZpbmcgdGhlIFwiYWN0aXZlXCIgY2xhc3MsXG5cdFx0XHRcdCAgIHRvIGhpZ2hsaWdodCB0aGUgYnV0dG9uIHRoYXQgY29udHJvbHMgdGhlIHBhbmVsICovXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIpO1xuXG4gICAgICAgICAgICAgICAgLyogVG9nZ2xlIGJldHdlZW4gaGlkaW5nIGFuZCBzaG93aW5nIHRoZSBhY3RpdmUgcGFuZWwgKi9cbiAgICAgICAgICAgICAgICB2YXIgcGFuZWwgPSB0aGlzLm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICBpZiAocGFuZWwuc3R5bGUubWF4SGVpZ2h0KXtcbiAgICAgICAgICAgICAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIC8qaW5pdDogaW5pdCovXG4gICAgICAgIGFjdGl2YXRlQWNjb3JkaW9uOiBhY3RpdmF0ZUFjY29yZGlvbixcbiAgICAgICAgb3Blbjogb3Blbkl0LFxuICAgICAgICBjbG9zZTogY2xvc2VJdFxuICAgIH1cblxuXG59KSh3aW5kb3cpO1xuXG5hY2NvcmRpb25NZW51LmFjdGl2YXRlQWNjb3JkaW9uKCk7XG5cbiIsInZhciBhcHAgPSAoZnVuY3Rpb24gKHdpbmRvdykge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKiBFeHBvcnQgbmFtZXNwYWNlIHRvIHdpbmRvdyBvYmplY3QgKi9cbiAgICB3aW5kb3cuYXBwID0gd2luZG93LmFwcCB8fCB7fTtcbiAgICAvL2luaXRpYWxpemUgYWxsIG1vZHVsZXMgaGVyZS4uLlxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIHRoaXMudG1wbE1hcCA9IHRtcGxNYXAucnVuKCk7XG4gICAgICAgIHRoaXMubmF2TWVudSA9IG5hdk1lbnUub3BlbkhhbWJ1cmdlcigpO1xuICAgICAgICB0aGlzLmFjY29yZGlvbk1lbnUgPSBhY2NvcmRpb25NZW51LmFjdGl2YXRlQWNjb3JkaW9uKCk7XG4gICAgICAgIHRoaXMuZ2FsbGVyeSA9IGdhbGxlcnkuc2V0SW1hZ2VTcmMoKTtcbiAgICAgICAgdGhpcy5tb2RhbCA9IG1vZGFsLm1vZGFsRm4oKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0OiBpbml0XG4gICAgfVxuXG5cblxufSkod2luZG93KTtcbiIsIi8vZXZlbnRzIC0gYSBzdXBlci1iYXNpYyBKYXZhc2NyaXB0IChwdWJsaXNoIHN1YnNjcmliZSkgcGF0dGVyblxudmFyIGV2ZW50cyA9IHtcbiAgICBldmVudHM6IHt9LFxuICAgIG9uVGhpczogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gfHwgW107XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChmbik7XG4gICAgfSxcbiAgICBvZmZUaGlzOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVtaXRUaGlzOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgICAgICBmbihkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsInZhciBnYWxsZXJ5ID0gKGZ1bmN0aW9uKHdpbmRvdyl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qIEV4cG9ydCBuYW1lc3BhY2UgdG8gd2luZG93IG9iamVjdCAqL1xuICAgIHdpbmRvdy5nYWxsZXJ5ID0gd2luZG93LmdhbGxlcnkgfHwge307XG5cbiAgICAvKiBDYWNoZSBET00gZWxlbWVudHMgKi9cbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhbGxlcnknKTtcbiAgICB2YXIgZmlyc3RTbWFsbEltYWdlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zbWFsbC1wcmV2aWV3Jyk7XG4gICAgdmFyIHpvb21lZEltYWdlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy56b29tZWQtaW1hZ2UnKTtcbiAgICB2YXIgbGFiZWxQYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdF9pbmZvJyk7XG4gICAgdmFyIGxhYmVscyA9IGxhYmVsUGFyZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2xhYmVsJyk7XG5cblxuXG4gICAgZnVuY3Rpb24gc2V0SW1hZ2VTcmMoKSB7XG4gICAgICAgIHJldHVybiB6b29tZWRJbWFnZS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcrIGZpcnN0U21hbGxJbWFnZS5zcmMgKycpJztcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGJpbmRQcmV2aWV3KGV2ZW50KSB7XG4gICAgICAgIHZhciBlbGVtID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgbWF0Y2g7XG5cbiAgICAgICAgaWYgKGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKFwic21hbGwtcHJldmlld1wiKSkge1xuICAgICAgICAgICAgdmFyIGltYWdlU3JjID0gZWxlbS5zcmM7XG4gICAgICAgICAgICB2YXIgcHJldmlld1N0YXRlID0gW107XG5cbiAgICAgICAgICAgIHpvb21lZEltYWdlLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoJysgaW1hZ2VTcmMgKycpJztcbiAgICAgICAgICAgIHByZXZpZXdTdGF0ZS5wdXNoKGVsZW0uZGF0YXNldCk7XG5cblxuICAgICAgICAgICAgbWF0Y2ggPSBPYmplY3Qua2V5cyhwcmV2aWV3U3RhdGUpLmZpbHRlcihmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBwcmV2aWV3ID0gcHJldmlld1N0YXRlW3N0YXRlXS5pZDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncHJldmlldycsIHByZXZpZXcpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gT2JqZWN0LmtleXMobGFiZWxzKS5maWx0ZXIoZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZEVsZW1lbnQgPSBsYWJlbHNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVTdGF0ZSA9IGxhYmVsc1tpbmRleF0uZGF0YXNldC5sYWJlbDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGVtcGxhdGVTdGF0ZSA9PT0gcHJldmlldyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSBfbmV4dFVudGlsLmdldChzZWxlY3RlZEVsZW1lbnQsICcuYnJlYWtsaW5lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdW5zZWxlY3RlZCA9IF9nZXRTaWJsaW5ncy5vZihzZWxlY3RlZEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZC5maWx0ZXIoZnVuY3Rpb24gKHNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbW9kYWwgYnV0dG9uIGxvZ2ljXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdC5jbGFzc0xpc3QuY29udGFpbnMoXCJhZGRfdG9fY2FydFwiKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRjYXJ0RGF0YSA9IHRoaXMuZGF0YXNldC5hZGRjYXJ0ID0gcHJldmlldztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYXJ0JywgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChhZGRjYXJ0RGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9uZWVkcyBtb2RhbCB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Byb2R1Y3QgYWNjb3JkaW9uIGxvZ2ljXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdC5jbGFzc0xpc3QuY29udGFpbnMoXCJwcm9kdWN0X2FjY29yZGlvblwiKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSBzZWxlY3QucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHJvdy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93W3hdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhbmVsID0gdGhpcy5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhbmVsLnN0eWxlLm1heEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdC5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdW5zZWxlY3RlZC5maWx0ZXIoZnVuY3Rpb24gKHVuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVuc2VsZWN0LmNsYXNzTGlzdC5jb250YWlucyhcInNlbGVjdGVkXCIpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5zZWxlY3QuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bnNlbGVjdC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5zZWxlY3Quc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvL3JldHVybiBtYXRjaDtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVubGFyZ2UoKSB7XG4gICAgICAgIC8vIE1ha2UgdGhlIGRpbWVuc2lvbnMgbGFyZ2VyIHRoZW4gYWN0dWFsIHNpemUgb2YgZWxlbWVudFxuICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCIxNTAlXCI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW92ZShldmVudCkge1xuICAgICAgICAvLyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZ2l2ZXMgdXMgdmFyaW91cyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgcG9zaXRpb24gb2YgdGhlIGVsZW1lbnQuXG4gICAgICAgIHZhciBkaW1lbnNpb25zID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBjdXJzb3IgaW5zaWRlIHRoZSBlbGVtZW50IChpbiBwaXhlbHMpLlxuICAgICAgICB2YXIgeCA9IGV2ZW50LmNsaWVudFggLSBkaW1lbnNpb25zLmxlZnQ7XG4gICAgICAgIHZhciB5ID0gZXZlbnQuY2xpZW50WSAtIGRpbWVuc2lvbnMudG9wO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgcG9zaXRpb24gb2YgdGhlIGN1cnNvciBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIHRvdGFsIHdpZHRoL2hlaWdodCBvZiB0aGUgZWxlbWVudC5cbiAgICAgICAgdmFyIHhwZXJjZW50ID0gTWF0aC5yb3VuZCgxMDAgLyAoZGltZW5zaW9ucy53aWR0aCAvIHgpKTtcbiAgICAgICAgdmFyIHlwZXJjZW50ID0gTWF0aC5yb3VuZCgxMDAgLyAoZGltZW5zaW9ucy5oZWlnaHQgLyB5KSk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBiYWNrZ3JvdW5kIHBvc2l0aW9uIG9mIHRoZSBpbWFnZS5cbiAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSB4cGVyY2VudCsnJSAnICsgeXBlcmNlbnQrJyUnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxlYXZlKCkge1xuICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb3ZlclwiO1xuICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IFwiY2VudGVyXCI7XG4gICAgfVxuXG5cblxuXG4gICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBiaW5kUHJldmlldywgZmFsc2UpO1xuICAgIHpvb21lZEltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIGVubGFyZ2UsIGZhbHNlKTtcbiAgICB6b29tZWRJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdmUsIGZhbHNlKTtcbiAgICB6b29tZWRJbWFnZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCBsZWF2ZSwgZmFsc2UpO1xuXG5cbiAgICByZXR1cm4ge1xuICAgICAgc2V0SW1hZ2VTcmM6IHNldEltYWdlU3JjLFxuICAgICAgYmluZFByZXZpZXc6IGJpbmRQcmV2aWV3LFxuICAgICAgZW5sYXJnZTogZW5sYXJnZSxcbiAgICAgIG1vdmU6IG1vdmUsXG4gICAgICBsZWF2ZTogbGVhdmVcbiAgICB9XG5cbn0pKHdpbmRvdyk7XG4vLyBUT0RPOiBmaW5kIGEgY2xlYW5lciB3YXkgdG8gaW5pdGlhbGl6ZSB0aGlzIG1ldGhvZC4uLlxuZ2FsbGVyeS5zZXRJbWFnZVNyYygpO1xuXG4iLCJ2YXIgbW9kYWwgPSAoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKiBFeHBvcnQgbmFtZXNwYWNlIHRvIHdpbmRvdyBvYmplY3QgKi9cbiAgICB3aW5kb3cubW9kYWxNb2R1bGUgPSB3aW5kb3cubW9kYWxNb2R1bGUgfHwge307XG5cbiAgICBmdW5jdGlvbiBtb2RhbEZuKCkge1xuXG4gICAgICAgIC8vIERlZmluZSB0aGUgbW9kYWwgdGVtcGxhdGVcblxuICAgICAgICAvLyBHZXQgdGhlIG1vZGFsXG4gICAgICAgIHZhciBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNtb2RhbElkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1vZGFsKTtcbiAgICAgICAgLy8gR2V0IHRoZSBidXR0b24gdGhhdCBvcGVucyB0aGUgbW9kYWxcbiAgICAgICAgdmFyIGJ0bkVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFkZF90b19jYXJ0Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGJ0bkVsKTtcbiAgICAgICAgLy8gR2V0IHRoZSA8c3Bhbj4gZWxlbWVudCB0aGF0IGNsb3NlcyB0aGUgbW9kYWxcbiAgICAgICAgLy92YXIgc3BhbkVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsb3NlJylbMF07XG4gICAgICAgIC8vY29uc29sZS5sb2coc3BhbkVsKTtcbiAgICAgICAgLy8gV2hlbiB0aGUgdXNlciBjbGlja3Mgb24gdGhlIGJ1dHRvbiwgb3BlbiB0aGUgbW9kYWxcbiAgICAgICAgYnRuRWwub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFdoZW4gdGhlIHVzZXIgY2xpY2tzIG9uIDxzcGFuPiAoeCksIGNsb3NlIHRoZSBtb2RhbFxuICAgICAgICAvKnNwYW5FbC5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfTsqL1xuXG4gICAgICAgIC8vIFdoZW4gdGhlIHVzZXIgY2xpY2tzIGFueXdoZXJlIG91dHNpZGUgb2YgdGhlIG1vZGFsLCBjbG9zZSBpdFxuICAgICAgICB3aW5kb3cub25jbGljayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09IG1vZGFsKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG1vZGFsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIG1vZGFsRm46IG1vZGFsRm5cbiAgICB9XG59KShldmVudCk7XG5cblxuIiwidmFyIG5hdk1lbnUgPSAoZnVuY3Rpb24gKHdpbmRvdykge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB3aW5kb3cubmF2TWVudSA9IHdpbmRvdy5uYXZNZW51IHx8IHt9O1xuXG4gICAgdmFyIG5hdkVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25hdi1tZW51Jyk7XG4gICAgdmFyIGhhbWJ1cmdlckVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmljb24nKTtcblxuICAgIC8qZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgdGhpcy5vcGVuSGFtYnVyZ2VyID0gb3BlbkhhbWJ1cmdlcigpO1xuICAgIH0qL1xuXG4gICAgZnVuY3Rpb24gb3BlbkhhbWJ1cmdlcigpIHtcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKFwiaGFtYnVyZ2VyXCIpO1xuICAgICAgICBpZiAobmF2RWwuY2xhc3NOYW1lID09PSAnbmF2aWdhdGlvbi1tZW51Jykge1xuICAgICAgICAgICAgbmF2RWwuY2xhc3NOYW1lICs9IFwiaGFtYnVyZ2VyXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYXZFbC5jbGFzc05hbWUgPSBcIm5hdmlnYXRpb24tbWVudVwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFtYnVyZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ21tbS4uLmhhbWJ1cmdlcicpO1xuICAgICAgICByZXR1cm4gb3BlbkhhbWJ1cmdlcigpO1xuICAgIH0pO1xuXG5cblxuXG5cbiAgICByZXR1cm4ge1xuICAgICAgICAvKmluaXQ6IGluaXQqL1xuICAgICAgICBvcGVuSGFtYnVyZ2VyOiBvcGVuSGFtYnVyZ2VyXG4gICAgfVxufSkod2luZG93KTtcblxuIiwidmFyIHRtcGxNYXAgPSAoZnVuY3Rpb24gKHdpbmRvdykge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKiBFeHBvcnQgbmFtZXNwYWNlIHRvIHdpbmRvdyBvYmplY3QgKi9cbiAgICB3aW5kb3cudG1wbE1hcCA9IHdpbmRvdy50bXBsTWFwIHx8IHt9O1xuXG4gICAgLyogQ2FjaGUgRE9NIGVsZW1lbnRzIGZvciB0aGUgdGVtcGxhdGUgKi9cbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRlbXBsYXRlLXByb2R1Y3QtaW5mb1wiKTtcbiAgICB2YXIgdG1wbEh0bWwgPSB0ZW1wbGF0ZS5pbm5lckhUTUw7XG4gICAgdmFyIF90bXBsRGF0YSA9IFwiLi9qcy9kYXRhL3Byb2R1Y3RUZW1wbGF0ZS5qc29uXCI7XG5cbiAgICAvKiBCaW5kIEV2ZW50cyAqL1xuXG4gICAgLyogUmVuZGVyIHRvIERPTSAqL1xuXG4gICAgLyogVXRpbGl0eSBGdW5jdGlvbnMgKi9cbiAgICAvLyBBamF4IFJlcXVlc3QgZm9yIGpzb24gc3RyaW5nXG4gICAgZnVuY3Rpb24gYWpheENhbGwoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZShcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBfdG1wbERhdGEsIHRydWUpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICAgIC8vIE9uIHN1Y2Nlc3NcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSBcIjIwMFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3RhdHVzIG9mIHhociByZXF1ZXN0JywgeGhyLnN0YXR1cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIuc2VuZChudWxsKTtcbiAgICB9XG5cbiAgICAvLyBGdW5jdGlvbiBhY2NlcHRzIF90bXBsRGF0YSBhcyBjYWxsYmFjayBwYXJhbWV0ZXIsIGFuZCBwYXJzZXMgaXQgdG8gdGVtcGxhdGVcbiAgICBmdW5jdGlvbiBsb29wRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIChhamF4Q2FsbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciBwYXJzZWRSZXMgPSBKU09OLnBhcnNlKHJlc3BvbnNlKSxcbiAgICAgICAgICAgIC8vIEZpbmFsIEhUTUwgdmFyaWFibGUgYXMgYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgICAgICBwcm9kdWN0SHRtbCA9IFwiXCI7XG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggX3RtcERhdGEgb2JqZWN0LCByZXBsYWNlIHBsYWNlaG9sZGVyIHRhZ3NcbiAgICAgICAgICAgIC8vIHdpdGggYWN0dWFsIGRhdGEsIGFuZCBnZW5lcmF0ZSBmaW5hbCBIVE1MXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGFyc2VkUmVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlZFJlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdEh0bWwgKz0gdG1wbEh0bWwucmVwbGFjZSgve3tsYWJlbH19L2csIHBhcnNlZFJlc1trZXldW1wibGFiZWxcIl0pXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgve3tkZXNjcmlwdGlvbn19L2csIHBhcnNlZFJlc1trZXldW1wiZGVzY3JpcHRpb25cIl0pXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgve3twcmljZX19L2csIHBhcnNlZFJlc1trZXldW1wicHJpY2VcIl0pXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgve3txdWFudGl0eX19L2csIHBhcnNlZFJlc1trZXldW1wicXVhbnRpdHlcIl0pXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgve3thZGRDYXJ0fX0vZywgcGFyc2VkUmVzW2tleV1bXCJhZGRDYXJ0XCJdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL3t7cGFuZWxMYWJlbH19e3tjb2xsYXBzZWR9fS9nLCBwYXJzZWRSZXNba2V5XS5wYW5lbExhYmVsLmNvbGxhcHNlZClcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgT2JqZWN0LmtleXMocGFyc2VkUmVzKS5maWx0ZXIoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvZHVjdF9pbmZvXCIpLmlubmVySFRNTCA9IHByb2R1Y3RIdG1sO1xuXG4gICAgICAgIH0uYmluZCh0aGlzKSkpO1xuICAgIH1cblxuICAgIC8vIEZ1bmN0aW9uIHRha2VzIHRoZSB6b29tR2FsbGVyaWVzIGVsZW1lbnQgYXMgYW4gYXJndW1lbnQsIGFuZCByZW5kZXJzIHRoZSB2YWx1ZSB0byB0aGUgcHJvZHVjdCBuYW1lIGluIHRlbXBsYXRlXG4gICAgZnVuY3Rpb24gc2V0TmFtZShjdXJyZW50RWwpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBjdXJyZW50RWw7XG4gICAgICAgIF9yZW5kZXIoKTtcbiAgICB9XG5cbiAgICAvLyBGdW5jdGlvbiBpbnN0YW50aWF0ZXMgbG9vcERhdGFcbiAgICBmdW5jdGlvbiBydW4oKSB7XG4gICAgICAgIGxvb3BEYXRhKCk7XG4gICAgfVxuXG5cblxuICAgIHJldHVybiB7XG4gICAgICAgIHJ1bjogcnVuLFxuICAgICAgICBhamF4Q2FsbDogYWpheENhbGwsXG4gICAgICAgIHNldE5hbWU6IHNldE5hbWVcbiAgICB9XG5cbn0pKHdpbmRvdyk7XG4iXX0=
