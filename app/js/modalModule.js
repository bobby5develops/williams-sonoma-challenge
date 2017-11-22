var modalModule = (function (event) {
    window.modalModule = window.modalModule || {};


    /*function init() {
        this.modalFn = modalFn();
    }*/

    function modalFn() {
        // Get the modal
        var modal = document.getElementById('modalId');

        // Get the button that opens the modal
        var btnEl = document.querySelector('.add_to_cart');

        // Get the <span> element that closes the modal
        var spanEl = document.getElementsByClassName("close")[0];

        // When the user clicks on the button, open the modal
        btnEl.onclick = function() {
            return modal.style.display = "block";
        };

        // When the user clicks on <span> (x), close the modal
        spanEl.onclick = function() {
            return modal.style.display = "none";
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
        return modal;
    }


    return {
        /*init: init*/
        modal: modalFn
    }
})(event);

modalModule.modal();
