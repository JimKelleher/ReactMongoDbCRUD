import React from 'react';
import {AnimatedRadio} from '../modules/AnimatedRadio.jsx';

import * as WorkingWebNodeJsServices from '../app/WorkingWebNodeJsServices.js';


class AnimatedRadioLabel extends React.Component {

	constructor(props) {

		super(props);

	    // Component levels:
		this.animatedRadioGroup = this.props.parent;

	}

	render() {

		const styles = {

			selectionLabel: {
				color: this.animatedRadioGroup.props.selectionLabelColor,
				marginLeft: this.animatedRadioGroup.props.marginLeft,
				textDecoration: this.props.valueOffOn == true ? 'underline' : 'none'
			}
		
		}

		return (

			<React.Fragment>

				{/* NOTE: Unfortunately, the <label>/htmlFor construct only works for input elements.  We
				will simulate it here using a <span>: */}
				<span
				 	/* Simulate a label click: */
				 	onClick={()=>{WorkingWebNodeJsServices.triggerEvent(
						this.animatedRadioGroup.props.contentJsonObject.selection[this.props.index].value,
					  	"click"
					)}}
				 	title={this.animatedRadioGroup.props.contentJsonObject.selection[this.props.index].title}
					style={styles.selectionLabel}
				>
						{this.animatedRadioGroup.props.contentJsonObject.selection[this.props.index].label + ":"}
				</span>

				<AnimatedRadio
					id={this.animatedRadioGroup.props.contentJsonObject.selection[this.props.index].value}
					checkColor={'var(--accentColor)'}
					circleColor={'var(--mainColor)'}
					fontSize={'18px'}
					index={this.props.index}
					paperPlaneColor={'var(--alertColor)'}
					parent={this}
					value={this.props.valueOffOn}					
				/>

			</React.Fragment>
			
		);
	}

}

export {AnimatedRadioLabel};