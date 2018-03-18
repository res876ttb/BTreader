// Reading.jsx

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
const {ipcRenderer} = require('electron');

// ============================================
// import react components
import ReadingContent from './ReadingContent.jsx';
import ChapterList from './ChapterList.jsx';
import BookmarkList from './BookmarkList.jsx';
import Dialog, { DialogTitle, DialogActions } from 'material-ui/Dialog';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputAdornment } from 'material-ui/Input';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

// ============================================
// import react redux-action
import {
  setNavigator,
  setCurBook,
  setNavTitle,
  setNavbarCover,
  setReadingReload,
} from '../states/mainState.js';
import {
  updateBook,
  setRecentReading,
} from '../states/libraryState.js';

// ============================================
// import apis
import {
  readChapter,
  readIndex,
  saveBookmark,
} from '../utils/fileUtilities.js';
import {
  getCurrentTime,
} from '../utils/clockUtilities.js';
import {
  isEmptyLine,
} from '../utils/wordProcess.js';

// ============================================
// import css file
import '../styles/Reading.css';

// ============================================
// constants

// ============================================
// react components
class Reading extends React.Component {
  static propTypes = {
    dispatch:      PropTypes.func,
    book:          PropTypes.object,
    books:         PropTypes.object,
    color:         PropTypes.string,
    navigator:     PropTypes.string,
    preNavigator:  PropTypes.string,
    menuExpand:    PropTypes.bool,
    langPack:      PropTypes.object,
    lineHeight:    PropTypes.number,
    fontSize:      PropTypes.number,
    recentReading: PropTypes.string,
    reload:        PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.lang = this.props.langPack.Reading;

    this.checkIfLoading = this.checkIfLoading.bind(this);
    this.jumpToChapter = this.jumpToChapter.bind(this);
    this.handleBookmarkButtonClick = this.handleBookmarkButtonClick.bind(this);
    this.handleChapterButtonClick = this.handleChapterButtonClick.bind(this);
    this.handleJumpButtonClick = this.handleJumpButtonClick.bind(this);
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
    this.handleAddbookmarkButtonClick = this.handleAddbookmarkButtonClick.bind(this);
    this.deleteBookmark = this.deleteBookmark.bind(this);
    this.jumpToBookmark = this.jumpToBookmark.bind(this);
    this.jumpToProgress = this.jumpToProgress.bind(this);
    this.handleJumpBoxInput = this.handleJumpBoxInput.bind(this);
    this.handleSearching = this.handleSearching.bind(this);
    this.handleSearchBoxInput = this.handleSearchBoxInput.bind(this);

    // declare state and type/default value
    this.state = {
      index: {},                // index for chapter and bookmark
      bookTitle: '',            // book title
      
      prevContent: '',          // content of current first chapter
      nextContent: '',          // content of current last chapter

      components: [],           // reading content div
      fromBase: 0,              // how many chapters are there from base chapter to last chapter
      toBase: 0,                // how many chapters are there from first chapter to base chapter
      
      currentChapter: '',       // current chapter
      currentChapterOrder: -1,  // index of current chapter in index.chapter
      firstChapterOrder: -1,    // for loading previous chapter
      lastChapterOrder: -1,     // for loading next chapter
      
      idArr: [],                // id array for components
      currentIdArrIndex: -1,    // index of id of current visible component

      scrollInit: true,         // for change current scroll offset. When true, 
      loadLock: false,          // lock checkIfLoading to prevent double/triple loading

      chapterState: 0,          // for displaying chapter
      bookmarkState: false,     // for displaying bookmark
      bookmarkAnimation: 0,     // for displaying animation of bookmark
      jumpState: false,         // for displaying jump
      jumpProgress: '',         // progress for jumping
      searchState: false,       // for displaying searchbar 
      searchComplete: false,    // for searching state. if searching has completed, true; else false.
      addBookmarkState: 0,      // for displaying animation of adding bookmark
                                // 0 for close; 1 for sliding in; 2 for sliding out

      noRecent: false, 

      notSave: false,           // flag for saving reading progress
      
      firstIsLoad: false,       // flag for if first chapter is loaded. It is needed because 
                                // checkIfLoad has some limits that cannot detected if previous
                                // chapter is needed to be loaded when the first chapter cannot 
                                // fill up the whole height.
    };
  }

// init reading content before reading is rendered and watch on record saving signal from
// from main process.
  componentWillMount() {
    console.log('Reading component is going to be created!');
    ipcRenderer.on('saveCurrentBook', (e) => {
      this.saveBook();
    });
    this.initReading();
  }

// after rendering, set scrollOffset
  componentDidMount() {
    this.updateScrollTop();
  }

// when book is changed, re-initialize reading content and set scrollOffset
  componentDidUpdate() { 
    // if current book is not undefined, then it need to be verified if need update
    if (this.props.book !== undefined && this.props.book !== null) {
      // if Reading is not focused, then save current book. Use notSave flag to prevent 
      // repeating saving
      if (this.props.preNavigator === '/reading' && this.state.notSave) {
        this.setState({notSave: false});
        this.saveBook();
      }
      if (!this.state.notSave && this.props.navigator === '/reading') {
        this.setState({notSave: true});
      }

      // if bookTitle is change, then regard it as book is changed; or when translating setting
      // is changed, then relaod reading content
      if (this.state.bookTitle !== this.props.book.bookTitle || this.props.reload) {
        console.log('Reading book is changed!');
        this.initReading();
      } if (this.props.recentReading === '' && this.state.noRecent === false) {
        console.log('Reading book is deleted!');
        this.initReading();
      } else {
        this.updateScrollTop();
      }
    }
  }

  render() {
    if (this.state.noRecent) {
      return (
        <div className='reading-out'>
          <div className='reading-norecent container'>
            <div className='reading-norecent-in'>
              <span>{this.lang.norecent}</span>
            </div>           
          </div>
        </div>
      )
    }
    return (
      <div className='reading-out'>
        <div 
          id='reading-scrollbox' 
          className='reading-main container max720' 
          onScroll={this.checkIfLoading}
          style={{fontSize: this.props.fontSize, lineHeight: this.props.lineHeight, color: this.props.color}}
        >
          <div id='reading-prevToggle' style={{height: '40px'}}></div>
            {this.state.components}
          <div style={{height: '40px'}}></div>
        </div>

        <div className='reading-buttonbar-out'>
          <div className='reading-buttonbar-padding1'></div>
          <div className='reading-buttonbar-padding2'></div>
          <div className='reading-buttonbar-in'>
            <div className='reading-buttonbar-bottom'>
              <div className='reading-button-search reading-button'
                // onClick={this.handleSearchButtonClick}
              >
                <i className='fas fa-search'></i>
              </div>
              
              <div className='reading-button-jumpToPoint reading-button'
                onClick={this.handleJumpButtonClick}
              >
                <i className='fas fa-rocket'></i>
              </div>

              <div className='reading-button-chapter reading-button'
                onClick={this.handleChapterButtonClick}
              >
                <i className='fas fa-list-ul'></i>
              </div>

              <div className='reading-button-bookmark reading-button'
                onClick={this.handleBookmarkButtonClick}
              >
                <i className='far fa-bookmark'></i>
              </div>

              <div className='reading-button-addBookmark reading-button'
                onClick={this.handleAddbookmarkButtonClick}
              >
                <i className='far fa-calendar-plus'></i>
              </div>
            </div>  
          </div>
        </div>

        {/* ChapterList component */}
        <ChapterList 
          chapters={this.state.index.chapter} 
          jumpToChapter={this.jumpToChapter} 
          handleCloseChapterlist={this.handleChapterButtonClick}
          chapterState={this.state.chapterState}
          currentChapter={this.state.currentChapter}
          bookTitle={this.props.book.bookTitle}
        />

        {/* BookmarkList component */}
        <BookmarkList 
          bookmarks={this.state.index.bookmark}
          bookmarkState={this.state.bookmarkState}
          handleBookmarkButtonClick={this.handleBookmarkButtonClick}
          deleteBookmark={this.deleteBookmark}
          handleJumpToBookmark={this.jumpToBookmark}
        />

        {/* Animation of adding new bookmark */}
        <div className={'reading-bookmark-animation' + (
          this.state.bookmarkAnimation === 1 ? ' rba-slidein' :
          this.state.bookmarkAnimation === 2 ? ' rba-show' :
          this.state.bookmarkAnimation === 3 ? ' rba-slideout' :
          ' rba-hide'
        )}>
          <i className={'fas fa-bookmark'}></i>
        </div>

        {/* input box of jumping feature */}
        <Dialog
          open={this.state.jumpState}
          onClose={this.handleJumpButtonClick}
        >
          <DialogTitle>{this.lang.jumpBox}</DialogTitle>
          <div style={{margin: '0px 24px'}}>
            <FormControl>
              <Input 
                value={this.state.jumpProgress}
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                placeholder={this.lang.jumpBoxPlaceholder}
                onKeyDown={this.handleJumpBoxInput}
              />
              <FormHelperText>{this.lang.jumpBoxHelper}</FormHelperText>
            </FormControl>
          </div>
          <DialogActions>
            <Button onClick={this.handleJumpButtonClick}>{this.lang.cancel}</Button>
            <Button onClick={this.jumpToProgress}>{this.lang.confirm}</Button>
          </DialogActions>
        </Dialog>

        {/* input box of search feature */}
        <Dialog
          open={this.state.searchState}
          onClose={this.handleSearchButtonClick}
        >
          <DialogTitle>{this.lang.searchBox}</DialogTitle>
          <div style={{margin: '0px 24px'}}>
            <FormControl>
              <Input 
                id='reading-searchbox-input'
                placeholder={this.lang.searchBoxPlaceholder}
                onKeyDown={this.handleSearchBoxInput}
              />
              <FormHelperText>{this.lang.searchBoxHelper}</FormHelperText>
            </FormControl>
          </div>
          <DialogActions>
            <Button onClick={this.handleSearchButtonClick}>{this.lang.cancel}</Button>
            <Button onClick={this.handleSearching}>{this.lang.confirm}</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

// updateScrollTop
  // set scrollOffset of reading for hiding previous chapter
  updateScrollTop(updateChapter) {
    if (this.state.scrollInit === false || updateChapter) {
      var scrollbox = document.getElementById('reading-scrollbox');
      var firstComponent = document.getElementById('reading-content-head');
      var currentComponent = document.getElementById('reading-content-5000');
      if (scrollbox === null || firstComponent === null) return;
      var offset = firstComponent.scrollHeight + 
                   (this.props.book.currentChapterOrder <= 0 ? 0 : 40) + 
                   currentComponent.scrollHeight * this.props.book.scrollTop / this.props.book.scrollHeight;
      if (updateChapter) {
        offset = firstComponent.scrollHeight + (this.props.book.currentChapterOrder <= 0 ? 0 : 40);
      }
      scrollbox.scrollTop = offset;
      this.setState({scrollInit: true});
    }
  }

// initReading
  // read novel and create component
  initReading() {
    if (this.props.book === null || this.props.book === undefined) {
      console.log('Current book is not recognizable');
      this.setState({noRecent: true});
    
    // check if current book exists in library
    } else if (this.props.books[this.props.book.bookPath] === undefined) {
      console.log('Book is removed from library!');
      this.props.dispatch(setCurBook(null));
      this.setState({noRecent: true});
    } else {
    
    this.setState({noRecent: false});
    var index, content = ['','',''];
    index = readIndex(this.props.book);
    if (index === null) {
      alert('Book data is deleted unexpectedly! This book will be deleted automatically from library.');
      // TODO: delete books and navigate back
    } else {

    var cco = this.props.book.currentChapterOrder == -1 ? 0 : this.props.book.currentChapterOrder;
    var idArr = ['reading-content-head', 'reading-content-5000', 'reading-content-tail'];
    var currentChapter  = cco == 0 ? 0 : this.props.book.currentChapter;

    this.props.dispatch(setReadingReload(false));
    this.props.dispatch(setRecentReading(this.props.book.bookPath));
    this.props.dispatch(setNavTitle(currentChapter));

    content[0] = readChapter(this.props.book, cco, index, -1);
    content[1] = readChapter(this.props.book, cco, index,  0);
    content[2] = readChapter(this.props.book, cco, index,  1);

    var components = [
      <ReadingContent key={idArr[0]} cid={idArr[0]} content={content[0]} chapters={index.chapter} currentChapterOrder={cco - 1} bookTitle={this.props.book.bookTitle} />,
      <ReadingContent key={idArr[1]} cid={idArr[1]} content={content[1]} chapters={index.chapter} currentChapterOrder={cco} bookTitle={this.props.book.bookTitle} />,
      <ReadingContent key={idArr[2]} cid={idArr[2]} content={content[2]} chapters={index.chapter} currentChapterOrder={cco + 1} bookTitle={this.props.book.bookTitle} />,      
    ];

    this.setState({
      index: index, 
      bookTitle: this.props.book.bookTitle,
      
      prevContent: content[0], 
      nextContent: content[2], 

      components: components, 
      fromBase: 0, 
      toBase: 0,   
      
      currentChapter: currentChapter,
      currentChapterOrder: cco,
      firstChapterOrder: cco > 1 ? cco - 1 : 0,
      lastChapterOrder: cco === this.props.book.totalChapter ? cco : cco + 1,
      
      idArr: idArr,
      currentIdArrIndex: 1,

      scrollInit: false, 

      notSave: true,

      firstIsLoad: cco <= 1 ? true : false,
    });

    if (this.props.book.currentChapterOrder === -1) 
      this.props.dispatch(setCurBook({
        ...this.props.book,
        currentChapterOrder: 0,
        currentChapter: 0,
      }));
  }}}

// checkIfLoading
  // check if loading next chapter and checking which is current chapter
  checkIfLoading() {
    if (this.state.scrollInit === false || this.state.loadLock) return;
    var a          = document.getElementById('reading-scrollbox').scrollTop;
    var tail       = document.getElementById('reading-content-tail').offsetTop;

    var loadPrev = (this.state.loadLock === false) &&
                   (a === 0) &&
                   (this.state.firstChapterOrder > 0);
    var loadNext = (this.state.loadLock === false) &&
                   (a + window.innerHeight > tail) && 
                   (this.state.lastChapterOrder + 1 < this.props.book.totalChapter);
          
    if (loadNext) this.loadNextChapter();
    else if (loadPrev) this.loadPreviousChapter();
    else if (this.state.loadLock === false) {
    var ciai     = this.state.currentIdArrIndex;
    var currId   = this.state.idArr[ciai];
    var boundary = a + window.innerHeight;
    var cc       = (currId === null) ? -1 : document.getElementById(currId).offsetTop;
    var ccHeight = (currId === null) ? -1 : document.getElementById(currId).scrollHeight;

    var scrollToPrevChapter = boundary < cc;
    var scrollToNextChapter = a > cc + ccHeight;

    if (scrollToNextChapter) {
      var ncco = this.state.currentChapterOrder + 1;
      var currentChapter = this.state.index.chapter[ncco];
      this.setState({
        currentIdArrIndex: this.state.currentIdArrIndex + 1,
        currentChapterOrder: ncco,
        currentChapter: currentChapter,
      });
      this.props.dispatch(setCurBook({
        ...this.props.book,
        currentChapter: currentChapter,
        currentChapterOrder: ncco,
      }));
      this.props.dispatch(setNavTitle(this.state.index.chapter[ncco]));
    } else if (scrollToPrevChapter) {
      var pcco = this.state.currentChapterOrder - 1;
      this.setState({
        currentIdArrIndex: this.state.currentIdArrIndex - 1,
        currentChapterOrder: pcco,
        currentChapter: this.state.index.chapter[pcco],
      });
      this.props.dispatch(setCurBook({
        ...this.props.book,
        currentChapter: currentChapter,
        currentChapterOrder: ncco,
      }));
      this.props.dispatch(setNavTitle(this.state.index.chapter[pcco]));
    }
  }}

// loadNextChapter
  // handle load next chapter
  loadNextChapter() {
    console.log('Load Next Chapter');
    this.setState({loadLock: true});
    var components = this.state.components.slice();
    var idArr = this.state.idArr.slice();
    var nFromBase = this.state.fromBase + 1;
    var ncco = this.state.lastChapterOrder;
    var content = readChapter(
      this.props.book, 
      this.state.currentChapterOrder,
      this.state.index, 
      2
    );
    var newId = 'reading-content-' + String(5000 + nFromBase);

    var prevComponent = (
      <ReadingContent 
        key={newId}
        cid={newId}
        content={this.state.nextContent}
        chapters={this.state.index.chapter}
        currentChapterOrder={ncco}
        bookTitle={this.props.book.bookTitle}
      />
    );
    var component = (
      <ReadingContent 
        key='reading-content-tail' 
        cid='reading-content-tail' 
        content={content} 
        chapters={this.state.index.chapter} 
        currentChapterOrder={ncco + 1} 
        bookTitle={this.props.book.bookTitle}
      />
    );

    components.pop();
    components.push(prevComponent);
    components.push(component);

    idArr.pop();
    idArr.push(newId);
    idArr.push('reading-content-tail');

    this.setState({
      components: components,
      // currentChapter: this.state.index.chapter[ncco],
      // currentChapterOrder: ncco,
      lastChapterOrder: ncco + 1,
      fromBase: nFromBase,
      idArr: idArr,
      // currentIdArrIndex: this.state.currentIdArrIndex + 1,
      loadLock: false,
      nextContent: content, 
    });
    // this.props.dispatch(setNavTitle(this.state.index.chapter[ncco]));
  }

// loadPreviousChapter
  // load previous chapter
  loadPreviousChapter() {
    console.log('Load Previous Chapter');
    this.setState({loadLock: true});
    
    var components = this.state.components.slice();
    var idArr = this.state.idArr.slice();
    var nToBase = this.state.toBase + 1;
    var ncco = this.state.firstChapterOrder - 1;
    var content = readChapter(
      this.props.book, 
      this.state.currentChapterOrder,
      this.state.index, 
      -1
    );
    var newId = 'reading-content-' + String(5000 - nToBase);

    var prevComponent = (
      <ReadingContent 
        key={newId}
        cid={newId}
        content={this.state.prevContent}
        chapters={this.state.index.chapter}
        currentChapterOrder={ncco + 1}
        bookTitle={this.props.book.bookTitle}
      />
    );
    var component = (
      <ReadingContent 
        key='reading-content-head' 
        cid='reading-content-head' 
        content={content} 
        chapters={this.state.index.chapter} 
        currentChapterOrder={ncco} 
        bookTitle={this.props.book.bookTitle}
      />
    );

    components.shift();
    components.unshift(prevComponent);
    components.unshift(component);

    idArr.shift();
    idArr.unshift(newId);
    idArr.unshift('reading-content-head');

    this.setState({
      components: components,
      // currentChapter: this.state.index.chapter[ncco],
      // currentChapterOrder: ncco,
      firstChapterOrder: ncco,
      toBase: nToBase,
      idArr: idArr,
      prevContent: content, 
      firstIsLoad: ncco === 0,

      currentIdArrIndex: this.state.currentIdArrIndex + 1,
    });
    // this.props.dispatch(setNavTitle(this.state.index.chapter[ncco]));

    setTimeout(() => {
      var scrollbox = document.getElementById('reading-scrollbox');
      var firstEle  = document.getElementById('reading-content-head');
      scrollbox.scrollTop = firstEle.scrollHeight + firstEle.offsetTop - 40;
      this.setState({loadLock: false,});
    }, 10);
  }

// jumpToChapter
  // jump to certain chapter
  jumpToChapter(chapter, chapterOrder) {
    console.log('jump to chapter', chapter);
    this.props.dispatch(setCurBook({
      ...this.props.book,
      currentChapter: chapter,
      currentChapterOrder: chapterOrder,
      scrollTop: 0,
      scrollHeight: 0,
    }));
    setTimeout(() => {
      this.setState({chapterState: 3});
      this.props.dispatch(setNavbarCover(3));
      setTimeout(() => {
        this.setState({chapterState: 0});
        this.props.dispatch(setNavbarCover(0));
      }, 300);
      this.initReading();
      this.updateScrollTop(true);
    }, 1);
  }

// jumpToBookmark
  // handle bookmark click event: jump to the destination
  jumpToBookmark(bookmark) {
    console.log('jump to bookmark:', bookmark.content);
    this.props.dispatch(setCurBook({
      ...this.props.book,
      currentChapter: bookmark.currentChapter,
      currentChapterOrder: bookmark.currentChapterOrder,
      scrollTop: bookmark.scrollTop,// + (this.props.menuExpand ? 40 : 0),
      scrollHeight: bookmark.scrollHeight,
    }));
    setTimeout(() => {
      this.initReading();
      this.updateScrollTop();
    }, 1);
  }

// jumpToProgress
  // handle progress jump
  jumpToProgress() {

    if (this.state.jumpProgress.length === 0) {
      this.setState({jumpState: false, jumpProgress: ''});
      return;
    }
    console.log('Jump to progress', this.state.jumpProgress);
    if (isNaN(Number(this.state.jumpProgress))) {
      console.error('in function "jumpToProgress": Input is not a number!');
      return;
    }
    let progress = this.props.book.totalChapter * Number(this.state.jumpProgress) / 100;
    let chapterOrder = Math.floor(progress);
    let scrollTop = Number(((progress - chapterOrder) * 1000).toFixed(0));
    let scrollHeight = 1000;
    this.setState({jumpState: false, jumpProgress: ''});
    this.props.dispatch(setCurBook({
      ...this.props.book,
      currentChapter: this.state.index.chapter[chapterOrder],
      currentChapterOrder: chapterOrder,
      scrollTop: scrollTop,
      scrollHeight: scrollHeight,
    }));
    setTimeout(() => {
      this.initReading();
      this.updateScrollTop();
    }, 1);  
  }

// handleChapterButtonClick 
  // handle display of if chapterlist 
  handleChapterButtonClick() {
    if (this.state.chapterState === 0) {
      this.setState({chapterState: 1});
      this.props.dispatch(setNavbarCover(1));
      setTimeout(() => {
        this.setState({chapterState: 2});
        this.props.dispatch(setNavbarCover(2));
      }, 300);
    } else if (this.state.chapterState === 2) {
      this.setState({chapterState: 3});
      this.props.dispatch(setNavbarCover(3));
      setTimeout(() => {
        this.setState({chapterState: 0});
        this.props.dispatch(setNavbarCover(0));
      }, 300);
    }
  }

// handleBookmarkButtonClick
  // handle is bookmark list will display
  handleBookmarkButtonClick() {
    if (this.state.bookmarkState === true) {
      this.setState({bookmarkState: false});
    } else {
      this.setState({bookmarkState: true});
    }
  }

// handleAddbookmarkButtonClick
  // handle add bookmark and display adding animation
  handleAddbookmarkButtonClick() {
    if (this.state.bookmarkAnimation !== 0) return;
    this.setState({bookmarkAnimation: 1});
    setTimeout(() => {
      this.setState({bookmarkAnimation: 2});
      setTimeout(() => {
        this.setState({bookmarkAnimation: 3});
        setTimeout(() => {
          this.setState({bookmarkAnimation: 0});
        }, 300);
      }, 300);
    }, 300);

    var {idArr, currentIdArrIndex} = this.state;
    var scrollTop    = document.getElementById('reading-scrollbox').scrollTop;
    var curEle       = document.getElementById(idArr[currentIdArrIndex]);
    var preEle       = document.getElementById(idArr[currentIdArrIndex - 1]);
    var nextEle      = document.getElementById(idArr[currentIdArrIndex + 1]);
    var curScrollTop = scrollTop - curEle.offsetTop + (this.props.menuExpand ? 40 : 0);
    var preScrollTop = scrollTop - preEle.offsetTop + (this.props.menuExpand ? 40 : 0);

    var lineIndex;
    var formated;
    var content;
    var bookmarkContent;
    var newBookmark;
    if (curScrollTop < 0) { // if current chapter is below top edge
      content = preEle.innerText.split('\n');
      formated = this.formatContent(content, preEle.offsetWidth - 5);
      lineIndex = Math.floor((preScrollTop) / preEle.offsetHeight * formated.length);
      bookmarkContent = this.getBookmarkContent(formated, lineIndex);
      // if bookmarkContent is empty, then try to get content of previous content
      if (isEmptyLine(bookmarkContent)) { 
        bookmarkContent = this.getBookmarkContent(curEle.innerText, 0);  
        newBookmark = {
          currentChapter: this.state.currentChapter,
          currentChapterOrder: this.state.currentChapterOrder,
          scrollTop: 0,
          scrollHeight: curEle.scrollHeight,
          content: bookmarkContent,
          addTime: getCurrentTime(),
        };
      } else { 
        newBookmark = {
          currentChapter: this.state.index.chapter[this.state.currentChapterOrder - 1],
          currentChapterOrder: this.state.currentChapterOrder - 1,
          scrollTop: preScrollTop,
          scrollHeight: preEle.scrollHeight,
          content: bookmarkContent,
          addTime: getCurrentTime(),
        };
      }
    } else {
      content = curEle.innerText.split('\n');
      formated = this.formatContent(content, curEle.offsetWidth - 5);
      lineIndex = Math.floor((curScrollTop) / curEle.offsetHeight * formated.length);
      bookmarkContent = this.getBookmarkContent(formated, lineIndex);
      // if bookmarkContent is empty, then try to get content of next chapter
      if (isEmptyLine(bookmarkContent)) {
        bookmarkContent = this.getBookmarkContent(nextEle.innerText, 0);
        newBookmark = {
          currentChapter: this.state.index.chapter[this.state.currentChapterOrder + 1],
          currentChapterOrder: this.state.currentChapterOrder + 1,
          scrollTop: 0,
          scrollHeight: nextEle.scrollHeight,
          content: bookmarkContent,
          addTime: getCurrentTime(),
        };
      } else {
        newBookmark = {
          currentChapter: this.state.currentChapter,
          currentChapterOrder: this.state.currentChapterOrder,
          scrollTop: curScrollTop,
          scrollHeight: curEle.scrollHeight,
          content: bookmarkContent,
          addTime: getCurrentTime(),
        };
      }
    }
    
    var bookmarks = this.state.index.bookmark.slice();
    bookmarks.push(newBookmark);
    this.setState({index: {
      bookmark: bookmarks,
      chapter: this.state.index.chapter,
    }});
    setTimeout(() => {
      saveBookmark(this.props.book.bookPath, this.state.index.bookmark);
    }, 1);
  }
  // formatContent
  // simulating browser typesetting
  formatContent(content, width) {
    let result = [];
    for (let i in content) {
      let curLine = content[i];
      let formatedLine = '';
      for (let j in curLine) {
        let measureWidth = this.measureWidth(formatedLine + curLine[j]);
        if (measureWidth <= width) {
          formatedLine += curLine[j];
        } else {
          result.push(formatedLine);
          formatedLine = curLine[j];
        }
      }
      result.push(formatedLine);
    }
    return result;
  }
  // measureWidth
  // measure width of current line by using canvas
  measureWidth(string) {
    let element = document.createElement('canvas');
    let context = element.getContext('2d');
    context.font = this.props.fontSize.toString() + 'px sans-serif';
    return context.measureText(string).width;
  }
  // getBookmarkContent
  // get preview content of bookmark from current page
  getBookmarkContent(formated, lineIndex) {
    let result = '';
    for (let i = lineIndex; i < formated.length; i++) {
      for (let j in formated[i]) {
        if (result.length > 99) return result;
        else result += formated[i][j];
      }
    }
    return result;
  }

// handleJumpButtonClick
  // handle jump to certain percentage of current novel
  handleJumpButtonClick() {
    if (this.state.jumpState === true) {
      this.setState({jumpState: false});
    } else {
      this.setState({jumpState: true, jumpProgress: ''});
    }
  }

// handleSearchButtonClick
  // handle if search page is display
  handleSearchButtonClick() {
    if (this.state.searchState === true) {
      this.setState({searchState: false});
    } else {
      this.setState({searchState: true});
    }
  }

// handleSearching
  // search matching string in local files
  handleSearching() {
    let value = document.getElementById('reading-serachbox-input').value;
    this.setState({searchComplete: false});

  }

  handleSearchBoxInput(e) {
    let keyCode = e.keyCode | e.which;
    if (keyCode === 13) {
      let value = document.getElementById('reading-searchbox-input').value;
      if (value === '') {
        console.log('Reading: handleSearchBoxInput: empty input.');
        this.handleSearchButtonClick();
      } else {
        console.log('start to search "' + value + '" in local files');
        this.handleSearching();
      }
    }
  }

// handleJumpBoxInput
  // handle input formatof jump input box
  handleJumpBoxInput(e) {
    let keyCode = e.keyCode | e.which;
    let jp = this.state.jumpProgress;
    if (keyCode === 13) {
      this.jumpToProgress();
    } else if (keyCode === 8 && jp.length > 0) {
      this.setState({jumpProgress: jp.slice(0, jp.length - 1)});
    }
    if (jp[1] === '.' && jp.length > 4) return;
    if (jp[2] === '.' && jp.length > 5) return;
    if (keyCode >= 48 && keyCode <= 57) {
      if (jp === '0' || (jp.length === 2) && jp.indexOf('.') === -1) {
        this.setState({jumpProgress: jp + '.' + (keyCode - 48).toString()});
      } else {
        this.setState({jumpProgress: jp + (keyCode - 48).toString()});
      }
    } else if (keyCode === 190) {
      if (jp.length === 0) {
        this.setState({jumpProgress: '0.'});
      } else if (jp.indexOf('.') === -1 && jp.length < 3) {
        this.setState({jumpProgress: jp + '.'});
      } 
    }
  }

// deleteBookmark
  // delete certain bookmark
  deleteBookmark(addTime) {
    let bookmarks = this.state.index.bookmark.slice();
    bookmarks = bookmarks.filter(bookmark => bookmark.addTime !== addTime);
    this.setState({index:{
      bookmark: bookmarks,
      chapter: this.state.index.chapter,
    }});
    setTimeout(() => {
      saveBookmark(this.props.book.bookPath, this.state.index.bookmark);
    }, 1);
  }

// saveBook
  // save current book into disk
  saveBook() {
    if (this.props.book !== null && this.props.book !== undefined && this.state.noRecent === false) {
      var idArr = this.state.idArr;
      var index = this.state.currentIdArrIndex;
      var currentEle = document.getElementById(idArr[index]);
      var scrollbox = document.getElementById('reading-scrollbox');
      var newScrollTop = scrollbox.scrollTop - currentEle.offsetTop + 64; // TODO: why need to add 64 for offset?
      var savingBook = {
        ...this.props.book,
        currentChapter: this.state.currentChapter,
        currentChapterOrder: this.state.currentChapterOrder,
        scrollTop: newScrollTop < 0 ? 0 : newScrollTop,
        scrollHeight: currentEle.scrollHeight,
        lastReadTime: getCurrentTime(),
      };
      this.props.dispatch(updateBook(savingBook));
      this.props.dispatch(setCurBook(savingBook));
    }
  }
}

export default connect (state => ({
  book:          state.main.curBook,
  books:         state.library.books,
  color:         state.setting.color,
  navigator:     state.main.navigator,
  preNavigator:  state.main.preNavigator,
  menuExpand:    state.setting.menuExpand,
  langPack:      state.main.langPack,
  lineHeight:    state.setting.lineHeight,
  fontSize:      state.setting.fontSize,
  recentReading: state.library.recentReading,
  reload:        state.main.readingReload,
}))(Reading);

/* bookmark format:
bookmark: [
  {
    currentChapter: string,
    currentChapterOrder: number,
    scrollTop: number,                                  // position in current chapter
    scrollHeight: number,                               // scroll height of current chapter
    content: string,                                    // preview in bookmark list
    addTime: [year, month, day, hour, minute, second],  // for displaying in bookmark list
    progress: number, // percentage of whole book, but not need to be store in bookmark. 
                      // Calculated when bookmark is going go be rendered.
  }, {
  ...
]
*/
