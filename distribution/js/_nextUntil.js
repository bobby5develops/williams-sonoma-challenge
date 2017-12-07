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


