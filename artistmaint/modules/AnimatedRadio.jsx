import React from 'react';


class AnimatedRadio extends React.Component {

	constructor(props) {

        super(props);

        // Bindings:
        this.animationsComplete = this.animationsComplete.bind(this);

        // Component levels:
        this.animatedRadio = this.props.parent;
        this.animatedRadioGroup = this.props.parent.props.parent;

        this.state = {
            paperPlaneClassName: "fa fa-paper-plane-o fa-2x",
            paperPlaneVisibility: "hidden",
            circleClassName: "fa fa-circle-o fa-stack-2x"
        }  
        
        // Save:
        this.initialState = this.state;
        
        this.selectedIndex = -1; // init

    }

    animationsComplete () {

        this.radioGroupUpdate();
    }
    
    componentDidMount () {

        const element = document.getElementById('radio_' + this.props.id);
        element.addEventListener('animationend', this.animationsComplete);
    }

    componentWillUnmount () {

        const element = document.getElementById('radio_' + this.props.id);
        element.removeEventListener('animationend', this.animationsComplete);
    }

    handleClickEvent(index) {

        // NOTE: If there is no change, don't do any work:
        if (index != this.animatedRadioGroup.state.userSelectedEntry) {

          this.selectedIndex = index;

            // These two changes, together, cause the animation to fire.

            // HIDE ICON 1 of 2:

            // NOTE: Using "visibility=visible/hidden" achieves the animation I desire but, unfortunately,
            // the animation icon takes up space on the screen even though it is not visible during the
            // execution of the animation.  "display=inline/none" does not take up space but is not
            // animatable.  My solution was to set the width of the animation icon to "0px", below:
            
            this.setState({
                paperPlaneVisibility: "visible",
                paperPlaneClassName: this.state.paperPlaneClassName + " runPaperPlaneAnimation",    // append:
                circleClassName:     this.state.circleClassName     + " runBoomAnimation"           // append:
            });
    
        }
    
    }

    radioGroupUpdate() {

        // NOTE: This process parallels "AnimatedRadioGroup.radioGroupUpdate()" with
        // animation added:
          
        // Overlay all as "off/unchecked":
        var localOffOnArray = this.animatedRadioGroup.valuesOffOnAllOff.slice(0);

        // Set the user-selected entry as "on/checked":
        localOffOnArray[this.selectedIndex] = true;

        // Save the values and render the changes:
        this.animatedRadioGroup.setState({
            valueOffOn: localOffOnArray,
            userSelectedEntry: this.selectedIndex,
            userSelectedValue: this.animatedRadioGroup.props.contentJsonObject.selection[this.selectedIndex].value
        },
            // Reset the paper plane animation:
            () => this.setState(this.initialState)
        )

    }

	render() {

        const styles = {

            checkStyle: {
                color: this.props.checkColor
            },

            circleStyle: {
                color: this.props.circleColor
            },

            outerStyle: {
                fontSize: this.props.fontSize
            },

            paperPlaneStyle: {
                fontSize: this.props.fontSize,
                color: this.props.paperPlaneColor,
                visibility: this.state.paperPlaneVisibility,

                // HIDE ICON 2 of 2:
                width: '0px'
            }

        }

		return (

            <span id={'radio_' + this.props.id}>

                <span
                    id={this.props.id}
                    onClick={()=>{this.handleClickEvent(this.props.index);}}                    
                    className="fa-stack fa-2x" style={styles.outerStyle}
                >

                    <i 
                       id={this.props.id + "Circle"} className={this.state.circleClassName}
                       style={styles.circleStyle}></i>

                        {this.props.value == true &&
                            <i className="fa fa-check fa-stack-1x" 
                               style={styles.checkStyle}
                    >
                    </i>}
                </span>

                <i 
                    id={this.props.id + "PaperPlane"} 
                    className={this.state.paperPlaneClassName} 
                    style={styles.paperPlaneStyle}
                >
                </i>

            </span>  

        );

	}

}

export {AnimatedRadio};