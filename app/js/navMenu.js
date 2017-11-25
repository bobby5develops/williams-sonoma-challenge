var navMenu = (function (window) {
    'use strict';
    window.navMenu = window.navMenu || {};

    var navEl = document.querySelector('#nav-menu');
    console.log(navEl);
    var hamburgerEl = document.querySelector('.icon');

    function init() {
        this.openHamburger = openHamburger();
    }

    function openHamburger() {
        if (navEl.className === 'navigation-menu') {
            navEl.className += " hamburger";
        } else {
            navEl.className = "navigation-menu";
        }
    }

    hamburgerEl.addEventListener('click', function (event) {
        console.log('mmm...hamburger');
        return openHamburger();
    });





    return {
        init: init
    }
})(window);
