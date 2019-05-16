import React from 'react';


class TimerProgressBar extends React.Component{

  constructor(props) {
    
    super(props);
    
    // Component levels:
    this.cardStackApp = this.props.parent.props.parent.props.parent;
    this.cardStackIndex = this.props.parent.props.parent;

  }

  componentDidMount() {

    // Constants:
    const ONE_SECOND = 1000;
    const progressElement = document.getElementById("progressBar");

    var downloadTimer = setInterval(() => {
      progressElement.value++;
    
      if (progressElement.value >= progressElement.max) {
        clearInterval(downloadTimer);
      }
    }, ONE_SECOND);

  }

  render() {

      const styles = {

        timerProgressBarInnerStyles: {
          position: 'absolute',
          left: '25%',
          right: '25%',
          top: '25%',
          bottom: '25%',
          margin: 'auto',
          background: 'silver',
          borderStyle: 'ridge',
          borderWidth: 'thick',
          fontSize: '20px',
          width: '375px',
          height: '115px',
          textAlign: 'center'
        },
      
        timerProgressBarStyles: {
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
      
          zIndex: 9 /* Front-to-back window order 1 of 2: In the front */
      
        }
      
      }

      return (

        <div style={styles.timerProgressBarStyles}>
          <div style={styles.timerProgressBarInnerStyles}>
            <br />
            Searching {this.cardStackIndex.state.timerProgressDataSource} for {this.cardStackIndex.state.timerProgressEntity}...
            <br />
            <br />
            <progress
              id="progressBar"
              value="0"
              max={this.cardStackIndex.state.timerProgressDurationSeconds}
            ></progress>
            <br />
            <br />
          </div>
        </div>
      );
  }

}

export default TimerProgressBar;