// Navigator.jsx
//  Button to change page.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components
import NavButton from './NavButton.jsx';

// ============================================
// import react redux-action
import {
  setMenuExpand
} from '../states/settingState.js';

// ============================================
// import apis

// ============================================
// import css file
import '../styles/Navigator.css';

// ============================================
// constants

// ============================================
// react components
class Navigator extends React.Component {
  static propTypes = {
    dispatch:    PropTypes.func,
    langPack:    PropTypes.object,
    menuExpand:  PropTypes.bool,
    navTitle:    PropTypes.any,
    navigator:   PropTypes.string,
    navbarCover: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.handleMenuClick = this.handleMenuClick.bind(this);

    this.state = {

    };
  }

  render() {
    return (
      <div id='navigator' style={{height: "40px"}}>
        {/* menu button bar */}
        <div className={this.props.menuExpand === true ? 'nav-menubar' : 'nav-menubar-hide'}>
          <NavButton target='/' content={this.props.langPack.Navbar.button1}/>
          <NavButton target='/reading' content={this.props.langPack.Navbar.button4}/>
          <NavButton target='/library' content={this.props.langPack.Navbar.button2}/>
          <NavButton target='/online' content={this.props.langPack.Navbar.button3}/>
          <NavButton target='/setting' content={this.props.langPack.Navbar.button5}/>
          <div className='nav-title'>
            <div className='nav-title-in1'>
              <div className={
                this.props.navigator === '/reading' && 
                this.props.navTitle !== null && 
                this.props.navTitle != 0 ?
                'nav-title-in2' : 'nav-title-in2 nav-title-hide'}
              >
                {this.props.langPack.Navbar.navTitle}{this.props.navTitle}
              </div>
            </div>
          </div>
          <div className={
            this.props.navbarCover === 1 ? 'nav-menubar-cover fadein' : 
            this.props.navbarCover === 2 ? 'nav-menubar-cover' :
            this.props.navbarCover === 3 ? 'nav-menubar-cover fadeout' : 
            'nav-menubar-cover hide'
          }></div>
        </div>

        {/* menu button */}
        <div 
          id={this.props.menuExpand === true ? 'nav-menu-out' : 'nav-menu-out-float'} 
          onClick={this.handleMenuClick}
        >
          <div id='nav-menu' className='fas fa-bars'></div>
          <div className={
            this.props.navbarCover === 1 ? 'nav-menu-cover fadein' : 
            this.props.navbarCover === 2 ? 'nav-menu-cover' : 
            this.props.navbarCover === 3 ? 'nav-menu-cover fadeout' :
            'nav-menu-cover hide'
          }></div>
        </div>
      </div>
    );
  }

  handleMenuClick() {
    if (this.props.menuExpand === true) {
      this.props.dispatch(setMenuExpand(false));
    } else {
      this.props.dispatch(setMenuExpand(true));
    }
  }
}

export default connect (state => ({
  langPack:    state.main.langPack,
  menuExpand:  state.setting.menuExpand,
  navTitle:    state.main.navTitle,
  navigator:   state.main.navigator,
  navbarCover: state.main.navbarCover,
}))(Navigator);
