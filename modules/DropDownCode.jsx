import React from 'react';

import * as WorkingWebNodeJsServices from '../app/WorkingWebNodeJsServices.js';


class DropDownCode extends React.Component {

	constructor(props) {

		// Constants:
		const ALL = '< all >';

		super(props);

		// Component levels:
		if(this.props.parentName == "cardstackapp") {
			this.cardStackApp = this.props.parent;
			this.artistMaint = this.props.parent.props.parent;
		}
		else {this.props.parentName == "artistpopup"
			this.cardStackApp = this.props.parent.props.parent.props.parent.props.parent;
			this.artistMaint = this.props.parent.props.parent.props.parent.props.parent.props.parent;
		}

		// NOTE: As of 8-31-2018, the official sources of this data...

		//	http://www.workingweb.info/database/Code/Get/?codeId=ArtistDiscogStyle
		//	http://www.workingweb.info/database/Code/Get/?codeId=ArtistDecade

		// ... are generating invalid JSON.  As a work-around, I will use these
		// local copies:

    	// Copy the array contents:
		if (this.props.code == "genre") {
			this.dropDownJsonObject = this.artistMaint.code.genres.slice(0);
		}
		else if (this.props.code == "decade") {
			this.dropDownJsonObject = this.artistMaint.code.decades.slice(0);
		}

		if(this.props.blank == "true") {

			// Load an empty selection to indicate that no filter should take place.  Insert it into
			// the beginning of the array:
			this.dropDownJsonObject.unshift(
				JSON.parse(
					'{"codeId":"' + this.dropDownJsonObject[1].codeId + '",' +
					'"value":"",' +
				 	'"description":"' + ALL + '"}')
			);

		}

		//-------------------------------------
		// HOVER/MOUSEOVER PROCESSING 1 OF 5:
	    this.parent;   
		this.border;
		this.children;
		//-------------------------------------

	}

	componentDidMount() {

		//------------------------------------------------------------------------------
		// HOVER/MOUSEOVER PROCESSING 2 OF 5:

		this.parent = document.getElementById(this.props.parentName + this.props.code);   
		this.border = this.parent.style.border;
		
		// Get Elements using CSS Selector Syntax:
		this.children = this.parent.querySelectorAll("ul.drop-menu li");
		//------------------------------------------------------------------------------

	}

	handleDropDownClick(code) {

		//------------------------------------------------------------------
		// HOVER/MOUSEOVER PROCESSING 3 OF 5:

		// Manually hide the dropdown and all its items:
		this.parent.style.border = "none";
		Array.from(this.children).map(child =>  // children is a NodeList
			child.style.visibility = "hidden"
		);
		//------------------------------------------------------------------

		// Get the values selected by the user:
		this.value = code.value;
		this.valueDescription = code.description;

		if (code.codeId == "ArtistDecade") {

			if(this.value != this.props.parent.state.decade) {
				this.props.parent.setState(
					{decade: this.value},
					this.props.parent.showSaveCheck(
						this.props.parent.state.id,
						this.value, // decade
						this.props.parent.state.genre,
						this.props.parent.state.ximage
					)
				);
			}
		}
		else if (code.codeId == "ArtistGenre") {

			if(this.value != this.props.parent.state.genre) {
				this.props.parent.setState(
					{genre: this.value},
					this.props.parent.showSaveCheck(
						this.props.parent.state.id,
						this.props.parent.state.decade,
						this.value, // genre
						this.props.parent.state.ximage
					)
				);
			}
		}

	}

	onMouseOver(e, code, value) {

		try {
			//----------------------------------------------------------------------------
			// HOVER/MOUSEOVER PROCESSING 4 OF 5:

			// Determine if you are hovering over the top entry:

			// If no selection has been made, or...
			// "genre<br>< all ><br>chill/downtempo..." to "genre"
			if(e.target.innerText.toLowerCase().indexOf(code) == 0 ||

			//...a selection has been made: 
			// "COUNTRY<br>< ALL ><br>CHILL/DOWNTEMPO..." to "COUNTRY"
			e.target.innerText.toUpperCase().indexOf(value) == 0 )
			{

				// If we have manually hidden the dropdown...
				if(this.parent.style.border == "none") {

					//...manually show the dropdown and all its items:
					this.parent.style.border = this.border;
					Array.from(this.children).map(child => // children is a NodeList
						child.style.visibility = "visible"
					);
				}
			}

		} catch (error) {}
		//----------------------------------------------------------------------------

	}

	renderDropDownSelection(code, value, description) {

		if (value == "") {
			return <span style={{fontWeight:'bold'}}>{WorkingWebNodeJsServices.CapitlizeString(code)}</span>
		}
		else {
			return <span>{description}</span>
		}

	}

	render() {

		const styles = {
	
			dropDownInputBind: {
				width: '50px',
				height: '34px',
				color: 'black',
				backgroundColor: 'yellow',

				display: 'none'			// production
			  //display: 'inline-block'	// testing
			},

			listItemStyle: {
				width: this.props.width
			}

		}

		return (

			<React.Fragment>

				<input

					// NOTE: ArtistPopup's use of this component passes as props handleDecadeChange() and
					// handleGenreChange() because there we are doing data-entry. CardStackApp's use is not
					// so onClick(), below, is sufficient for it.

					// A side-effect is this warning which we suppress as follows:
					// "Failed prop type: You provided a `value` prop to a form field without an `onChange`
					// handler.  This will render a read-only field. If the field should be mutable use
					// `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
					readOnly 

					id={this.props.code}
					style={styles.dropDownInputBind}
					type={this.props.code}
					value={this.props.value}
				/>

				<li
					// This class has "position: fixed" and "z-index: 9" which allows the
					// dropdown to occur in front of the card stack:
					className="DropDownDown"

					style={styles.listItemStyle}

					//--------------------------------------------------------------------------
      				// HOVER/MOUSEOVER PROCESSING 5 OF 5:
					onMouseOver={(e) => this.onMouseOver(e, this.props.code, this.props.value)}
					//--------------------------------------------------------------------------
				>

					{
						this.props.code == "decade" ?
							this.renderDropDownSelection(
								this.props.code,
								this.props.value,
								this.artistMaint.code.getDecadeDescription(this.props.value)
							)
						:
							this.renderDropDownSelection(
								this.props.code,
								this.props.value,
								this.artistMaint.code.getGenreDescription(this.props.value)
							)
					}
						<ul 
							className="drop-menu menu-5"
							id={this.props.parentName + this.props.code}
							value={this.props.value}
						>
								{
									this.dropDownJsonObject.map(
										(code, i) =>
											 <li
												index={i}
												key={code.value}
												value={code.value}
												onClick=
												{
													this.props.parentName == "cardstackapp" ?
														(e) => this.props.parent.handleDropDownClick(code)
													:
														(e) => this.handleDropDownClick(code)
												}
											>{code.description}</li>
									)  
								}
						</ul>
				</li>

			</React.Fragment>
		);
	}
}

export {DropDownCode};