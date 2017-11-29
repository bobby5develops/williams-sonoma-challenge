var tmplMap = (function (window) {
    'use strict';
    /* Export namespace to window object */
    window.tmplMap = window.tmplMap || {};

    /* Cache DOM elements for the template */
    var template = document.getElementById("template-product-info");
    var tmplHtml = template.innerHTML;
    // Json String
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

            Object.keys(parsedRes).filter(function (t) {
                return t;
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

tmplMap.run();
