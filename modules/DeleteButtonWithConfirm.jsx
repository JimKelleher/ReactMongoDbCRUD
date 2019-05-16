import React from 'react';


class DeleteButtonWithConfirm extends React.Component {
  
  constructor(props) {

    super(props);

    // Component levels:
    this.artistMaint = this.props.parent.props.parent.props.parent.props.parent;
    this.cardStackApp = this.props.parent.props.parent.props.parent;
    this.cardStackIndex = this.props.parent.props.parent;
    this.CardStack = this.props.parent;

    this.state = {
      BtnBackWidth: '',
      BtnBackHeight: '',
      BtnContFrontWidth: '',
      BtnWidth: '',

      deleteButtonX: this.cardStackIndex.state.deleteButtonX,
      deleteButtonY: this.cardStackIndex.state.deleteButtonY,
    };

    this.btn;
    this.btnInnerFront;
    this.btnYes;
    this.btnNo;

  }

  componentDidMount() {

    this.initialize();

    // Our "overlay delete button" will simulate clicking the
    // actual delete button
    document.getElementById("buttonDelete").click();

  }

  endHandleDeleteClick(e) {

    this.btnInnerFront.classList.remove('btn-inner-front');
    this.btnInnerFront.classList.add(   'btn-inner-back');

    var mx = e.clientX - this.btn.offsetLeft,
        my = e.clientY - this.btn.offsetTop;

    var w = this.btn.offsetWidth,
        h = this.btn.offsetHeight;

    var directions = [
      { id: 'top', x: w/2, y: 0 },
      { id: 'right', x: w, y: h/2 },
      { id: 'bottom', x: w/2, y: h },
      { id: 'left', x: 0, y: h/2 }
    ];

    directions.sort(function(a, b) {
      return distance(mx, my, a.x, a.y) - distance(mx, my, b.x, b.y);
    });

    this.btn.setAttribute('data-direction', directions.shift().id);
    this.btn.classList.add('is-open');

    this.enlargeDeleteButton();

  }

  enlargeDeleteButton() {

    const ENLARGE_WIDTH = "250px";
    const ENLARGE_HEIGHT = "125px";

    this.setState({ 
      BtnBackWidth: ENLARGE_WIDTH,
      BtnBackHeight: ENLARGE_HEIGHT,
      BtnContFrontWidth: ENLARGE_WIDTH,
      BtnWidth: ENLARGE_WIDTH
    });

  }

  handleNoClick() {

    this.btn.classList.remove('is-open');

    this.btnInnerFront.classList.remove('btn-inner-back');
    this.btnInnerFront.classList.add(   'btn-inner-front');  
    
    this.shrinkDeleteButton();

    this.cardStackIndex.toggleDeletePopup();
    
  }

  handleYesClick() {

    this.btn.classList.remove( 'is-open' );

    this.btnInnerFront.classList.remove('btn-inner-back');
    this.btnInnerFront.classList.add(   'btn-inner-front');

    this.shrinkDeleteButton();

    // Close the open card:
    this.cardStackIndex.headerClick(this.cardStackIndex.openCardProps); 

    this.CardStack.deleteSaveToMongoDb(
      this.artistMaint.artist.findArtist(this.artistMaint.artist.writeArtists, this.cardStackApp.state.selectedArtistId),
      this.cardStackApp.state.selectedArtistId,
      this.cardStackApp.state.selectedArtist_id,
      this.cardStackApp.state.selectedArtistIdMinusSpaces,
      this.CardStack
    );

    this.cardStackIndex.toggleDeletePopup();

  }

  initialize() {

    this.btn           = document.querySelector('.btn');
    this.btnInnerFront = this.btn.querySelector('.btn-inner-front');
    this.btnYes        = this.btn.querySelector('.btn-back .yes');
    this.btnNo         = this.btn.querySelector('.btn-back .no');

    this.shrinkDeleteButton(); 
       
  }

  shrinkDeleteButton() {

    const SHRINK_WIDTH = "132px";
    const SHRINK_HEIGHT = "34px";
 
    this.setState({ 
      BtnBackWidth: SHRINK_WIDTH,
      BtnBackHeight: SHRINK_HEIGHT,
      BtnContFrontWidth: SHRINK_WIDTH,
      BtnWidth: SHRINK_WIDTH
    });

  }

  render() {

    const deletePopupInnerStyles = {
      position: 'absolute',
    
      top:  this.state.deleteButtonY,
      left: this.state.deleteButtonX,
    }

    const deletePopupStyles = {
      position: 'fixed',
    
      top: '0px',
      left: '0px',
    
      right: 0,   // without this the whole thing fails
      bottom: 0,  // without this the whole thing fails
    
      backgroundColor: 'var(--modal-background)',
    
      zIndex: 9 /* Front-to-back window order 1 of 2: In the front */
    }
    
    const shrinkBtnBackStyles = {
      width: this.state.BtnBackWidth,
      height: this.state.BtnBackHeight
    }
    
    const shrinkBtnContFrontStyles = {
      width: this.state.BtnContFrontWidth
    }

    const shrinkBtnStyles = {
      width: this.state.BtnWidth,
      color: 'var(--mainColor)'
    }

    return (

      <div style={deletePopupStyles}>
        <div style={deletePopupInnerStyles}>

          <div id="Btn" className="btn" style={shrinkBtnStyles} >

            <div id="BtnBack" className="btn-back" style={shrinkBtnBackStyles} >
              <p>Are you sure?</p>
              <a href="javascript:void(0);" id="BtnYes" className="button yes" 
                 onClick={ () => this.handleYesClick() }>Yes</a>
              <a href="javascript:void(0);" id="BtnNo"  className="button no"  
                 onClick={ () => this.handleNoClick() }>No</a>
            </div>

            <div id="BtnContFront" className="btn-container-front" style={shrinkBtnContFrontStyles}>
              <a href="javascript:void(0);" id="buttonDelete" className="btn-inner-front button xdelete"
                 onClick={ (e) => this.endHandleDeleteClick(e) }>Delete</a>
            </div>

          </div>
        </div>

      </div>

    );
  }

};

function distance( x1, y1, x2, y2 ) {
  var dx = x1-x2;
  var dy = y1-y2;
  return Math.sqrt( dx*dx + dy*dy );
}

export default DeleteButtonWithConfirm;