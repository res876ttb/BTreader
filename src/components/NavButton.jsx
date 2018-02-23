// NavButton.jsx
//  Button in navbar.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components

// ============================================
// import react redux-action
import {
  setNavigator
} from '../states/mainState.js';

// ============================================
// import apis

// ============================================
// import css file
import '../styles/NavButton.css';

// ============================================
// react components
class NavButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigator: PropTypes.string,
    target: PropTypes.string,
    content: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut  = this.handleMouseOut.bind(this);
    this.handleClick     = this.handleClick.bind(this);

    this.state = {
      mouseOver: false
    };
  }

  render() {
    return (
      <div className='nav-button-out' 
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onClick={this.handleClick}
      >
        <div className='nav-button-inner'>
          <div className='nav-button'>
            {this.props.content}
          </div>
        </div>
        <div className={
          this.state.mouseOver === true ? 
            'nav-button-bottom-hover' :
            this.props.navigator === this.props.target ?
              'nav-button-bottom-select' :
              'nav-button-bottom'
        }></div>
      </div>
    );
  }

  handleMouseOver() {
    this.setState({mouseOver: true});
  }

  handleMouseOut() {
    this.setState({mouseOver: false});
  }

  handleClick() {
    if (this.props.navigator !== this.props.target)
      this.props.dispatch(setNavigator(this.props.target));
  }
}

export default connect (state => ({
  navigator: state.main.navigator
}))(NavButton);
