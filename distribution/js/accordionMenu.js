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
        activate: activateAccordion,
        open: openIt,
        close: closeIt
    }


})(window);

accordionMenu.activate();
