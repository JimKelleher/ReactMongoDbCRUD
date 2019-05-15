import React from 'react';
import {AnimatedRadioLabel} from '../modules/AnimatedRadioLabel.jsx';


class AnimatedRadioGroup extends React.Component {

	constructor(props) {

		super(props);

		// Load up an array full of "O", one for each selection:
		this.valuesOffOnAllOff = [];
		this.props.contentJsonObject.selection.map(() => this.valuesOffOnAllOff.push(false));

        this.state = {
			valueOffOn: this.valuesOffOnAllOff,
			userSelectedEntry: -1,
			userSelectedValue: ""
		}

		this.selectedIndex = -1; // init

	}

	componentDidUpdate() {

		if(this.state.userSelectedEntry > -1) {
			this.props.handleRadioButtonChange(this.state.userSelectedValue);
		}

	}

	componentWillMount() {

		this.selectedIndex = this.props.initialSelectionIndex;
		this.radioGroupUpdate()

	}

	radioGroupUpdate() {

		// NOTE: This process, as opposed to "Radio.radioGroupUpdate()", happens at startup and, as such,
		// has no animation:

        // Overlay all as "off/unchecked":
        var localOffOnArray = this.valuesOffOnAllOff.slice(0);

        // Set the initial entry as "on/checked":
        localOffOnArray[this.selectedIndex] = true;

        // Save the values and render the changes:
		this.setState({
      		valueOffOn: localOffOnArray,
        	userSelectedEntry: this.selectedIndex,
          	userSelectedValue: this.props.contentJsonObject.selection[this.selectedIndex].value
		})

    }

	render() {

		const styles = {

			radioGroupLabel: {
				color: this.props.radioGroupLabelColor,
				fontWeight: 'bold',
				marginLeft: this.props.marginLeft
			}

		}

		return (

			<span id={this.props.contentJsonObject.group} style={{whiteSpace:"nowrap"}}>

				<span style={styles.radioGroupLabel}>{this.props.contentJsonObject.label + ":"}</span>
				{
					this.props.contentJsonObject.selection.map(
							(xAnimatedRadio, i) =>	

								<AnimatedRadioLabel 
								    key={i}	
									index = {i}
									parent = {this}
									valueOffOn = {this.state.valueOffOn[i]}
								/>
					)  
				}
			</span>

		);
	}

}

export {AnimatedRadioGroup};