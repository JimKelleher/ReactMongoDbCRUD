// This function is a DUPLICATE from WorkingWebBrowserServices.js:

// Replace a DOM element serving as a placeholder with a meaningful element:
function replace_element(old_element_id, new_element_definition, new_element_id, new_element_type) {

    var old_element = document.getElementById(old_element_id);
    var new_element = document.createElement(new_element_type);
    old_element.parentNode.replaceChild(new_element, old_element);
    new_element.innerHTML = new_element_definition;
    new_element.id = new_element_id;

}

function show_spinner() {

    replace_element(
        "spinner_placeholder",
        '<div ' +
            'class="fa fa-spinner fa-pulse" ' +
            'style="' +
                'font-size:50px; ' +
                'margin-top:115px; ' +
                'margin-left:60px; ' +
                'position:fixed; ' +
                'z-index:9; ' +
                'color: var(--alertColor);' +
            '"' +
        '/>',
        "spinner",
        "div"
    );

}

function hide_spinner() {

    replace_element(
        "spinner",
        '<div id="spinner_placeholder"></div>',
        "spinner_placeholder",
        "div"
    );

}