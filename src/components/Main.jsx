// Main.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

// ============================================
// import react components
import Welcome from 'components/Welcome.jsx';
import Navigator from 'components/Navigator.jsx';
import Reading from 'components/Reading.jsx';
import Library from 'components/Library.jsx';
import Online from 'components/Online.jsx';
import Setting from 'components/Setting.jsx';

// ============================================
// import react redux-action
import {
  changeWindowSize,
  setHostType,
  setNavigator,
  setLangPack,
} from '../states/mainState.js';

// ============================================
// import apis
import {
  getCurPath,
} from '../utils/fileUtilities.js';

// ============================================
// import css file
import '../styles/Main.css';

// ============================================
// react components
class Main extends React.Component {
  static propTypes = {
    dispatch:         PropTypes.func,
    host:             PropTypes.string,
    navigator:        PropTypes.string,
    navDirection:     PropTypes.number,
    preNavigator:     PropTypes.string,
    windowHeight:     PropTypes.number,
    windowWidth:      PropTypes.number,
    navbarExpand:     PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.getMainComponent = this.getMainComponent.bind(this);

    this.state = {
      debug: true,
      dataLoaded1: false,
      dataLoaded2: false,
    };
  }

  componentWillMount() {
    getCurPath();

    this.loadData();

    this.props.dispatch(setLangPack(this.props.lang));
  }

  render() {
    var mainComponent = this.getMainComponent();
    return (
      <div>
        {/* Program cover for loading data */}
        {this.state.dataLoaded1 === false ?
          <div className='main-loading ns loading-normal'>Better Text Reader</div> : 
          this.state.dataLoaded2 === false ?
            <div className='main-loading ns loading-hide'  >Better Text Reader</div> :
            <div></div> 
        }

        {/* Main screen */}
        <div id='canvas' style={{top: this.props.navbarExpand === true ? '40px' : '0px'}}>
          {mainComponent}
        </div>

        {/* Navigator */}
        <Navigator />
      </div>
    );
  }

  loadData() {
    // simulate data load timing
    if (this.state.debug === true) {
      this.setState({dataLoaded1: true});
      this.setState({dataLoaded2: true});
      this.props.dispatch(setNavigator('/library'));
    } else {
      setTimeout(() => {
        this.setState({dataLoaded1: true});
        setTimeout(() => {
          this.setState({dataLoaded2: true});
        }, 1000)
      }, 500);
    }
  }

  getMainComponent() {
    // map navigator into number such that we can get which direction
    // animation should be.
    var pp = this.props.preNavigator;
    var cc = this.props.navigator;
    var mc = ['/','/reading','/library','/online','/setting'];
    var p = 0, c = 0;
    var classp, classc;
    for (var i = 0; i < 5; i++) {
      if (pp === mc[i]) p = i;
      if (cc === mc[i]) c = i;
    }
    
    if (p > c) {
      classp = 'canvas-toright';
      classc = 'canvas-center canvas-center-toright'
    } else if (p < c) {
      classp = 'canvas-toleft';
      classc = 'canvas-center canvas-center-toleft';
    }

    var componentp = this.getComponent(pp);
    var componentc = this.getComponent(cc);

    // use navDirection to prevent div has same classname
    // such that animation can be displayed.
    // PS. navDirection will change to 0 or 1 whenever 
    //     NavButton is pressed.
    var mainComponent = this.props.navDirection === 1 ? ( 
      <div>
        <div className={classc}>
          {componentc}
        </div>
        <div className={classp}>
          {componentp}
        </div>
      </div> 
    ) : (
      <div>
        <div className={classp}>
          {componentp}
        </div>
        <div className={classc}>
          {componentc}
        </div>
      </div> 
    );
    return mainComponent;
  }

  getComponent(c) {
    switch (c) {
      case '/':
        return (<Welcome />);
      case '/reading':
        return (<Reading />);
      case '/library':
        return (<Library />);
      case '/online':
        return (<Online />);
      case '/setting':
        return (<Setting />);
      default:
        return (<div></div>);
    }
  }
}

export default connect (state => ({
  host:             state.main.host,
  navigator:        state.main.navigator,
  navDirection:     state.main.navDirection,
  preNavigator:     state.main.preNavigator,
  windowHeight:     state.main.windowHeight,
  windowWidth:      state.main.windowWidth,
  lang:             state.setting.lang,
  navbarExpand:     state.setting.menuExpand,
}))(Main);
