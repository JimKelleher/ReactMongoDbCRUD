import * as WorkingWebNodeJsServices from '../app/WorkingWebNodeJsServices.js';

import React from 'react';
import {DropDownCode} from '../modules/DropDownCode.jsx';

require('../modules/button.css');
require('../modules/DropDown.css');
require('../modules/FancyTextInputs.css');

require('../cardstack/ArtistPopup.css');


class ArtistPopup extends React.Component{

  constructor(props) {
    
    super(props);

    // Component levels:
		this.artistMaint = 	this.props.parent.props.parent.props.parent.props.parent;
    this.cardStackApp = this.props.parent.props.parent.props.parent;
    this.cardStackIndex = this.props.parent.props.parent;

    this.state = {
      id: '',
      decade: 0,
      genre: '',
      ximage: '',
      _id: '',
      showSave: false,
      errorMessage: ''
    };

    this.origData = {
      id: '',
      decade: 0,
      genre: '',
      ximage: '',
    };

    // Responsive design: 
    this.formWidth = -1;
    this.innerStyleClass = ""

    if (window.innerWidth < 600) {
      this.formWidth = '553px';
      this.innerStyleClass = "innerStylePhoneSize"
    }
    else {
      this.formWidth = '645px';
      this.innerStyleClass = "innerStyleFullSize"
    }

    //--------------------------------------------------------------------
    // If a card is open...
    if (this.cardStackIndex.openCardProps) {

      //...close it:
		  this.cardStackIndex.headerClick(this.cardStackIndex.openCardProps); 
    }

  }

  //-------------------------------------------
  // ArtistPopup Save button click
  //
	//    saveProcess
  //
	// 		    editSaveToMongoDb
  //
	// 	      addSaveProcess
  // 		        addSaveToMongoDb
  //-------------------------------------------
  // DeleteButtonWithConfirm.handleYesClick()
  //
  //    deleteSaveToMongoDb  
  //      deleteSaveToMongoDbCallback
  //-------------------------------------------

	add(_id, id, decade, genre, image) {

		var randomColor = WorkingWebNodeJsServices.get_random_color();		
		var newIndex = this.artistMaint.artist.writeArtists.length;
		var idMinusSpaces = id.split(' ').join('');

    // Make the changes to thw write database on the global artist object:
		this.artistMaint.artist.writeArtists.push(
			JSON.parse(
        '{"_id":"' + _id + '","id":"' + id + '","decade":' + decade + ',"genre":"' + genre + '",' +

        // Assign a matching set of colors:
				'"background": "' + randomColor + '",' +
				'"textColor": "' + WorkingWebNodeJsServices.get_complementary_color(randomColor) + '",' +

				'"image":"' + image + '",' +
        '"index":' + newIndex + ',' +
        
        '"idMinusSpaces":"' + idMinusSpaces + '",' +
        
				'"WdReportHtml": "",' +
        '"YaReportHtml": "",' +
        
        '"WdReportJson": "",' +
        '"YaReportJson": ""' +

				'}'
			)
		);

		// Overlay the read database from the write database on the global artist
		// object.  In the process, the filter criteria will be applied:
    this.artistMaint.artist.loadReadFromWrite();
    
		// Re-render the Card Stack from scratch, 1 of 4:
		this.artistMaint.cardStackAppRerender();

		// NOTE: At this point, after the re-render is complete, THIS = window.
    // Get the newly entered row and scroll to it.

    // NOTE 2: If a filter is in place that filters it out, we can't scroll
    // to it:

    try {
      this.windowScrollBy(
        Number(document.getElementById("li" + idMinusSpaces).attributes[1].value)
      ); 
    } 
    catch (error) {};
    
	}

//-------------------------------------------------------------------------------------------------
// SUCCESSFUL ADDITION:
//  {  
//     "message":"Artist created successfully",
//     "_id":"5ccf08f2be701900048d9c91"
//  }
//-------------------------------------------------------------------------------------------------
// MISSING REQUIRED FIELD:
//   {  
//     "error":{  
//        "errors":{  
//           "id":{  
//              "message":"Path `id` is required.",
//              "name":"ValidatorError",
//              "properties":{  
//                 "message":"Path `id` is required.",
//                 "type":"required",
//                 "path":"id"
//              },
//              "kind":"required",
//              "path":"id"
//           }
//        },
//        "_message":"artist validation failed",
//        "message":"artist validation failed: id: Path `id` is required.",
//        "name":"ValidationError"
//     }
//  }
//
//  error.message
//-------------------------------------------------------------------------------------------------
// DUPLICATE KEY FIELD:
// {  
//   "error":{  
//      "driver":true,
//      "name":"MongoError",
//      "index":0,
//      "code":11000,
//      "errmsg":"E11000 duplicate key error index: artist.artist.$id_1 dup key: { : \"aaa\" }"
//   }
// }
//
// error.errmsg
//-------------------------------------------------------------------------------------------------

	addSaveToMongoDb(id, decade, genre, ximage) {

    var parent = this;

    var url = "http://artistrest.herokuapp.com/artist/create/";

    var xhr = new XMLHttpRequest();
    
    // Since we will be modifying the argument, let's make a copy and work with that:
    var idEdited = id;

    //-------------------------------------------
    // Handle special characters:
    // Sam & Dave
    // Mike + the Mechanics
    idEdited = idEdited.split("&").join("%26");
    idEdited = idEdited.split("+").join("%2B");
    //-------------------------------------------

		xhr.onreadystatechange=function() {

			// Clarification on closures in Javascript with AJAX:
			// https://stackoverflow.com/questions/7945781/clarification-on-closures-in-javascript-with-ajax

			// NOTE:   url, xhr, idEdited, decade, genre, ximage & parent are available here because of closure.
			// NOTE 2: this = xhr - Due to closure, I could have used xhr instead of this.

			if (this.readyState === 4) {  // complete
				if (this.status === 200) {  // OK

					var messageObject = JSON.parse(this.response);

          if(messageObject.error){

            if(messageObject.error.hasOwnProperty("message")) {
              parent.setState({ errorMessage: "Add database failure for " + idEdited + ".  Error: " + messageObject.error.message });
            }
            else if(messageObject.error.hasOwnProperty("errmsg")) {
              parent.setState({ errorMessage: "Add database failure for " + idEdited + ".  Error: " + messageObject.error.errmsg });
            }
          }
          else {
            parent.add(
              messageObject._id,
              idEdited,
              decade,
              genre,
              ximage
            )
          }
				}
      }
      
		}

		xhr.open('POST', url, true); // asynchronous = true
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //-----------------------------------------------------------------------------------------
		// Normal processing:
    xhr.send("id=" + idEdited + "&decade=" + decade + "&genre=" + genre + "&image=" + ximage);
    //-----------------------------------------------------------------------------------------
    // Simulate duplicate key:
    // xhr.send("id=" + this.artistMaint.artist.writeArtists[0].id +
    //    "&decade=" + decade + "&genre=" + genre + "&image=" + ximage);
    //-----------------------------------------------------------------------------------------
    // Simulate missing required column:
    //xhr.send("decade=" + decade + "&genre=" + genre + "&image=" + ximage);
    //-----------------------------------------------------------------------------------------

	}

  addSaveProcess(id, decade, genre, ximage) {

    if (this.artistMaint.artist.findArtist(this.artistMaint.artist.writeArtists, id) > -1) {
      this.setState({errorMessage: "This artist already exists."})
    }
    else {
      this.addSaveToMongoDb(id, decade, genre, ximage);
    }

  }

  componentDidMount() {
    document.getElementById("innerDiv").style.width = this.formWidth;
  }

  componentWillMount() {

    if (this.cardStackIndex.transaction == "edit") {

      this.setState({
        id:        this.artistMaint.artist.readArtists[this.cardStackApp.state.selectedReadArtistsIndex].id,
        decade:    this.artistMaint.artist.readArtists[this.cardStackApp.state.selectedReadArtistsIndex].decade,
        genre:     this.artistMaint.artist.readArtists[this.cardStackApp.state.selectedReadArtistsIndex].genre,
        ximage:    this.artistMaint.artist.readArtists[this.cardStackApp.state.selectedReadArtistsIndex].image,
        _id: this.artistMaint.artist.readArtists[this.cardStackApp.state.selectedReadArtistsIndex]._id
      })

      // Save the original values:
      this.origData.id     = this.artistMaint.artist.readArtists[this.cardStackApp.state.selectedReadArtistsIndex].id;
      this.origData.decade = this.artistMaint.artist.readArtists[this.cardStackApp.state.selectedReadArtistsIndex].decade;
      this.origData.genre  = this.artistMaint.artist.readArtists[this.cardStackApp.state.selectedReadArtistsIndex].genre;
      this.origData.ximage = this.artistMaint.artist.readArtists[this.cardStackApp.state.selectedReadArtistsIndex].image;

    }

  }

	edit(id, decade, genre, ximage) {

    // Make the changes to thw write database on the global artist object:
    this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].id = id;
    this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].decade = decade;
    this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].genre = genre;
    this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].image = ximage;
  
		// Overlay the read database from the write database on the global artist
		// object.  In the process, the filter criteria will be applied:
    this.artistMaint.artist.loadReadFromWrite();

		// Re-render the Card Stack from scratch, 2 of 4:
    this.artistMaint.cardStackAppRerender();

  }
  
//-------------------------------------------------------------------------------------------------
// SUCCESSFUL UPDATE:
// {  
//   "message":"Artist updated successfully"
// }
//-------------------------------------------------------------------------------------------------
// INVALID KEY FIELD:
// {  
//   "error":{  
//      "message":"Cast to ObjectId failed for value \"5ccf06950ae71200047b6da2x\" at path \"_id\"",
//      "name":"CastError",
//      "stringValue":"\"5ccf06950ae71200047b6da2x\"",
//      "kind":"ObjectId",
//      "value":"5ccf06950ae71200047b6da2x",
//      "path":"_id"
//   }
// }
//-------------------------------------------------------------------------------------------------

  editSaveToMongoDb(id, decade, genre, ximage, _id) {

    var parent = this;

		//---------------------------------------------------------------------------------------
		// Normal processing:
    var url = "http://artistrest.herokuapp.com/artist/update/" + _id;			    // FOUND
		//---------------------------------------------------------------------------------------
		// Simulate a database error:
    //var url = "http://artistrest.herokuapp.com/artist/update/" + _id + "x"; // NOT FOUND
		//---------------------------------------------------------------------------------------

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange=function() {

			// Clarification on closures in Javascript with AJAX:
			// https://stackoverflow.com/questions/7945781/clarification-on-closures-in-javascript-with-ajax

			// NOTE:   url, xhr, id, decade, genre, ximage & parent are available here because of closure.
			// NOTE 2: this = xhr - Due to closure, I could have used xhr instead of this.

			if (this.readyState === 4) {  // complete
        if (this.status === 200) {  // OK
          
					var messageObject = JSON.parse(this.response);

          if(messageObject.error){

            if(messageObject.error.hasOwnProperty("message")) {
              parent.setState({ errorMessage: "Edit database failure for " + id + ".  Error: " + messageObject.error.message });
            }
            else if(messageObject.error.hasOwnProperty("errmsg")) {
              parent.setState({ errorMessage: "Edit database failure for " + id + ".  Error: " + messageObject.error.errmsg });
            }
          }
          else {
            parent.edit(
              id,
              decade,
              genre,
              ximage
            )
          }
				}
      }
      
		}

		xhr.open('PUT', url, true); // asynchronous = true
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("id=" + id + "&decade=" + decade + "&genre=" + genre + "&image=" + ximage);

  }

  formIsFullyFilled(id, decade, genre, ximage) {

    var decadeString;

    if (WorkingWebNodeJsServices.isNumeric(decade)) {
      decadeString = decade.toString();
    }
    else {
      decadeString = decade;
    }

    // For some unknown reason, a dropdown whose value has been cleared
    // has a value of true rather than the empty string:
    const isFilled =
      id.length     > 0 &&
      (decadeString.length > 0 && decadeString != true) &&
      (genre.length  > 0 && genre != true) &&
      ximage.length > 0;

    return isFilled;

  }

  handleIdChange = (evt) => {

      // Make input display-only, 1 of 4:

      if (this.cardStackIndex.transaction == "add") {

        // Make the ID field editable:
        this.setState({id: evt.target.value});
      }

      if (this.cardStackIndex.transaction == "edit") {

        // Effectively make the ID field uneditable by resetting the value:
        evt.target.value = this.origData.id;
      }

    this.setState({id: evt.target.value},
      
      this.showSaveCheck(
        evt.target.value, // id
        this.state.decade,
        this.state.genre,
        this.state.ximage
      )
    
    );

  }
  
  handleImageChange = (evt) => {

    this.setState({ximage: evt.target.value},
      
      this.showSaveCheck(
        this.state.id,
        this.state.decade,
        this.state.genre,
        evt.target.value // ximage
      )
    
    );
    
  }

  saveProcess(id, decade, genre, ximage, _id) {

    if (this.cardStackIndex.transaction == "edit") {
      this.editSaveToMongoDb(id, decade, genre, ximage, _id);
    } else if (this.cardStackIndex.transaction == "add") {
      this.addSaveProcess(id, decade, genre, ximage);
    }

  }

  showSaveCheck(id, decade, genre, ximage) {

      var showSave = false;

      if (this.formIsFullyFilled(id, decade, genre, ximage) == true) {

        if (this.cardStackIndex.transaction == "add") {

            showSave = true;

          }
          else if (this.cardStackIndex.transaction == "edit") {

            if (!(    id == this.origData.id &
                  decade == this.origData.decade &
                   genre == this.origData.genre &
                  ximage == this.origData.ximage)) {

                      showSave = true;
            }    
          }  
      } 

      this.setState({showSave: showSave});
  } 

	windowScrollBy(index) {

		// NOTE: This formula is bizarre and unexplainable and was determined by reverse engineering:
    const ADJUSTMENT = 46;
    
    // Eg: 83px
    var headerImageHeightString = document.getElementsByName("artistImage")[0].style.height;
    // Eg: 83
    headerImageHeightString = headerImageHeightString.substr(0, headerImageHeightString.length - 2);

    var HEADER_IMAGE_HEIGHT = Number(headerImageHeightString);
    var INDEX_Y = (index * HEADER_IMAGE_HEIGHT) + (index * 2) + ADJUSTMENT; 

		window.scrollTo(0, INDEX_Y); // X, Y
  
	}

  render() {

      const {id, decade, genre, ximage, _id} = this.state;

      const styles = {

        artistPopupInnerStyles: {
          position: 'absolute',
          height: '787px',
          margin: 'auto',
          background: 'silver',
          borderStyle: 'ridge',
          borderWidth: 'thick',
          fontSize: '20px',
        },

        artistPopupStyles: {
          position: 'fixed',

          top: 0,
          left: 0,
          right: 0,
          bottom: 0,

          backgroundColor: 'var(--modal-background)',
      
          // The z-index (zIndex) property specifies the stack order of an element.  An element with
          // greater stack order is always in front of an element with a lower stack order.  This only
          // works on positioned elements (position: absolute, position: relative, or position: fixed).
          // It drives popup window processing:
      
          zIndex: 9, /* Front-to-back window order 1 of 2: In the front */

          overflowY: 'auto'
      
        },
      
        // Responsive design. This will scale with the width of the popup:
        bigImageStylesResponsive: {
          width: '40%',
          height: 'auto'
        },
      
        buttonStyles: {
          position: 'absolute',
          right: '5px'
        },

        buttonVisibleStyles: {
          display: this.state.showSave ? 'inline-block' : 'none',
          marginRight: '5px'
        },
      
        dropDownStyles: {
          width:"155px"
        },

        linkStyles: {
          marginLeft: '10px'
        }

      };

      return (        

        <div style={styles.artistPopupStyles}>
          <div
            id="innerDiv"
            style={styles.artistPopupInnerStyles}
            className={this.innerStyleClass}
          >

            <img 
              src={ximage}

              // Responsive design:

              // Establish the ratio, square, that will prevail throughout the
              // responsive changes:
              width='250px'
              height='250px'
              
              // This will scale with the width of the popup:
              style={styles.bigImageStylesResponsive}
            />
            <br />
            <br />

            {/* For debug purposes, this is the MongoDB key: */}
            {/* <span>{_id}</span>
            <br />
            <br /> */}

            <div className="fancyText">

              <div className="input">
                <input
                  id="id"
                  type="text"
                  required
                  value={id}
                  autoComplete="off"
                  onChange={this.handleIdChange}
                  style={{width: '270px'}}
                />
                <label htmlFor="id">Artist</label>
              </div>

              <div className="input">
                <input
                  id="ximage"
                  type="text"
                  required
                  value={ximage} 
                  autoComplete="off"
                  onChange={this.handleImageChange}
                  style={{width: '390px'}}
                />
                <label htmlFor="ximage">Image URL</label>
              </div>

            </div>

            <a 
              href="http://www.workingweb.info/ArtistGoogleImage/" 
              target="_blank"
              style={styles.linkStyles}
            >Artist Google Image Search</a>
            <br />
            <br />

            <div className="nav">
              <ul>
                <DropDownCode
                    blank={"false"}
                    code="decade"
                    parent={this}
                    parentName="artistpopup"
                    value={this.state.decade}
                    width={styles.dropDownStyles.width}
                />
                <DropDownCode 
                    blank={"false"}
                    code="genre"
                    parent={this}
                    parentName="artistpopup"
                    value={this.state.genre}
                    width={styles.dropDownStyles.width}
                />
              </ul>
						</div>
            <br />
            <br />
            
            <WorkingWebNodeJsServices.ShowErrorMessage errorMessage={this.state.errorMessage} width={this.width} />
            <br />
            <br />
            <br />

            <div style={styles.buttonStyles}>

              {/* NOTE: I wanted to disable the save button but href/buttons have no such capability.  I will have to hide it: */}
              <a href="javascript:void(0);" style={styles.buttonVisibleStyles}
                 id="buttonSave" className="button save"
                 onClick={
                    () => this.saveProcess(id, decade, genre, ximage, _id)
                  }
                  >Save
              </a>

              <a href="javascript:void(0);" id="buttonCancel" className="button cancel" 
                onClick={this.cardStackIndex.toggleArtistPopupHide.bind(this.cardStackIndex)} >Cancel</a>

            </div>

          </div>
        </div>

      );
  }

}

export default ArtistPopup;