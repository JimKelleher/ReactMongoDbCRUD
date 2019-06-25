//-----------------------------------------------------------------------------------------------------------
// Browser functions:

export function getBrowserName() {

    // Browser Name:
    // http://www.javascripter.net/faq/browsern.htm

    // Feature Detection:
    // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
    // https://jsfiddle.net/311aLtkz/

    // Brave Detection:
    // https://www.ctrl.blog/entry/brave-user-agent-detection


    // As of 12-2018:

    var browserName = "unknown";

    if(navigator.userAgent.indexOf(".NET CLR") > -1) {
      browserName = "internet explorer";
    }
    else if(navigator.userAgent.indexOf("OPR") > -1) {
      browserName = "opera";
    }
    else if(navigator.userAgent.indexOf("Vivaldi") > -1) {
      browserName = "vivaldi";
    }
    else if(navigator.userAgent.indexOf("PaleMoon") > -1){
      browserName = "pale moon";
    }
    else if(navigator.userAgent.indexOf("IceDragon") > -1){
      browserName = "ice dragon";
    }
    else if(navigator.userAgent.indexOf("Edge") > -1){
      browserName = "edge";
    }
    else if(typeof InstallTrigger !== 'undefined'){
      browserName = "firefox";
    }
    // Chrome 1 of 4 (preserve order):
    else if(isBrave() == true){
      browserName = "brave";
    }
    // Chrome 2 of 4 (preserve order):
    else if(window.chrome.torch){
      browserName = "torch";
    }
    // Chrome 3 of 4 (preserve order):
    else if(navigator.connection){
      browserName = "chrome";
    }
    // Chrome 4 of 4 (preserve order):
    else if(navigator.appName == 'Netscape'){
      browserName = "epic";
    };

    return browserName;

}

export function isBrave() {

    // initial assertions
    if (!window.google_onload_fired &&
        navigator.userAgent &&
        !navigator.userAgent.includes('Chrome'))
            return false;

    // set up test
    var test = document.createElement('iframe');
    test.style.display = 'none';
    document.body.appendChild(test);

    // empty frames only have this attribute set in Brave Shield
    var is_brave = (test.contentWindow.google_onload_fired === true);

    // teardown test
    test.parentNode.removeChild(test);

    return is_brave;

}

//-----------------------------------------------------------------------------------------------------------
// Color functions:

export const get_complementary_color = function get_complementary_color(hex) {

	// Adapted from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	// by David:

   	hex = hex.replace(/#/, '');

    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

	if ((r * 0.299) + (g * 0.587) + (b * 0.114) > 140) {

		// For light colors, the complement is black:
		return "#000000";
	} else {
		// For dark colors, the complement is white:
		return "#ffffff";
	}
	
}

export const get_random_color = function get_random_color() {

	// Adapted from: http://randomcolour.com

	var bg_colour = Math.floor(Math.random() * 16777215).toString(16);
    bg_colour = "#" + ("000000" + bg_colour).slice(-6);
	bg_colour = ("000000" + bg_colour).slice(-6);
   
	return "#" + bg_colour;

}

//-----------------------------------------------------------------------------------------------------------
// CORS and JSON functions:

export function decode_artist_name_special_chars(artist_name) {

    // NOTE: See document "artist database query encoding.txt":

    // Decode the characters that get translated when UTF-8 data is retrieved from
    // the JSON Database Artist lookup despite my best efforts to prevent it in
    // the first place: 

    var artist_name_edited = artist_name;

    artist_name_edited = artist_name_edited.split("Ã–" ).join("Ö");
    artist_name_edited = artist_name_edited.split("Ã¶" ).join("ö");
    artist_name_edited = artist_name_edited.split("Ã©" ).join("é");
    artist_name_edited = artist_name_edited.split("Ã¡" ).join("á");
    artist_name_edited = artist_name_edited.split("â€“").join("–");
    
    return artist_name_edited;

}

export function encode_artist_name_punctuation(artist_name) {

    // NOTE: See document "artist database query encoding.txt":

    // Encode the characters that mess up the JSON Database Artist lookup despite
    // my best efforts to prevent it:
    var artist_name_edited = artist_name;

    artist_name_edited = artist_name_edited.split("&").join("%26");
    artist_name_edited = artist_name_edited.split("'").join("\\'");

    return artist_name_edited;

}

export function get_xml_http_request(uri) {

    var xml_http_request = new XMLHttpRequest();

    var response = ""; // init

    //----------------------------------------------------------------------------------
    // NOTE: Neither of these approaches prevented error messages from being generated
    // and going to the console.  Nor could I get the content of the error message.
    //----------------------------------------------------------------------------------
    try {
        xml_http_request.open("GET", uri, false); // async = false = synchronous
        xml_http_request.send();
        response = xml_http_request.response;
    } catch (error) { response = "HTTP GET retrieval error"; }    
    //----------------------------------------------------------------------------------
    // xml_http_request.open("GET", uri, false); // async = false = synchronous
    // xml_http_request.onerror = function () { response = "HTTP GET retrieval error"; };
    // xml_http_request.send();
    // response = xml_http_request.response;
    //----------------------------------------------------------------------------------

    return response;

}

export function get_xml_http_request_via_proxy_server(uri) {

    var PROXY_SERVER_PREFIX = "http://www.workingweb.info/Utility/WorkingWebWebServices/api/proxy/?request=";
    
    // Cross-Origin Resource Sharing (CORS)
    // CORS Same-Origin Policy - Restricts how a document or script loaded from one origin can interact with a resource
    // from another origin. It is a critical security mechanism for isolating potentially malicious documents.  Definition
    // of an origin: two pages have the same origin if the protocol, port (if one is specified), and host are the same
    // for both pages.  In English, this means they originate from the same location (eg: Working Web).
    // NOTE: Though CORS processing is supposed to be legal if one has done the proper message and configuration preparation,
    // all browsers but one (Internet Explorer) treat it as prohibited, at least when employing a PHP preprocessor
    // (eg: en.wikipedia.org/w/api.php) from Wikipedia.  Since the (home-grown) proxy server is host-resident, it satisfies
    // the CORS same-origin policy and makes CORS truly available to me.
    // Create, open and send a synchronous XML HTTP GET request, by way of the host proxy server, and return the response:
    var response = get_xml_http_request(PROXY_SERVER_PREFIX + encodeURIComponent(uri));
    
    return response;

}

export function get_xml_http_request_via_proxy_server_async(uri, requestCallBack, requestError) {

    var PROXY_SERVER_PREFIX = "http://www.workingweb.info/Utility/WorkingWebWebServices/api/proxy/?request=";

    var request = new XMLHttpRequest();
    request.addEventListener("load", requestCallBack);
    request.addEventListener("error", requestError);

    // Cross-Origin Resource Sharing (CORS) - See note, above:
    var errorMessage = ""; // init
    try {
        request.open("GET", PROXY_SERVER_PREFIX + encodeURIComponent(uri));
        request.send();
    } catch (error) {
        errorMessage = error.message;
    }

    return errorMessage;

}

export function prepArtistNameForJsonDbSearch(searchArtistId) {

    // Since we will be modifying the argument, let's make a copy and work with that:
    var searchArtistIdEdited = searchArtistId;

    searchArtistIdEdited = replace_all(searchArtistIdEdited, " ", "%20");

    // NOTE: See document "artist database query encoding.txt":
    // Encode/replace the characters that mess up the JSON Database Artist lookup:
    searchArtistIdEdited = encode_artist_name_punctuation(searchArtistIdEdited);
    searchArtistIdEdited = replace_artist_name_special_chars(searchArtistIdEdited);

    // Return the modified argument:
    return searchArtistIdEdited;

}

export function remove_response_packaging(response) {

    // Decode the characters that get messed up in transit and remove the "packaging" (either String or
    // XML) that encloses the data:
    var response_edited = response;

    //---------------------------------------------------------------------------------------------------
    // CORS-compliant XML HTTP GET request/response
    // CROSS-REFERENCE: PROXY TRANSIT ENCODING/DECODING 3 OF 3:
    // THIS IS:  C:\a_dev\ASP\WorkingWebWebServices\WorkingWebWebServices(WorkingWebBrowserServices.js)
    // SEE ALSO: C:\a_dev\ASP\WorkingWebWebServices\WorkingWebWebServices(ProxyController.cs)
    // SEE ALSO: C:\a_dev\ASP\WikipediaDiscography\WikipediaDiscography(WikipediaDiscography.js)
    // Decode the only characters that get messed up in transit:
    response_edited = response_edited.split("DOUBLEQUOTE").join('"');
    response_edited = response_edited.split("BACKSLASH").join("\\");

    //---------------------------------------------------------------------------------------------------
    // NOTE: In operation, with no content-type specified, all browsers returned a content-type
    // of "application/json" except FireFox, which returned "application/xml".  I had settled on
    // a string result because the whole ASP/.NET JSON process, as currently built, is strongly
    // linked to JSON object creation and subseqent serialization, etc (complete, unneeded over-kill).
    // To make matter worse, though I had settled on Web API controllers for simplicity's sake, the
    // JSON stuff was closely linked to MVC controllers!  It was a typical ASP/.NET can-of-worms...
    // To make matters even worse than that, the "simplest" way to define a JSON content-type is
    // heavily configuration based (or similar non-obvious methods) which I couldn't even code
    // because of ASP/.NET "DLL hell" so I gave the whole effort up instead opting for a tiny
    // amount of hand coding.
    // Content-Type: "application/json" (an already-formed string, not a serialized object or any class
    // of data returned by ASP/Web API).  Strip off the double quotes that enclose the string data:
    if (response_edited.substr(0, 1) == '"') {
        response_edited = response_edited.substr(1, response_edited.length - 2);
    }

    // Content-Type: "application/xml".  Remove the XML tags that enclose the string data:
    if (response_edited.indexOf("<string xmlns=") > -1) {

        // <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">
        //      DETAIL INFO HERE
        // </string>
        var debug_trace = false;

        response_edited = excise_bounds_inclusive(response_edited, "<string xmlns=", '/">', debug_trace);
        response_edited = remove_all_procedural(response_edited, "</string>");
    }

    return response_edited;

}

export function replace_artist_name_special_chars(artist_name) {

    // NOTE: See document "artist database query encoding.txt":

    // Replace the characters that cause the Database application's ArtistDiscog
    // and ArtistVideo queries to fail.  These data sources have been altered to
    // use the "standard" letters instead of the foreign ones:

    var artist_name_edited = artist_name;

    // Case-sensitive:
    artist_name_edited = artist_name_edited.replace(/Ö/g, "O");
    artist_name_edited = artist_name_edited.replace(/ö/g, "o");
    artist_name_edited = artist_name_edited.replace(/é/g, "e");
    artist_name_edited = artist_name_edited.replace(/á/g, "a");
    artist_name_edited = artist_name_edited.replace(/–/g, "-");
    
    return artist_name_edited;

}

// Allows you to sort a JSON array by a member field, eg:
// yourArray.sort( predicateBy("age") );

// From: https://stackoverflow.com/questions/11099610/generic-way-of-sorting-json-array-by-attribute

export function predicateBy(prop) {
	return function(a,b){
	   if( a[prop] > b[prop]){
		   return 1;
	   }else if( a[prop] < b[prop] ){
		   return -1;
	   }
	   return 0;
	}
}

//-----------------------------------------------------------------------------------------------------------
// Miscellaneous functions:

// NOTE 3 of 3: This is for the work-around:
export function CapitlizeString(word) 
{
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function format_seconds_as_time(seconds_argument) {

    // Break up the argument seconds into hours, minutes, seconds:
    var hours = Math.floor(seconds_argument / 3600);
    var minutes = Math.floor((seconds_argument - (hours * 3600)) / 60);
    var seconds = Math.floor(seconds_argument - (hours * 3600) - (minutes * 60));

    // Convert the case:
    var hours_string = hours.toString();
    var minutes_string = minutes.toString();
    var seconds_string = seconds.toString();

    // Format the duration components as necessary:
    if (hours < 10) {
        hours_string = "0" + hours.toString();
    }
    if (minutes < 10) {
        minutes_string = "0" + minutes.toString();
    }
    if (seconds < 10) {
        seconds_string = "0" + seconds.toString();
    }

    // Combine and return the result:
    return hours_string + ':' + minutes_string + ':' + seconds_string;

}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}   

export function open_popup_window(window_uri, modal_dialog, resizable, scrollbars, width_in_pixels, height_in_pixels) {

    //----------------------------------------------------------------------
    var window_desc = ""; // init

    // The following processing has the effect of centering the window
    // to be opened on the screen.  Centering is default behavior in
    // all browsers except Firefox.  Rather than making the process
    // browser-specific, using Configuration Services, I'll just do
    // it for everybody, no harm, no foul:

    // Compute the location's coordinates:
    // NOTE: "Avail" means excluding the Windows task bar.
    var x = (screen.availWidth / 2) - (width_in_pixels / 2);
    var y = (screen.availHeight / 2) - (height_in_pixels / 2);

    // Use the equal sign for equality and the comma as a separator:
    window_desc = "margin-left=auto,margin-right=auto,toolbar=yes,"; // init

    window_desc += "resizable=" + resizable + ",";
    window_desc += "scrollbars=" + scrollbars + ",";

    window_desc += "width=" + width_in_pixels.toString() + "px,";
    window_desc += "height=" + height_in_pixels.toString() + "px,";

    window_desc += "left=" + x.toString() + ",";
    window_desc += "top=" + y.toString();

    //--------------------------------------------------------------------------
    // Opening a window as a modal dialog has the side effect of losing the window's
    // "favicon" upon display.  Microsoft Edge loses the icon in all cases.  These
    // are my test results of the following processing:

    // Browser              Favicon Shows   Comments
    // -------              -------------   --------

    // Brave                yes
    // Chrome               yes
    // Vivaldi              yes             opens in its own tab, not a popup
    // Edge                 no

    // Firefox              yes
    // Internet Explorer    no
    // Opera                yes
    // Safari               yes

    // Open a regular window:
    return window.open(window_uri, "_blank", window_desc);

}

//-----------------------------------------------------------------------------------------------------------
// React functions:

import React from 'react';

// React JSX function:
export function ShowErrorMessage(props) {

    {/* Override the "whitespace: 'nowrap'" set elsewhere: */}
    return <div style={{whiteSpace: 'normal', color: 'var(--alertColor)', width: props.width}}>
        {props.errorMessage}
    </div>;

}
//-----------------------------------------------------------------------------------------------------------
// All of these functions are DUPLICATES from WorkingWebBrowserServices.js

// String functions:

export function consolidate_extraneous_spaces(look_in) {

    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;

    var double_space_index;

    do {
        double_space_index = look_in_edited.indexOf("  ");
        look_in_edited = replace_all(look_in_edited, "  ", " ");
    }
    while (double_space_index > -1);

    look_in_edited = look_in_edited.trim();

    // Return the modified copy of the argument:
    return look_in_edited;

}

export function excise_bounds_inclusive(look_in, start_token, end_token, debug) {

    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;

    // Now let's do the excision in a "pulled clothesline" style, ie, excise a found string and continue
    // searching from the beginning, not having to advance through the string but instead, "pulling" each
    // occurrance forward (assuming there are multiples found):
    // Built-in debugging:
    if (debug == true) {
        print_string("DEBUG EXCISION BEFORE: " + look_in_edited);
    }

    var cut_start_index, cut_end_index;

    // Lower case is better for comparison:
    do {
        cut_start_index = look_in_edited.toLowerCase().indexOf(start_token.toLowerCase());
        if (cut_start_index > -1) {
            cut_end_index = look_in_edited.toLowerCase().indexOf(end_token.toLowerCase(), cut_start_index + 1) + end_token.length;
            if (cut_end_index > -1) {

                // Built-in debugging:
                if (debug == true) {
                    print_string("DEBUG EXCISION BOUNDED STRING: " + represent_bounded_string_succinctly(look_in_edited, cut_start_index, cut_end_index));
                }

                // Do the excision, combining everything before the excision with everything after it:
                //look_in_edited = look_in_edited.substring(0, cut_start_index - 1) +
                look_in_edited = look_in_edited.substring(0, cut_start_index) +
                    look_in_edited.substring(cut_end_index);
            }
        }
    } while (cut_start_index > -1);

    // // Built-in debugging:
    // if (debug == true) {
    //     print_string("DEBUG EXCISION AFTER: " + look_in_edited);
    // }

    // Return the modified copy of the argument with all occurrances of the found string excised.
    // If none were found, the original argument will be sent back unchanged:
    return look_in_edited;
    
}

export const get_file_name = function get_file_name(input_value) {

    // Take a string and turn it into a valid GoDaddy/IIS file name.

    // Since we will be modifying the argument, let's make a copy and work with that:
    var file_name = input_value;

    // NOTE: This list is not exhaustive.  It contains only those characters
    // that I experienced as causing problems:
    file_name = remove_all_procedural(file_name, "?");
    file_name = remove_all_procedural(file_name, "&");
    file_name = remove_all_procedural(file_name, "/");
    file_name = remove_all_procedural(file_name, "+");
    file_name = remove_special_chars(file_name);

    // Clean up:
    file_name = consolidate_extraneous_spaces(file_name);
    file_name.trim();

    return file_name;

}

export function getRandomNumber(low, high) {
    return Math.floor(Math.random() * (1 + high - low)) + low;
}

export function remove_all_procedural(look_in, look_for) {

    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;

    // If the string is found:
    if (look_in_edited.indexOf(look_for) > -1) {

        // Combine these two portions, implicitly excising the found string:
        do {
            look_in_edited =

                // Text preceeding the found string:
                look_in_edited.substring(0, look_in_edited.indexOf(look_for)
                ) +
                // Text following the found string:
                look_in_edited.substr(look_in_edited.indexOf(look_for) + look_for.length
                );

            // Continue while the string is still found:
        } while (look_in_edited.indexOf(look_for) > -1);

    }

    // Return the modified copy of the argument:
    return look_in_edited;
}

export function remove_special_chars(string_to_clean) {

    // These are the ASCII printable characters all of which are enterable from
    // the keyboard.  They start with the space character and end with the tilde
    // character.  Anything else is considered a "special character":
    var reg_exp = "[\x20-\x7E]";

    // This function strips out everything EXCEPT those characters prescribed in
    // the regular expression:
    return strip_string_to_regexp(string_to_clean, reg_exp);

}

export function replace_all(look_in, from, to) {

    // Since we will be modifying the argument, let's make a copy and work with that:
    var look_in_edited = look_in;

    // Make the replacement:
    look_in_edited = look_in.replace(RegExp(from, "gi"), to);  // global, case-insensitive

    // Return the modified copy of the argument:
    return look_in_edited
}

export function strip_string_to_regexp(look_in, regexp) {

    var look_in_edited = look_in;

    var stripped_string = ""; // init

    // We will now create a new string...
    for (var i = 0; i < look_in_edited.length; i++) {

        //...that has in it only the characters prescribed in the regular expression:
        if (look_in_edited[i].match(new RegExp(regexp, "gi"))) {
            stripped_string += look_in_edited[i];
        }
    }

    // Reset:
    look_in_edited = stripped_string;

    return look_in_edited;

}

export function triggerEvent(recipient, eventName) {

	var element = document.getElementById(recipient);

	var event = document.createEvent("HTMLEvents");
	event.initEvent(eventName, true, true);
	event.eventName = eventName;
	element.dispatchEvent(event);

}