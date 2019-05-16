import * as WorkingWebNodeJsServices from '../app/WorkingWebNodeJsServices.js';

import Card from '../cardstack/Card.jsx';
import ErrorBoundary from '../modules/ErrorBoundary.jsx';
import React from 'react';
import {CardDetail} from '../cardstack/CardDetail.jsx';
import {CardStack} from '../cardstack/CardStack.jsx';


const CARDSTACK_HEADER_HEIGHT = 85;
const HEADER_IMAGE_HEIGHT = '83px';

class CardStackIndex extends React.Component {

	constructor(props) {

		super(props);

	    // Component levels:
		this.artistMaint = this.props.parent.props.parent;
		this.cardStackApp = this.props.parent;

		// "Hoist up" a reference of the child to the parent:
		this.cardStackApp.cardStackIndex = this;

		// This will be filled in CardStack.constructor():
		this.cardStackInstance;

		this.state = {
			showDeletePopup: false,
			wdReportHtmlString: "",
			yaReportHtmlString: "",

			videoArray: [],
			discogArray: [],

			showTimerProgressBar: false,
			timerProgressDataSource: '',
			timerProgressEntity: '',
			timerProgressDurationSeconds: 0,

			showArtistPopup: false,

			deleteButtonX: -1,
			deleteButtonY: -1,

		};

		this.openCardProps;
		this.WDorYA;

		// Constants:
		this.YOUTUBE_TIMER_SECONDS = 20;
		this.WIKIPEDIA_TIMER_SECONDS = 2;

		this.transaction;

	}

	componentDidMount() {

		// Turn off the spinner.  This spinner stuff operates outside the control
		// of React (modifying the DOM directly) otherwise it won't load in time to
		// be of any use:

		// NOTE: Re-loads will have a spinner, filters won't:
		try {
			hide_spinner();
		} catch (error) {}
		
	}

	getJson(artistId, prefix) {

		var json = "";
		
		var response =
			WorkingWebNodeJsServices.get_xml_http_request_via_proxy_server(prefix + artistId);

		if (response != "") {
			json = WorkingWebNodeJsServices.remove_response_packaging(response);				
		}
		
		return json;
		
	}

	getReport(artistId, prefix, searchFor) {

		// this = CardStackIndex

		var errorMessage = 
			WorkingWebNodeJsServices.get_xml_http_request_via_proxy_server_async(
				prefix + artistId,
				
				// Our results will show up here:
				this.getReportResponseCallBack(this, searchFor),
				this.getReportResponseError(this)
			);

		if(errorMessage != "") {
			this.getReportResponse(errorMessage);
		}

	}

	// Passing arguments to callback functions:
	// https://www.jstips.co/en/javascript/passing-arguments-to-callback-functions/
	// You can use closure scope in Javascript to pass arguments to callback functions.
	// NOTE: Scope "senderThis" refers to CardStackIndex.

	getReportResponse(report) {

		// this = CardStackIndex
		
		// Since we will be modifying the argument, let's make a copy and work with that:
		var report_edited = report;

		if(this.WDorYA == "WD") {

			if(report_edited.indexOf("Albums: 0") > -1) {
				report_edited = "No discography found.";
			}

			this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml = report_edited;
			this.setState(
				{wdReportHtmlString: report_edited},
				this.toggleTimerProgressBarHide()
			);

		} else if(this.WDorYA == "YA"){

			if(report_edited.indexOf("Artists found: 0") > -1) {
				report_edited = "No albums found.";
			}

			this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportHtml = report_edited;
			this.setState(
				{yaReportHtmlString: report_edited},
				this.toggleTimerProgressBarHide()
			);
		}

	}
		
	getReportResponseCallBack(senderThis, searchFor) {

		// this       = CardStackIndex
		// senderThis = CardStackIndex

		return function() {

			// this = XMLHttpRequest

			var report = "";

			var response = this.response;

			if (response.indexOf("An error has occurred") > -1) {
				report = response.substr(0, 100) + "...";
			}
			else if (response == "") {			
				report = "HTTP GET retrieval error";
			}
			else if (response.indexOf("Hardcoded") > -1) {
				report = response.substr(response.indexOf("Hardcoded"));
			}
			else {
				response = WorkingWebNodeJsServices.remove_response_packaging(response);				
				report = response.substring(response.indexOf(searchFor), response.indexOf("</body></html>"));
			}

			senderThis.getReportResponse(report);

		}

	}

	getReportResponseError(senderThis) {

		// this       = CardStackIndex
		// senderThis = CardStackIndex
		
		return function() {

			// this = XMLHttpRequest

			senderThis.getReportResponse("HTTP GET retrieval error");

		}

	}

	headerClick(props) {

		//-------------------------------------------------------------------------------------------------------------------------------------
		// DESIGN/PROCESSING ERROR:

		// This code generates the error "Can't call setState (or forceUpdate) on an unmounted component. This is a no-op,
		// but it indicates a memory leak in your application."  The error is generated specifically by the async call to
		// this.headerClickPostStateChange().

		// This is a carry-over from the "rebuild the tree" design of the program.
		// this.cardStackApp.setState(
		// 	{
		// 		selectedArtistId: props.id,
		// 		selectedArtistIdMinusSpaces: props.idMinusSpaces,
		// 		selectedReadArtistsIndex: props.index,
		// 		selectedWriteArtistsIndex: this.artistMaint.artist.findArtist(this.artistMaint.artist.writeArtists, props.id)
		// 	}
		// 	, ()=>this.headerClickPostStateChange(props)
		// );
		//-------------------------------------------------------------------------------------------------------------------------------------
		// DESIGN/PROCESSING ERROR WORK-AROUND:

		// Our state fields are only state fields for documentary purposes.  We will treat them as normal
		// fields and, instead of doing an async function call, we will do a normal, in-line call:
		
		this.cardStackApp.state.selectedArtistId = props.id;
		this.cardStackApp.state.selectedArtist_id = props._id;
		this.cardStackApp.state.selectedArtistIdMinusSpaces = props.idMinusSpaces;
		this.cardStackApp.state.selectedReadArtistsIndex = props.index;
		this.cardStackApp.state.selectedWriteArtistsIndex = this.artistMaint.artist.findArtist(this.artistMaint.artist.writeArtists, props.id);
		
		this.headerClickPostStateChange(props);
		//-------------------------------------------------------------------------------------------------------------------------------------

	}

	headerClickPostStateChange(props) {

		// If a card is open...
		if (this.openCardProps) {

			//...reset:
			this.openCardProps = null;
		} else {
			// Save these for later use:
			this.openCardProps = props;

			// Lookup the detail Discography data, if it hasn't been done already:
			this.lookupDetailDataWD(props.id)
		}

		// Continue processing the click:
		this.cardStackInstance.handleCardClick(props.index);

	}

	lookupDetailDataWD(searchArtistId) {

    	// Since we will be modifying the argument, let's make a copy and work with that:
		var searchArtistIdEdited = searchArtistId;

		this.WDorYA = "WD";

		// Online - HTML from Wikipedia:
		if (globalOnlineData == true) {

			if (this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml == "") {

				// Prep for a WikipediaDiscography lookup:
				searchArtistIdEdited = WorkingWebNodeJsServices.replace_all(searchArtistIdEdited, " ", "+");
				searchArtistIdEdited = WorkingWebNodeJsServices.replace_all(searchArtistIdEdited, "&", "%26");

				this.toggleTimerProgressBarShow('Wikipedia', 'discography', this.WIKIPEDIA_TIMER_SECONDS);

				this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml = 
					this.getReport(
						searchArtistIdEdited,
						"https://wikipediadiscography.herokuapp.com/?artist=",
						 "<a href="
					);
				
			}

		// Offline - JSON from WorkingWeb Database app:
		} else {

		    if (this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportJson == "") {

		    	// Encode/replace the characters that mess up the JSON Database Artist lookup:
				searchArtistIdEdited = WorkingWebNodeJsServices.prepArtistNameForJsonDbSearch(searchArtistIdEdited);

				this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportJson = 
					this.getJson(
						searchArtistIdEdited,
						"http://www.workingweb.info/database/ArtistDiscog/Get/?id="
					);
					// { "artistDiscog":[{ "id": "10cc", "wikipedia": "http://en.wikipedia.org/wiki/10cc", "section": [{ "sectionId": "Main Discography", "style": 1, "album": [{ "albumId": "10cc", "year": 1973}, { "albumId": "Sheet Music", "year": 1974}, { "albumId": "The Original Soundtrack", "year": 1975}, { "albumId": "How Dare You!", "year": 1976}, { "albumId": "Deceptive Bends", "year": 1977}, { "albumId": "Bloody Tourists", "year": 1978}, { "albumId": "Look Hear?", "year": 1980}, { "albumId": "Ten Out of 10", "year": 1981}, { "albumId": "Windows in the Jungle", "year": 1983}, { "albumId": "...Meanwhile", "year": 1992}, { "albumId": "Mirror Mirror", "year": 1995}]}]}]}

				if(this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportJson.length < 30) {
					this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml = "Discography not found.";
				}
				else {

					//----------------------------------------------------------------------------------
					// This code copied from:
					// wikipedia_discography.get_HTML_report_from_JSON_string(JSON_string)

					// In file:
					// C:\a_dev\ASP\WikipediaDiscography\WikipediaDiscography\WikipediaDiscography.js
					//----------------------------------------------------------------------------------
					
					var artist_discography_object = JSON.parse(this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportJson);

					this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml = ""; // init
					
					if(artist_discography_object.artistDiscog) {

						// Level 1 of 3, the Artist loop using the "i" index:
						for (var i = 0; i < artist_discography_object.artistDiscog.length; i++) {
				
						//report_HTML_string += "<br><span id='report_level_1'>" + artist_discography_object.artistDiscog[i].id + "</span><br>";
							this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml += "<br>";
				
							if (artist_discography_object.artistDiscog[i].wikipedia == "") {
								this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml += "Hardcoded discography";
							}
							else {
								this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml +=
									'<a href="' + artist_discography_object.artistDiscog[i].wikipedia + '" target="_blank">' +
									artist_discography_object.artistDiscog[i].wikipedia + '</a>';
							}
							this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml += "<br>";
				
							// Level 2 of 3, the Section loop using the "j" index:
							for (var j = 0; j < artist_discography_object.artistDiscog[i].section.length; j++) {
				
								this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml +=
									"<br><span id='report_level_2'>" + artist_discography_object.artistDiscog[i].section[j].sectionId +
									" (style " + artist_discography_object.artistDiscog[i].section[j].style.toString() + ")</span><br>";
				
								// Level 3 of 3, the Album loop using the "k" index:
								for (var k = 0; k < artist_discography_object.artistDiscog[i].section[j].album.length; k++) {
				
									this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml +=
										"<span id='report_level_3'>" +
										artist_discography_object.artistDiscog[i].section[j].album[k].year + " " +
										artist_discography_object.artistDiscog[i].section[j].album[k].albumId + "</span><br>";
								}
							}
						}
					}
				}
			}

			this.setState(
				{wdReportHtmlString: this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml}
			);
			
		}

	}

	lookupDetailDataYA(searchArtistId) {

    	// Since we will be modifying the argument, let's make a copy and work with that:
		var searchArtistIdEdited = searchArtistId;

		this.WDorYA = "YA";

		// Online - HTML from YouTube:
		if (globalOnlineData == true) {

			if (this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportHtml == "") {

				// Prep for a YoutubeAlbum lookup:
				searchArtistIdEdited = WorkingWebNodeJsServices.replace_all(searchArtistIdEdited, " ", "+");

				this.toggleTimerProgressBarShow('YouTube', 'albums', this.YOUTUBE_TIMER_SECONDS);
				
				this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportHtml = 
					this.getReport(
						searchArtistIdEdited,
						"https://youtubealbum.herokuapp.com/?artist=",
						 "<img id="
					);

			}

		// Offline - JSON from WorkingWeb Database app:
		} else {

		    if (this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportJson == "") {

		    	// Encode/replace the characters that mess up the JSON Database Artist lookup:
				searchArtistIdEdited = WorkingWebNodeJsServices.prepArtistNameForJsonDbSearch(searchArtistIdEdited);

				this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportJson = 
					this.getJson(
						searchArtistIdEdited,
						"http://www.workingweb.info/database/ArtistVideo/Get/?id="
					);
					// { "artistVideo":[{ "id": "10cc", "video": [{ "videoId": "d1VBslZgMLw", "title": "10cc Mirror Mirror UK Version Full Album", "description": "This is the eleventh and final studio album by the english rock band 10cc released in 1995 The album was more or less 2 solo albums by Eric Stewart and", "image": "https://i.ytimg.com/vi/d1VBslZgMLw/default.jpg", "seconds": 3537}, { "videoId": "4i3ssp2vt90", "title": "10cc How dare you sideB", "description": "", "image": "https://i.ytimg.com/vi/4i3ssp2vt90/default.jpg", "seconds": 1237}, { "videoId": "2isENXPNjpE", "title": "Windows In the Jungle by 10cc 1983 Full Album", "description": "1983 000 24 Hours 757 Feel The Love Oomachasaooma 1300 Yes I Am 1854 Americana Panorama 2234 City Lights 2604 Food For Thought", "image": "https://i.ytimg.com/vi/2isENXPNjpE/default.jpg", "seconds": 2483}, { "videoId": "gv3r8a9hUNc", "title": "10cc Mirror Mirror Worldwide Bandcamp Version full abum from 1995", "description": "This is the new model version with the woman looking into the mirror Playlist 1 Yvonnes The One 0427 2 Code of Silence 0541 3 Blue Bird 0406 4 Age of", "image": "https://i.ytimg.com/vi/gv3r8a9hUNc/default.jpg", "seconds": 3848}, { "videoId": "oF22QR0w5xo", "title": "10cc music videos from The Complete Hit Album part 1", "description": "", "image": "https://i.ytimg.com/vi/oF22QR0w5xo/default.jpg", "seconds": 1904}, { "videoId": "oF22QR0w5xo", "title": "10cc music videos from The Complete Hit Album part 1", "description": "", "image": "https://i.ytimg.com/vi/oF22QR0w5xo/default.jpg", "seconds": 1904}, { "videoId": "6Yo7DpjFzno", "title": "10cc music videos from The Complete Hit Album part 2", "description": "", "image": "https://i.ytimg.com/vi/6Yo7DpjFzno/default.jpg", "seconds": 2333}]}]}

				if(this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportJson.length < 30) {
					this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportHtml = "No albums found.";
				}
				else {

					//----------------------------------------------------------------------------------
					// This code copied from:

					// youtube_album.step_E_final_write() and
					// youtube_album.write_album(video_id, title, description, image, duration)

					// In file:
					// C:\a_dev\ASP\YoutubeAlbum\YoutubeAlbum\YoutubeAlbum.js
					//----------------------------------------------------------------------------------

					var artist_albums_object = JSON.parse(
						this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportJson
					);
	
					this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportHtml = ""; // init
	
					if(artist_albums_object.ExceptionMessage) {
						this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportHtml = "No albums found.";
					}
					else {
						var YOUTUBE_VIDEO_PREFIX  = "https://www.youtube.com/watch?v=";
	
						for (var i = 0; i < artist_albums_object.artistVideo[0].video.length; i++) {
	
							// Append the video's detail information to a row on the form.  Append the album to
							// the report:                            
							this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportHtml +=
						
								"<br />" +
								"<img id='thumbnail' alt='' src='" +
									artist_albums_object.artistVideo[0].video[i].image +
									"'/>" +
									"<br />" +
						
									WorkingWebNodeJsServices.format_seconds_as_time(artist_albums_object.artistVideo[0].video[i].seconds) +
									//"<br />" +
									"<br />" +
						
									"<a href='" +
									YOUTUBE_VIDEO_PREFIX +
									artist_albums_object.artistVideo[0].video[i].videoId +
									"'>" + artist_albums_object.artistVideo[0].video[i].title + "</a>" +
									"<br />" +
						
									"<textarea id='description' class='AlbumTextArea' rows='1' cols='1' readonly " + ">" +
									artist_albums_object.artistVideo[0].video[i].description +
									"</textarea>"
									// +
									//"<br />" +
									//"<br />";
						}
					}	
				}
			}

			this.setState(
				{yaReportHtmlString: this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportHtml}
			);

		}

	}

	tabChangePreProcess(activeTab) {

		// If the current tab is WD, the user is clicking the YA tab:
		if(activeTab == "Wikipedia Discography") {

			// Lookup the detail Album data, if it hasn't been done already:
			this.lookupDetailDataYA(this.cardStackApp.state.selectedArtistId);

		}

	}

	toggleArtistPopupHide() {

		// Hide the popup:
		this.setState({showArtistPopup: false});

		// Re-enable scrolling:
		document.body.className = "";

	}

	toggleArtistPopupShow(transaction, selectedReadArtistsIndexArg) {

		if (typeof transaction == "string") {

			this.transaction = transaction;
			this.cardStackApp.state.selectedReadArtistsIndex = selectedReadArtistsIndexArg;
		
		}

		this.setState({showArtistPopup: true});

		// Body Scrolling Disablement 2 of 3:

		// NOTE: When the user presses the Save button, this popup closes indirectly, by
		// reloading the Card Stack.  In that case, the variable "showArtistPopup" never
		// gets set to false, below.  Body scrolling disablement is turned off elsewhere
		// (unlike toggleDeletePopup(), below).  That location is in CardStack's constructor
		// (this.state.showArtistPopup: false).  When the user presses the Cancel button,
		// body scrolling disablement is turned off by this code:

		if (this.state.showArtistPopup == true) {
			document.body.className = "";
		}
		else {
		 	document.body.className = "bodyScrollingDisabled";
		}

	}

	toggleDeletePopup() {

		this.setState({showDeletePopup: !this.state.showDeletePopup});

		// Body Scrolling Disablement 3 of 3:
		if (this.state.showDeletePopup == true) {
			document.body.className = "";
		}
		else {
			document.body.className = "bodyScrollingDisabled";
		}

	}	

	toggleTimerProgressBarHide() {

		// Hide the popup:
		this.setState({showTimerProgressBar: false});

		// Re-enable scrolling:
		document.body.className = "";

	}

	toggleTimerProgressBarShow(dataSource, entity, timerDurationSeconds) {

		this.setState({
			showTimerProgressBar: true,
			timerProgressDataSource: dataSource,
			timerProgressEntity: entity,
			timerProgressDurationSeconds: timerDurationSeconds
		});

		// Body Scrolling Disablement 2 of 3:

		// NOTE: When the user presses the Save button, this popup closes indirectly, by
		// reloading the Card Stack.  In that case, the variable "showArtistPopup" never
		// gets set to false, below.  Body scrolling disablement is turned off elsewhere
		// (unlike toggleDeletePopup(), below).  That location is in CardStack's constructor
		// (this.state.showArtistPopup: false).  When the user presses the Cancel button,
		// body scrolling disablement is turned off by this code:

		if (this.state.showTimerProgressBar == true) {
			document.body.className = "";
		}
		else {
		 	document.body.className = "bodyScrollingDisabled";
		}

	}

	render() {

		return (

			<React.Fragment>
				<ErrorBoundary>

					<CardStack
						height={CARDSTACK_HEADER_HEIGHT * this.props.artists.length}
						hoverOffset={25}					
						artists={this.props.artists}
						parent={this}
					>
						{
							this.props.artists.map(
							(
								artist, i) =>	
									<Card 
										key={artist.id}	
										id={artist.id}
										image={artist.image}
										background={artist.background}
										textColor={artist.textColor}
										index={artist.index} 
										idMinusSpaces={artist.idMinusSpaces}
										dummy={artist.dummy}
									>
											<ArtistCard 
												{...artist}
												parent={this}
											/>
									</Card>
							)  
						}
					</CardStack>
					
				</ErrorBoundary>
			</React.Fragment>

		);
	}

}

//-------------------------------------------------------------------------------------------------------------
const ProfilePicture = ({image, thumbnail, style}) => (
	<img style={style} src={thumbnail || image} name='artistImage' />
);

const ArtistCard = (props) => (

 	<div style={Object.assign({}, styles.artistCardStyle, {color: props.textColor})} onClick={props.onClick}>

		<header style={styles.cardHeader} id={props.id} name={props.index}
			onClick={() => props.parent.headerClick(props)}
	>
			<ProfilePicture image={props.image} thumbnail={props.thumbnail} src={props.thumbnail || props.image} 
			    style={styles.imageStyle}
			/>

			<div style={{color: props.textColor}}>
				<h1 style={styles.headerId}>{props.id}</h1>
				<h3 style={styles.headerDecade}>
					{
						props.parent.artistMaint.code.getDecadeDescription(props.decade) + " " +
					 	props.parent.artistMaint.code.getGenreDescription(props.genre)
					}
				</h3>
			</div>

		</header>

		<CardDetail
			{...props}
			parent={props.parent}
		></CardDetail>

	</div>

);

const styles = {

	artistCardStyle: {
		position: 'absolute',
		top: 0,
	},

	cardHeader: {
		display: 'flex',
		height: CARDSTACK_HEADER_HEIGHT,
		justifyContent: 'space-between',
		alignItems: 'center',
		color: '#fff',
	},

	headerDecade: {
		margin: '4px 0 0',
		fontWeight: 300,
		fontSize: '20px',
		opacity: 0.8,
		textAlign: 'right',
		paddingRight: '10px'
	},

	headerId: {
		margin: 0,
		fontWeight: 500,
		fontSize: '25px',
		textAlign: 'right',
		paddingRight: '10px'
	},
	
	imageStyle: {
		width: HEADER_IMAGE_HEIGHT,
		height: HEADER_IMAGE_HEIGHT,
		borderRadius: '100%',
	}

};

export {CardStackIndex, CARDSTACK_HEADER_HEIGHT};