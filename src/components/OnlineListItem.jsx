// OnlineListItem.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import Dialog, { DialogActions,DialogContent,DialogContentText,DialogTitle } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Checkbox from 'material-ui/Checkbox';

// ============================================
// import react components

// ============================================
// import react redux-action
import {
  setOnlineReadingWarningNotShow
} from '../states/settingState.js';

// ============================================
// import apis
import {
  getChapterList
} from '../utils/parser.js';
import {
  getLongRandomString
} from '../utils/wordProcess.js';

// ============================================
// import css file
import '../styles/OnlineListItem.css';

// ============================================
// constants

// ============================================
// react components
class OnlineListItem extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    author: PropTypes.string,
    bookTitle: PropTypes.string,
    intro: PropTypes.string,
    latestChapter: PropTypes.string,
    url: PropTypes.string,
    inSerial: PropTypes.bool,
    warningOnlineReading: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.lang = this.props.langPack.OnlineListItem;

    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMainRightClick = this.handleMainRightClick.bind(this);
    this.addToLibrary = this.addToLibrary.bind(this);
    this.showChapterList = this.showChapterList.bind(this);
    this.showFullIntro = this.showFullIntro.bind(this);
    this.handleCancelWarning = this.handleCancelWarning.bind(this);
    this.handleConfirmWarning = this.handleConfirmWarning.bind(this);

    this.state = {
      menuOpen: false,
      chapterListContent: undefined,
      _chapter: undefined,
      anchorEl: null,
      anchorReference: 'anchorEl', // anchorEl, anchorPosition
      anchorPosition: {
        x: 0,
        y: 0,
      },

      ifLoadChapterListDone: true, // false if being loading chapter list
      ifShowChapterList: false,
      ifShowFullIntro: false,
      ifShowReadWarning: false,

      notShowReadWarning: false,
    };
  }

  render() {
    return (
      <div 
        className={'oli-main has-shadow' + (this.state.menuOpen ? ' oli-main-hover' : '')}
        onContextMenu={this.handleMainRightClick}
        onClick={()=>{this.getChapterList()}}
      >
        <div>
          <div className='oli-booktitle'>{this.props.bookTitle}</div>
          <div className='oli-menu'>
            <IconButton 
              className='no-focus'
              size="small"
              onClick={this.handleMenuClick}
              style={{marginTop: '-20px'}}
            >
              <i className="fas fa-ellipsis-v" style={{fontSize: '16px'}}></i>
            </IconButton>
            <Menu
              anchorReference={this.state.anchorReference}
              anchorEl={this.state.anchorEl}
              anchorPosition={{top: this.state.anchorPosition.y, left: this.state.anchorPosition.x}}
              open={this.state.menuOpen}
              onClose={this.handleMenuClick}
              onClick={e=>e.stopPropagation()}
            >
              <MenuItem onClick={this.addToLibrary}>{this.lang.addToLibrary}</MenuItem>
              <MenuItem onClick={this.showChapterList}>{this.lang.showChapterList}</MenuItem>
              <MenuItem onClick={this.showFullIntro} disabled={this.props.intro !== '' ? false : true}>{this.lang.showFullIntro}</MenuItem>
            </Menu>
          </div>
        </div>

        <div className='oli-author'>{this.props.author === 'unknown' ? this.lang.unknown : this.props.author}</div>
        <div className='oli-intro'>{this.props.intro === '' ? this.lang.none : this.props.intro}</div>
        <div style={{height: '24px'}}>
          <div style={{height: '24px', display: 'inline-block'}}>
            <div className='oli-latestChapter'>{this.props.latestChapter}</div>
          </div>
          <div style={{height: '24px', display: 'inline-block', width: '50px'}}>
            {this.props.inSerial ?
              <div className='oli-serialState oli-serialState-inSerial'>({this.lang.inSerial})</div> :
              <div className='oli-serialState oli-serialState-notInSerial'>({this.lang.notInSerial})</div>
            }
          </div>
        </div>

        {/* Chapter List */}
        <Dialog
          open={this.state.ifShowChapterList}
          onClose={e=>{e.stopPropagation();this.setState({ifShowChapterList:false});}}
        >
          <DialogTitle>{this.lang.chapterListTitle}</DialogTitle>
          {
            this.state.ifLoadChapterListDone === false 
            ? <div style={{textAlign: 'center'}}><CircularProgress/></div> 
            : null
          }
          <div className='oli-chapterlist'>
            {this.state.chapterListContent}
          </div>
          <div style={{height: '35px', width: '100%'}}></div>
        </Dialog>

        {/* Introduction */}
        <Dialog
          open={this.state.ifShowFullIntro}
          onClose={e=>{e.stopPropagation();this.setState({ifShowFullIntro:false});}}
          onClick={e=>e.stopPropagation()}
          onContextMenu={e=>e.stopPropagation()}
        >
          <DialogTitle>{this.lang.intro}</DialogTitle>
          <div className='oli-fullintro'>
            {this.props.intro}
          </div>
        </Dialog>

        {/* Read warning */}
        <Dialog
          open={this.state.ifShowReadWarning}
          onClose={e=>{e.stopPropagation(); this.setState({ifShowReadWarning: false})}}
          onClick={e=>e.stopPropagation()}
          onContextMenu={e=>e.stopPropagation()}
        >
          <DialogTitle>{this.lang.warningTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.lang.warningContent}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <div style={{fontSize: '14px', lineHeight: '48px', position: 'relative', left: '0px'}}>
              <Checkbox checked={this.state.notShowReadWarning} onChange={()=>{this.setState({notShowReadWarning: !this.state.notShowReadWarning})}}/>
              {this.lang.notShowAgain}
            </div>
            <Button className='nofocus' onClick={this.handleCancelWarning}>{this.lang.cancel}</Button>
            <Button className='nofocus' onClick={this.handleConfirmWarning}>{this.lang.confirm}</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleMenuClick(event) {
    if (event)
      event.stopPropagation();
    if (this.state.menuOpen !== true) {
      this.setState({menuOpen: true, anchorEl: event.currentTarget, anchorReference: 'anchorEl'});
    } else {
      this.setState({menuOpen: false, anchorEl: null});
    }
  }

  handleMainRightClick(event) {
    if (this.state.ifShowChapterList === true) return;
    let mousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
    if (this.state.menuOpen !== true) {
      this.setState({menuOpen: true, anchorPosition: mousePosition, anchorReference: 'anchorPosition'});
    } else {
      this.setState({menuOpen: false, anchorPosition: mousePosition});
    }
  }

  handleCancelWarning() {
    this.setState({ifShowReadWarning: false}); 
    if (this.state.notShowReadWarning) 
      this.props.dispatch(setOnlineReadingWarningNotShow());
    setTimeout(() => {
      this.setState({notShowReadWarning: false});
    }, 300);
  }

  handleConfirmWarning() {
    this.setState({ifShowReadWarning: false});
    if (this.state.notShowReadWarning) 
      this.props.dispatch(setOnlineReadingWarningNotShow());
    setTimeout(() => {
      this.setState({notShowReadWarning: false});
    }, 300);
  }

  addToLibrary(event) {
    if (event) event.stopPropagation();
    console.log('Add "', this.props.bookTitle, '"to library');
    this.handleMenuClick(event);
  }

  showChapterList(event) {
    if (event) event.stopPropagation();
    console.log('Show chapter list');
    this.handleMenuClick(event);
    this.getChapterList();
  }

  showFullIntro(event) {
    if (event) event.stopPropagation();
    console.log('Show full introduction of "', this.props.bookTitle, '"');
    this.handleMenuClick(event);
    this.setState({ifShowFullIntro: true});
  }

  getChapterList() {
    this.setState({ifShowChapterList: true, ifLoadChapterListDone: false});
    if (this.state.chapterListContent === undefined) {
      getChapterList(this.props.url, r => {
        let chapterListContent = this.getChapterListContent(r);
        this.setState({
          ifLoadChapterListDone: true, 
          chapterListContent: chapterListContent,
          _chapter: r,
        });
      });
    } else {
      this.setState({ifLoadChapterListDone: true});
    }
  }

  getChapterListContent(r) {
    let list = [];
    r.map(v => {
      list.push((
        <div 
          key={getLongRandomString()}
          onClick={e=>{e.stopPropagation();if (this.props.warningOnlineReading)this.setState({ifShowReadWarning: true});}}
        >
          <div className='chapterlist-chapteritem-sep'></div>
          <div 
            className='oli-chapterlist-item'
            onClick={() => {console.log(v.link)}}
          >
            {v.title}
          </div>
        </div>
      ));
    });
    return list;
  }
}

export default connect (state => ({
  langPack: state.main.langPack,
  warningOnlineReading: state.setting.warningOnlineReading,
}))(OnlineListItem);
