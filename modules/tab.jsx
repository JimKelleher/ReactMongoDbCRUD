import React, {Component} from 'react';
import PropTypes from 'prop-types';


class Tab extends Component {

  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  onClick = () => {

    this.props.parent.props.parent.cardStackIndex.tabChangePreProcess(this.props.activeTab);
    
    const {label, onClick} = this.props;
    onClick(label);
  }

  render() {
    
    const { 
      onClick,
      props: {
        activeTab,
        label,
      },
    } = this;

    var className = 'tab-list-item';

    if (activeTab === label) {
      className += ' tab-list-active';
    }

    return (
      <li 
        className={className}
        onClick={onClick}
      >
        {label}
      </li>
    );
  }

}

export default Tab;