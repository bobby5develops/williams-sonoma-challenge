var tmplMap = (function (window) {
    window.tmplMap = window.tmplMap || {};

    // Get the template data object
    var _tmplData = "./js/model/dealers.json";
    // Cache of the template
    var template = document.querySelectorAll("template-product-info");
    // Get the contents of the template
    var tmplHtml = template.innerHTML;
    // Final HTML variable as an empty string
    var productHtml = "";

    function init() {
        this.loopData = loopData();
    }

    function loopData() {
        // Loop through _tmpData object, replace placeholder tags
        // with actual data, and generate final HTML
        for (var key in _tmplData) {
            console.log(key);
            productHtml += tmplHtml.replace(/{{label}}/g, _tmplData[key].label)
                .replace(/{{price}}/g, _tmplData[key].price)
                .replace(/{{quantity}}/g, _tmplData[key].quantity)
                .replace(/{{addCart}}/g, _tmplData[key].addCart)
                .replace(/{{panelLabel}}/g, _tmplData[key].panelLabel);
        }

        return document.querySelector(".product_info").innerHTML = productHtml;
    }

    return {
        init: init
    }

})(window);
