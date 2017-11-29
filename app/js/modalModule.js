var modalModule = (function (event) {
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
        var parentsUntil = getParentUtil( btnEl, '.add_to_cart' );
        console.log(btnEl.parentNode);
        console.log(parentsUntil);
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

