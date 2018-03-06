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
  setCurBook,
} from '../states/mainState.js';
import {
  libraryInitData,
  libraryLoadData,
} from '../states/libraryState.js';
import {
  settingInitData,
  settingLoadData,
} from '../states/settingState.js';

// ============================================
// import apis
import {
  getCurPath,
  dataExists,
} from '../utils/fileUtilities.js';

// ============================================
// import css file
import '../styles/Main.css';

// ============================================
// constants

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
    recentReading:    PropTypes.string,
    books:            PropTypes.object,
    autoLoad:         PropTypes.bool,
    backgroundColor:  PropTypes.string,
    backgroundPath:   PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      debug: true,
      dataLoaded1: false, // true when data is loaded
      dataLoaded2: false, // true after animation has finished
    };
  }

  componentWillMount() {
    // get application path
    getCurPath();

    // load data from application path
    this.loadData().then(() => {
      // set application language
      this.props.dispatch(setLangPack(this.props.lang));
      if (this.props.backgroundPath === '') {
        document.getElementById('root').style.backgroundColor = this.props.backgroundColor;
      } else {
        document.getElementById('root').style.backgroundImage = `url(\'${this.props.backgroundPath}\')`;
      }

      // after data is loaded, display loading animation
      if (this.state.debug) {
        this.setState({dataLoaded1: true, dataLoaded2: true});
        this.props.dispatch(setNavigator('/library'));
      } else {
        // use setTimeout on the outter layer is for making it synchronous.
        if (this.props.autoLoad === true) {
          this.props.dispatch(setNavigator('/reading'));
        }
        setTimeout(() => {
          this.setState({dataLoaded1: true});
          setTimeout(() => {
            this.setState({dataLoaded2: true});
          }, 777);
        }, 1);
      }
    });
  }

  componentDidMount() {
    document.getElementById('root').style.backgroundColor = this.props.backgroundColor;
  }

  render() {
    var mainComponent = this.getMainComponent();
    return (
      <div>
        {/* Program cover for loading data */}
        <div className={
          this.state.dataLoaded1 === false ? 'main-loading ns loading-normal' :
          this.state.dataLoaded2 === false ? 'main-loading ns loading-fadout' : 
          'main-loading ns loading-hide'
        }>
          Better Text Reader
        </div>

        {/* Main screen */}
        <div id='canvas' style={{top: this.props.navbarExpand ? '40px' : '0px'}}>
          {mainComponent}
        </div>

        {/* Navigator */}
        <Navigator />
      </div>
    );
  }

// load library and setting data from disk
  loadData() {
    var loading = new Promise((res, rej) => {
      var libraryloaded = false;
      var settingloaded = false;
      if (dataExists(window.appPath, 'library')) {
        this.props.dispatch(libraryLoadData());
        libraryloaded = true;
        if (settingloaded && libraryloaded) res();
      } else {
        this.props.dispatch(libraryInitData());
        libraryloaded = true;
        if (settingloaded && libraryloaded) res();
      }
      if (dataExists(window.appPath, 'setting')) {
        this.props.dispatch(settingLoadData());
        settingloaded = true;
        if (settingloaded && libraryloaded) res();
      } else {
        this.props.dispatch(settingInitData());
        settingloaded = true;
        if (settingloaded && libraryloaded) res();
      }
    }).then(() => { // set curBook
      if (this.props.recentReading !== '') {
        this.props.dispatch(setCurBook(this.props.books[this.props.recentReading]));
      }
    });
    return loading;
  }

// For render component.
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

// get actual component.
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
  curBook:          state.main.curBook,
  host:             state.main.host,
  navigator:        state.main.navigator,
  navDirection:     state.main.navDirection,
  preNavigator:     state.main.preNavigator,
  windowHeight:     state.main.windowHeight,
  windowWidth:      state.main.windowWidth,
  lang:             state.setting.lang,
  navbarExpand:     state.setting.menuExpand,
  recentReading:    state.library.recentReading,
  books:            state.library.books,
  autoLoad:         state.setting.autoLoad,
  backgroundColor:  state.setting.backgroundColor,
  backgroundPath:   state.setting.backgroundPath,
}))(Main);
