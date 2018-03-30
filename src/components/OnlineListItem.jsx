// OnlineListItem.jsx
//  Maintain top-level program data.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';

// ============================================
// import react components

// ============================================
// import react redux-action

// ============================================
// import apis

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
  }

  constructor(props) {
    super(props);

    this.lang = this.props.langPack.OnlineListItem;

    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMainRightClick = this.handleMainRightClick.bind(this);
    this.addToLibrary = this.addToLibrary.bind(this);
    this.showChapterList = this.showChapterList.bind(this);
    this.showFullIntro = this.showFullIntro.bind(this);

    this.state = {
      menuOpen: false,
      anchorEl: null,
      anchorReference: 'anchorEl', // anchorEl, anchorPosition
      anchorPosition: {
        x: 0,
        y: 0,
      },
    };
  }

  render() {
    return (
      <div 
        className={'oli-main has-shadow' + (this.state.menuOpen ? ' oli-main-hover' : '')}
        onContextMenu={this.handleMainRightClick}
      >
        <div>
          <div className='oli-booktitle'>{this.props.bookTitle}</div>
          <div className='oli-menu'>
            <IconButton 
              className='no-focus'
              size="small"
              onClick={this.handleMenuClick}
              onContextMenu={this.handleMenuClick}
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
            >
              <MenuItem onClick={this.addToLibrary}>{this.lang.addToLibrary}</MenuItem>
              <MenuItem onClick={this.showChapterList}>{this.lang.showChapterList}</MenuItem>
              {this.props.intro !== '' ? 
                <MenuItem onClick={this.showFullIntro}>{this.lang.showFullIntro}</MenuItem> : 
                <MenuItem onClick={this.showFullIntro} disable>{this.lang.showFullIntro}</MenuItem>
              }
            </Menu>
          </div>
        </div>

        <div className='oli-author'>{this.props.author}</div>
        <div className='oli-intro'>{this.props.intro}</div>
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

        {/* onclick event */}
      </div>
    );
  }

  handleMenuClick(event) {
    event.stopPropagation();
    if (this.state.menuOpen !== true) {
      this.setState({menuOpen: true, anchorEl: event.currentTarget, anchorReference: 'anchorEl'});
    } else {
      this.setState({menuOpen: false, anchorEl: null});
    }
  }

  handleMainRightClick(event) {
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

  addToLibrary() {
    console.log('Add "', this.props.bookTitle, '"to library');
    this.handleMenuClick();
  }

  showChapterList() {
    console.log('Show chapter list');
    this.handleMenuClick();
  }

  showFullIntro() {
    console.log('Show full introduction of "', this.props.bookTitle, '"');
    this.handleMenuClick();
  }
}

export default connect (state => ({
  langPack: state.main.langPack,
}))(OnlineListItem);
