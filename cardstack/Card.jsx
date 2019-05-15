import React from 'react';
import {CARDSTACK_HEADER_HEIGHT} from '../cardstack/CardStackIndex.jsx';

require('../modules/DeletionAnimation.css');


class Card extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			hover: false,
		};
		
	}

	render() {

		const {cardId, cardSelected, topOffset, hoverOffset} = this.props;
		const offset = (cardId !== 0) && this.state.hover && !cardSelected ? hoverOffset : 0;
		const transform = `translate3d(0,${topOffset - offset}px,0)`;

		const spreadStyles = {

			// This is for debugging positioning:
			/* opacity: .5, */
		
			position: 'absolute',
			top: 0,
			width: '100%',
			cursor: 'pointer',
			transition: '0.5s transform ease',
			WebkitTransition: '-webkit-transform 0.5s ease',
			
		};

		const styles = {

			cardStyles: {
				...spreadStyles,
				background: this.props.background,
				transform,
				WebkitTransform: transform,
				height: CARDSTACK_HEADER_HEIGHT,
				zIndex: 'auto'
			},

			cardVisible: {
				visibility: this.props.dummy == 1 ? "hidden":"visible"
			}

		};

		return (

			<div style={styles.cardVisible}>

				<li style={styles.cardStyles}
					onMouseEnter={() => this.setState({hover: true})}
					onMouseLeave={() => this.setState({hover: false})}>

					<div
						id={"li" + this.props.idMinusSpaces}
						dummy={this.props.dummy}
						index={this.props.index}
						className={""}
					>
						{this.props.children}
					</div>
				</li>

			</div>

		);
	}

}

export default Card;