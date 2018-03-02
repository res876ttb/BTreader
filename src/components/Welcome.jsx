// Welcome.jsx
//  Home page.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button} from 'reactstrap'; 

// ============================================
// import react components

// ============================================
// import react redux-action
import {
  setNavigator,
} from 'states/mainState.js';

// ============================================
// import apis

// ============================================
// import css file
import '../styles/Welcome.css';

// ============================================
// constants

// ============================================
// react components
class Welcome extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    color: PropTypes.string,
    langPack: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.lang = this.props.langPack.Welcome;
  }

  render() {
    return (
      <div className="welcome-main container">
        <div className="welcome-jumbotron">
          <div className="welcome-jumbotron-title" style={{color: this.props.color}}>
            {this.lang.title}
          </div>
          <br/>

          <div className="welcome-jumbotron-content" style={{color: this.props.color}}>
            {this.lang.description}
          </div>
          <br/>

          <Button color='primary' className="welcome-buttons" 
            onClick={() => {this.props.dispatch(setNavigator('/reading'));}}>
            {this.lang.button_last_read}
          </Button>
          <Button color='secondary' className="welcome-buttons" 
            onClick={() => {this.props.dispatch(setNavigator('/library'));}}>
            {this.lang.button_local}
          </Button> 
          <Button color='secondary' className="welcome-buttons" 
            onClick={() => {this.props.dispatch(setNavigator('/online'));}}>
            {this.lang.button_online}
          </Button> 
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  color:    state.setting.color,
  langPack: state.main.langPack,
}))(Welcome);