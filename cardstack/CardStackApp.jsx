import * as WorkingWebNodeJsServices from '../app/WorkingWebNodeJsServices.js';

import React from 'react';
import {AnimatedRadioGroup} from '../modules/AnimatedRadioGroup.jsx';
import {CardStackIndex} from '../cardstack/CardStackIndex.jsx';
import {DataSources} from '../modules/DataSources.js';
import {DropDownCode} from '../modules/DropDownCode.jsx';
import {ThreeColorPalettes} from '../modules/ThreeColorPalettes.js';

import "../images/artistmaint192x192.png";

require('../cardstack/banner.css');
require('../modules/AnimatedRadio.css');
require('../modules/DropDown.css');


class CardStackApp extends React.Component {

	constructor(props) {
				
		super(props);

		// Component levels:
		this.artistMaint = 	this.props.parent;

		// NOTE: The value of this component level will be "hoisted up" from
		// the child, CardStackIndex:
		this.cardStackIndex;

		//--------------------------------------------------------------------------
		// NOTE: See DESIGN/PROCESSING ERROR and DESIGN/PROCESSING ERROR WORK-AROUND
		// for usage of these fields:
		this.state = {
			selectedReadArtistsIndex: -1,
			selectedWriteArtistsIndex: -1,
			selectedArtistId: '',
			selectedArtistIdMinusSpaces: '',
		};
		//--------------------------------------------------------------------------

		if(globalMainColor == "") {

			// Get a random three-color palette...
			var palette =
				ThreeColorPalettes.palette[
					WorkingWebNodeJsServices.getRandomNumber(
						0, 										// low
						ThreeColorPalettes.palette.length - 1	// high
					)
				];

			//...and use it to assign the app's colors...
			globalMainColor = palette.mainValue;
			globalAccentColor = palette.accentValue;
			globalAlertColor = palette.alertValue;

		}

		//...which will drive CSS variables:
		document.documentElement.style.setProperty('--mainColor',   globalMainColor);
		document.documentElement.style.setProperty('--accentColor', globalAccentColor);
		document.documentElement.style.setProperty('--alertColor',  globalAlertColor);

	}

	about() {
		
		WorkingWebNodeJsServices.open_popup_window(
			'http://www.workingweb.info/ArtistMaintNodeJsAbout',
			 true, 'no', 'no', 535, 895);
			 
	}

	componentDidMount() {
		
		try {
			// NOTE: The filtering has already been done.  Now just synch the GUI
			// with the content of the data:
			document.getElementById("decade").value = this.props.decade;
			document.getElementById("genre").value = this.props.genre;
			
		} catch (error) {}

	}
	
	handleDropDownClick(code) {

		// Set the filter criteria on the global artist object:
		if (code.codeId == "ArtistDecade") {

			this.artistMaint.artist.decade = parseInt(code.value);

			if (isNaN(this.artistMaint.artist.decade)) {
				this.artistMaint.artist.decade = 0;
			}

		}
		else if (code.codeId == "ArtistGenre") {
			this.artistMaint.artist.genre = code.value;
		}

		// Overlay the read database from the write database on the global artist
		// object.  In the process, the filter criteria will be applied:
		this.artistMaint.artist.loadReadFromWrite();

		// Re-render the Card Stack from scratch, 4 of 4:
		this.artistMaint.cardStackAppRerender();

	}

	handleRadioButtonChange(value) {

		if(value == "online") {
			globalOnlineData = true;
		}
		else {
			globalOnlineData = false;
		}

		// Disable body scrolling:
		document.body.className = "bodyScrollingDisabled";

		show_spinner();

		// NOTE: Body scrolling disablement is turned off by this code:

		// Re-render the Card Stack from scratch, X of 4:
		//this.artistMaint.cardStackAppRerender();
		this.loadJsBundle();

	}

	loadJsBundle() {
		
		// Reload the full React bundle script:
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.src = 'bundle.js';
		head.appendChild(script);

	}

	render() {

		const styles = {

			buttonStyles: {
				verticalAlign: 'top'
			},

			dropDownStyles: {
				width:"125px"
			},

			radioButtonStyles: {
				fontSize: '20px',

				/* centered on the card stack: */
				marginLeft: '147px'
			}

		}

		return (

			<React.Fragment>

				<div id="bannerDiv">
					<img id="bannerImage" src="artistmaint192x192.png" alt="Bowie Low"/>
					<span id="bannerText">Musical Artist DB Maintenance</span>
				</div>
				<br/>

				<div id="offline_online" style={styles.radioButtonStyles}>

					<AnimatedRadioGroup						
						initialSelectionIndex = {globalOnlineData == true ? 0 : 1}
						radioGroupLabelColor = {"var(--accentColor)"}

						/* AnimatedRadioGroup left margin part 2 of 2:
						Now bring only the left margins we want out to the desired width: */
						marginLeft = {'10px'}
						
						selectionLabelColor = {"var(--mainColor)"}
						selectionBorderColor = {"red"}
						selectionCheckColor = {"var(--accentColor)"}
						contentJsonObject = {DataSources}

						handleRadioButtonChange = {this.handleRadioButtonChange.bind(this)}
					/>

				</div>
				<br />

				{globalRetrievalError == "" ?

					(
						<span style={{whiteSpace:"nowrap"}}>

							{globalOnlineData == true &&
								<a href="javascript:void(0);" id="buttonAdd" className="button add" style={styles.buttonStyles}
									onClick={() => this.cardStackIndex.toggleArtistPopupShow("add", -1)}
								>Add</a>
							}

							{NBSP}
							{NBSP}

							<a href="javascript:void(0);" id="buttonAbout" className="button about" style={styles.buttonStyles}
								onClick={() => this.about()}>About</a>

							{NBSP}

							<span className="nav">
								<ul>
									<DropDownCode
										blank="true" 
										code="decade" 
										parent={this} 
										parentName="cardstackapp"
										value={this.artistMaint.artist.decade}
										width={styles.dropDownStyles.width}
									/>
									<DropDownCode
										blank="true" 
										code="genre" 
										parent={this} 
										parentName="cardstackapp"
										value={this.artistMaint.artist.genre}
										width={styles.dropDownStyles.width}
									/>
								</ul>
							</span>

							<CardStackIndex
								artists={this.props.artists}
								parent={this}
							/>

						</span>
					)
					
					: (
						<span>{globalRetrievalError}</span>
					)
				}
				
			</React.Fragment>

		);
	}
}

export {CardStackApp};