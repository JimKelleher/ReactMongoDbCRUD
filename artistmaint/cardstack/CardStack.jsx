import * as WorkingWebNodeJsServices from '../app/WorkingWebNodeJsServices.js';

import ArtistPopup from '../cardstack/ArtistPopup.jsx';
import DeleteButtonWithConfirm from '../modules/DeleteButtonWithConfirm.jsx';
import React from 'react';
import TimerProgressBar from '../modules/TimerProgressBar.jsx';
import {CARDSTACK_HEADER_HEIGHT} from '../cardstack/CardStackIndex.jsx';

require('../cardstack/cardstack.css');
require('../modules/confirmation.css');

const equalsZero = (num) => num === 0;


class CardStack extends React.Component {

	constructor(props) {

		// There is only one reason when one needs to pass props to super():
		// When you want to access this.props (or this."a particular prop") in constructor.
		super(props);

		// Component levels:
		this.artistMaint = this.props.parent.props.parent.props.parent;		
		this.cardStackApp = this.props.parent.props.parent;
		this.cardStackIndex = this.props.parent;

		this.initialTopOffsets =
			this.props.children.map((child, index) => equalsZero(index) ? 0 : CARDSTACK_HEADER_HEIGHT * index);

		this.state = {
			topOffsets: this.initialTopOffsets,
			cardSelected: false,
			artists: this.props.artists,
			errorMessage: ''
		};

		document.body.className = "";

		// NOTE: This technique, of saving an instance pointer, is used in this one place only.
		// The function handleCardClick() is called from both CardStack and CardStackIndex.
		// To uproot it and all its related data/processing from CardStack to CardStackIndex would
		// be a major effort which would go to the heart of Cameron's core GUI processing.  It's
		// not worth the effort to avoid this simple expediency:
		this.cardStackIndex.cardStackInstance = this;

	}

	delete(index, idMinusSpaces) {

		// Clear the deletion animation CSS class:
		document.getElementById("li" + idMinusSpaces).className="";

		// After the animation is complete, do the deletion:

    	// Make the changes to thw write database on the global artist object:
		this.artistMaint.artist.writeArtists.splice(index, 1);	
		
		// Overlay the read database from the write database on the global artist
		// object.  In the process, the filter criteria will be applied:
		this.artistMaint.artist.loadReadFromWrite();

		// Re-render the Card Stack from scratch, 3 of 4:
		this.artistMaint.cardStackAppRerender();

	}

//-------------------------------------------------------------------------------------------------
// SUCCESSFUL DELETION:
// {  
// 	"message":"Artist deleted successfully"
// }
//-------------------------------------------------------------------------------------------------
// INVALID KEY FIELD:
// {  
// 	"error":{  
// 	   "message":"Cast to ObjectId failed for value \"5ccf06950ae71200047b6da2x\" at path \"_id\" for model \"artist\"",
// 	   "name":"CastError",
// 	   "stringValue":"\"5ccf06950ae71200047b6da2x\"",
// 	   "kind":"ObjectId",
// 	   "value":"5ccf06950ae71200047b6da2x",
// 	   "path":"_id"
// 	}
//  }
//-------------------------------------------------------------------------------------------------

	deleteSaveToMongoDb(index, id, _id, idMinusSpaces, parent) {

		//---------------------------------------------------------------------------------------
		// Normal processing:
		var url = "http://artistrest.herokuapp.com/artist/remove/" + _id;			// FOUND
		//---------------------------------------------------------------------------------------
		// Simulate a database error:
		//var url = "http://artistrest.herokuapp.com/artist/remove/" + _id + "x";	// NOT FOUND
		//---------------------------------------------------------------------------------------

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange=function() {

			// Clarification on closures in Javascript with AJAX:
			// https://stackoverflow.com/questions/7945781/clarification-on-closures-in-javascript-with-ajax

			// NOTE:   url, xhr, id, _id, idMinusSpaces & parent are available here because of closure.
			// NOTE 2: this = xhr - Due to closure, I could have used xhr instead of this.

			if (this.readyState === 4) {   	// complete
				if (this.status === 200) {	// OK

					var messageObject = JSON.parse(this.response);

					try {
						if(messageObject.error.message) {
							parent.setState({
								errorMessage: "Delete database failure for " + id +
									".  Error: " + messageObject.error.message
							});
						}
					}
					catch (error) {
						// Cause a cool deletion animation to occur via a CSS class,...
						document.getElementById("li" + idMinusSpaces).className="shrinkAndDisappear";

						// ...wait for the animation to complete and then do the actual deletion:
						setTimeout(parent.delete.bind(parent, index, idMinusSpaces), 500); // 1/2 second
					}
				}
			}
		}

		xhr.open('DELETE', url, true); // asynchronous = true
		xhr.send('');

	}

	getNewOffsets(clicked_entry) {

		//---------------------------------------------------------------------------------------
		// DESIGN NOTE: Cameron's original design used hardcoded data with a fixed number
		// of entries.  Five entries represent the "frame" (his concept, my term) within
		// which the Card Stack operates.  This solution is so elegant and so well functioning
		// that I saw no reason to upset it.  
		
		// With the introduction of filtering, result sets of fewer than five, even, potentially,
		// zero became possibile.  I came up with a work-around as follows:  Any time a result
		// set is fewer than five items, I augment it with dummy entries up to the frame size.
		// I make them invisible to the user but they still serve to make frame processing
		// function properly.

		// See Artist.constructor() where the legitimate entries have their "dummy" field set
		// to zero, indicating that the entry is not a dummy, ie, is a legitimate Artist item.

		// See Artists.loadReadFromWrite() where the result set is augmented with dummy entries,
		// if necessary.  Their dummy field is set to one, indicating that the entry is a dummy,

		// See Card.render() for where this dummy field is used to drive the visibility/
		// invisibility of the entry.
		//---------------------------------------------------------------------------------------

		// Calculate the frames.  Frame size = 5 artist closed headers:

		// NOTE: before clicked, 1 + clicked, 1 + after clicked, 3 = frame, 5
		// in "standard" configuration:

		var entries_before_clicked, entries_after_clicked;
		var frame_beginning, frame_end;

		switch(clicked_entry) {
			case 0:
				entries_before_clicked = 0;		// the first entry
				entries_after_clicked = 4;
				break;

			case this.state.artists.length - 1:	// the last entry
				entries_before_clicked = 4;
				entries_after_clicked = 0;
				break;

			case this.state.artists.length - 2:	// the second to last entry
				entries_before_clicked = 3;
				entries_after_clicked = 1;
				break;

			case this.state.artists.length - 3:	// the third to last entry
				entries_before_clicked = 2;
				entries_after_clicked = 2;
				break;

			default: 							// all other entries
				// Standard configuration
				entries_before_clicked = 1;
				entries_after_clicked = 3;
		}

		frame_beginning = clicked_entry - entries_before_clicked;
		frame_end       = clicked_entry + entries_after_clicked;

		//--------------------------------------------------------------------
		// Use the frames to setup the resulting GUI state:

		// Init:
		const newOffsets = this.initialTopOffsets.slice(); 

		// Load before clicked, using the "ceiling":
		for (var x = frame_beginning; x <= clicked_entry; x++) {
			newOffsets[x] = this.initialTopOffsets[frame_beginning];
		}

		// Load after clicked, using the "floor":
		for (var x = clicked_entry + 1; x <= frame_end; x++) {
			newOffsets[x] = this.initialTopOffsets[frame_end] + CARDSTACK_HEADER_HEIGHT;
		}

		//--------------------------------------------------------------------
		// Return the resulting GUI state:

		return newOffsets;

	};

	handleCardClick(index) {

		const initialState = {
			topOffsets: [],
			cardSelected: true,
		}

		const {cardSelected} = this.state;

		const newOffsets = this.getNewOffsets(index);

		const nextState = (prev, offset, index) => {

			// OBSOLETE To understand this process, see images:
			//   "cardstack handleCardClick.png" and "cardstack handleCardClick2.png"

			return {
				cardSelected: cardSelected ? false : true,
				topOffsets: [

					// "..." are spread attributes.  To understand these, see document "spread.txt".
					...prev.topOffsets,
					cardSelected ? this.initialTopOffsets[index] : newOffsets[index],
				],
			};
		};

		// Continue the process after the transition is complete:
		setTimeout(this.handleCardClickPostTransition.bind(this, index), 500); // 1/2 second
		
		// To understand the "reduce()" function, see document "reduce.txt".
		this.setState(this.state.topOffsets.reduce(nextState, initialState));

	}

	handleCardClickPostTransition(index) {

		// NOTE: The transition in question is the one where the Card opens up like a suitcase
		// and reveals its contents.  Unfortunately, this action causes screen rewrite problems
		// in the contents that ruin the whole effect.  To work around this, we will keep the
		// contents hidden until the Card is fully open and then show them.  When the card
		// closes we will hide them again:

		var cardDetail = document.getElementById("cardDetail" + index);

		// Toggle visibility:
		if(this.state.cardSelected == true) {
			cardDetail.style.visibility = "visible";
		}
		else {
			cardDetail.style.visibility = "hidden";
		}

	}	

	renderCards() {

		const cloneCard = (child, index) => React.cloneElement(child, {
			key: index,
			cardId: index,
			hoverOffset: this.props.hoverOffset,
			cardSelected: this.state.cardSelected,
			height: this.props.height,
			topOffset: this.state.topOffsets[index],
			onClick: this.handleCardClick.bind(this),
		});

		return this.props.children.map(cloneCard);

	}

	render() {

		const stackStyles = {

			...styles,
			background: this.props.background,
			height: this.props.height,
			width: 'var(--cardstack-width)',

		};

		return (

			<React.Fragment>

				<WorkingWebNodeJsServices.ShowErrorMessage errorMessage={this.state.errorMessage} width={'var(--cardstack-width)'} />

				{this.cardStackIndex.state.showArtistPopup
					? 
					// NOTE: This can't be bound once, in the constructor, because it serves two masters:
					// Add and Edit:
					<ArtistPopup /* text='Close Me' */ 
						/* artists={this.props.artists} */
						parent={this}						  					
					/>
					: null
				}

				{ this.cardStackIndex.state.showTimerProgressBar
					? 
					<TimerProgressBar parent={this} />
					: null
				}

				{
					this.cardStackIndex.state.showDeletePopup ? 
					<DeleteButtonWithConfirm parent={this}/>
					: null
				}

				<ul style={stackStyles}>
					{this.renderCards()}
				</ul>
						
			</React.Fragment>

		);
	}

}

const styles = {
	display: 'flex',
	flexDirection: 'column',
	position: 'relative',
	overflow: 'hidden',
	padding: 0,
	margin: 0,
};

CardStack.defaultProps = {
	width: 'var(--cardstack-width)',
	hoverOffset: 30,
};

export {CardStack};