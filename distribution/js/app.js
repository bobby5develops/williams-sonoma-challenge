var app = (function (window) {
    'use strict';
    /* Export namespace to window object */
    window.app = window.app || {};
    //initialize all modules here...
    function init() {
        this.tmplMap = tmplMap();
        this.navMenu = navMenu();
        this.accordionMenu = accordionMenu();
        this.gallery = gallery();
        this.modal = modal.modalFn();
    }

    return {
        init: init
    }



})(window);
