import React from 'react';
import Tabs from '../modules/tabs.jsx';

require('../modules/tabs.css');

// WD/YA report CSS 1 of 5:
// See document "work around.rtf"
require('../modules/button.css');
require('../modules/WikipediaDiscography.css');
require('../modules/YoutubeAlbum.css');


class CardDetail extends React.Component {

    constructor(props) {

        super(props);

		// Component levels:
		this.artistMaint =  this.props.parent.props.parent.props.parent;
		this.cardStackApp = this.props.parent.props.parent;
		this.cardStackIndex = this.props.parent;
		
	}

	startHandleDeleteClick = (e) => {

		// Determine the rectangle (button) that the mouse was clicked on:
		var rect = e.target.getBoundingClientRect();

		// Debug:
		//console.log(rect.top, rect.right, rect.bottom, rect.left);

		// rect top		rect.right		rect.bottom		rect.left
		//       15 		   190 				 36 		  123
		//			   		  -123 		   		-15
		// -------------------------------------------------------
		// 		 Y		     	67 wdth		 	 21 hght		X

		// X=118    Y=16

		// Y=offset Top		 15
		// X=offset Left	123

		// Use the rectangle info to derive the X and Y coordinates of the button
		// (I would imagine it would be easier to get, but it isn't):
		this.cardStackIndex.setState(
			{
				deleteButtonX: rect.right - rect.left,	// offset Left X
				deleteButtonY: rect.top					// offset Top Y
			}
		), 
	    this.cardStackIndex.toggleDeletePopup();

	}	

    render() {

		const styles = {

			detailContainer: {
				overflowY: "scroll",
				height: "340px",
				width: "var(--cardstack-minus-scrollbar-margin)"
			},

			detailVisible: {
				visibility: 'hidden',
			},
		
			// WD/YA report CSS 3 of 5:
			WdYaReportBodyOverride: {
				color: "black",
				fontSize: "20px",
				overflowX: 'hidden'
			}
		
		};

		return (

			<div style={styles.detailContainer}>
				<div id={"cardDetail" + this.props.index} style={styles.detailVisible}>

					<table>
						<tbody>
							<tr>
								<td className="buttonTd">
									{globalOnlineData == true &&
										<a href="javascript:void(0);" id="buttonEdit" className="button edit" 
											onClick={() => {this.cardStackIndex.toggleArtistPopupShow("edit", this.props.index)}}
										>Edit</a>
									}
								</td>

								<td>
									{globalOnlineData == true &&
									<span>
										{NBSP}
										<a href="javascript:void(0);" id="buttonDelete" className="button xdelete" 
											onClick={(e) => this.startHandleDeleteClick(e)}
										>Delete</a>
									</span>
									}
								</td>
							</tr>							
						</tbody>
					</table>

				    {/* WD/YA report CSS 2 of 5: */}
					<Tabs parent={this}>

						<div label="Wikipedia Discography">
							<div style={styles.WdYaReportBodyOverride}>
								<div dangerouslySetInnerHTML={{ __html: this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex] ? this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].WdReportHtml : null }}>
								</div>
							</div>
						</div>

						<div label="YouTube Albums">
							<div style={styles.WdYaReportBodyOverride} className="newspaper">
								<div dangerouslySetInnerHTML={{ __html: this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex] ? this.artistMaint.artist.writeArtists[this.cardStackApp.state.selectedWriteArtistsIndex].YaReportHtml : null }}>
								</div>
							</div>
						</div>

					</Tabs>

				</div>
			</div>

		)
    }
    
}

export {CardDetail};