// Reading.jsx

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components
import ReadingContent from './ReadingContent.jsx';
import ChapterList from './ChapterList.jsx';

// ============================================
// import react redux-action
import {
  setNavigator,
  setCurBook,
  setNavTitle,
} from '../states/mainState.js';

// ============================================
// import apis
import {
  readChapter,
  readIndex,
} from '../utils/fileUtilities.js';

// ============================================
// import css file
import '../styles/Reading.css';

// ============================================
// react components
class Reading extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    book: PropTypes.object,
    navigator: PropTypes.string,
    preNavigator: PropTypes.string,
    menuExpand: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.checkIfLoading = this.checkIfLoading.bind(this);
    this.jumpToChapter = this.jumpToChapter.bind(this);
    this.handleBookmarkButtonClick = this.handleBookmarkButtonClick.bind(this);
    this.handleChapterButtonClick = this.handleChapterButtonClick.bind(this);
    this.handleJumpButtonClick = this.handleJumpButtonClick.bind(this);
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
    this.handleAddbookmarkButtonClick = this.handleAddbookmarkButtonClick.bind(this);

    // declare state and type/default value
    this.state = {
      index: {}, // index for chapter and bookmark
      bookTitle: '', // book title
      
      prevContent: '', // content of current first chapter
      nextContent: '', // content of current last chapter

      components: [], // reading content div
      fromBase: 0, // how many chapters are there from base chapter to last chapter
      toBase: 0,   // how many chapters are there from first chapter to base chapter
      
      currentChapter: '', // current chapter
      currentChapterOrder: -1, // index of current chapter in index.chapter
      
      idArr: [], // id array for components
      currentIdArrIndex: -1, // index of id of current visible component

      scrollInit: true, // for change current scroll offset. When true, 
      loadLock: false, // lock checkIfLoading to prevent double/triple loading

      chapterState: 0, // for displaying chapter
      bookmarkState: 0, // for displaying bookmark
      jumpState: 0, // for displaying jump
      searchState: 0, // for displaying searchbar 
      // 0 for close; 1 for opening animation; 2 for open; 3 for closing animation
      addBookmarkState: 0, // for displaying animation of adding bookmark
      // 0 for close; 1 for sliding in; 2 for sliding out
    };
  }

  componentWillMount() {
    this.initReading();
  }

  componentDidMount() {
    this.updateScrollTop();
  }

  componentDidUpdate() {
    if (this.state.bookTitle !== this.props.book.bookTitle) {
      console.log('Reading book is changed!');
      this.initReading();
    } 
    this.updateScrollTop();
  }

  render() {
    return (
      <div className='reading-out'>
        <div 
          id='reading-scrollbox' 
          className='reading-main container max720' 
          onScroll={this.checkIfLoading}
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
                onClick={this.handleSearchButtonClick}
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

        <ChapterList 
          chapters={this.state.index.chapter} 
          jumpToChapter={this.jumpToChapter} 
          handleCloseChapterlist={this.handleChapterButtonClick}
          chapterState={this.state.chapterState}
          currentChapter={this.state.currentChapter}
          bookTitle={this.props.book.bookTitle}
        />
        {/* <Bookmark /> */}
      </div>
    );
  }

  updateScrollTop() {
    if (this.state.scrollInit === false) {
      var scrollbox = document.getElementById('reading-scrollbox');
      var offset = document.getElementById('reading-content-head').scrollHeight + 
                   (this.props.book.currentChapterOrder === 0 ? 0 : 40);
      scrollbox.scrollTop = offset;
      setTimeout(() => {
        this.setState({scrollInit: true});
      }, 10);
    }
  }

  initReading() {
    if (this.props.book === null || this.props.book === undefined) {
      console.log(this.props.book);
      this.props.dispatch(setNavigator(this.props.preNavigator));
    } else {

    var index, content = ['','',''];
    index = readIndex(this.props.book);
    if (index === null) {
      alert('Book data is deleted unexpectedly! This book will be deleted automatically from library.');
      // TODO: delete books and navigate back
    } else {

    var cco = this.props.book.currentChapterOrder == -1 ? 0 : this.props.book.currentChapterOrder;
    var idArr = ['reading-content-head', 'reading-content-5000', 'reading-content-tail'];
    var currentChapter  = cco == 0 ? 0 : this.props.book.currentChapter;

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
      index: index, // book index
      bookTitle: this.props.book.bookTitle,
      
      prevContent: content[0], // content of current first chapter
      nextContent: content[2], // content of current last chapter

      components: components, // reading content div
      fromBase: 0, // how many chapters are there from base chapter to last chapter
      toBase: 0,   // how many chapters are there from first chapter to base chapter
      
      currentChapter: currentChapter,
      currentChapterOrder: cco,
      
      idArr: idArr,
      currentIdArrIndex: 1,

      scrollInit: false, // for change current scroll offset
    });

    if (this.props.book.currentChapterOrder === -1) 
      this.props.dispatch(setCurBook({
        ...this.props.book,
        currentChapterOrder: 0,
        currentChapter: 0,
      }));
  }}}
  
  checkIfLoading() {
    if (this.state.scrollInit === false || this.state.loadLock) return;
    var a          = document.getElementById('reading-scrollbox').scrollTop;
    var tail       = document.getElementById('reading-content-tail').offsetTop;

    var loadPrev = (this.state.loadLock === false) &&
                   (a === 0) &&
                   (this.state.currentChapterOrder > 0);
    var loadNext = (this.state.loadLock === false) &&
                   (a + window.innerHeight > tail) && 
                   (this.state.currentChapterOrder + 1 < this.props.book.totalChapter);
          
    if (loadNext) this.loadNextChapter();
    else if (loadPrev) this.loadPreviousChapter();
    else if (this.state.loadLock === false &&
             currId !== 'reading-content-head' && 
             currId !== 'reading-content-tail') {
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

  loadNextChapter() {
    console.log('Load Next Chapter');
    this.setState({loadLock: true});
    var components = this.state.components.slice();
    var idArr = this.state.idArr.slice();
    var nFromBase = this.state.fromBase + 1;
    var ncco = this.state.currentChapterOrder + 1;
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
      currentChapter: this.state.index.chapter[ncco],
      currentChapterOrder: ncco,
      fromBase: nFromBase,
      idArr: idArr,
      currentIdArrIndex: this.state.currentIdArrIndex + 1,
      loadLock: false,
      nextContent: content, 
    });
    this.props.dispatch(setNavTitle(this.state.index.chapter[ncco]));
  }

  loadPreviousChapter() {
    console.log('Load Previous Chapter');
    this.setState({loadLock: true});
    
    var components = this.state.components.slice();
    var idArr = this.state.idArr.slice();
    var nToBase = this.state.toBase + 1;
    var ncco = this.state.currentChapterOrder - 1;
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
      currentChapter: this.state.index.chapter[ncco],
      currentChapterOrder: ncco,
      toBase: nToBase,
      idArr: idArr,
      prevContent: content, 
    });
    this.props.dispatch(setNavTitle(this.state.index.chapter[ncco]));

    setTimeout(() => {
      var scrollbox = document.getElementById('reading-scrollbox');
      var firstEle  = document.getElementById('reading-content-head');
      scrollbox.scrollTop = firstEle.scrollHeight + firstEle.offsetTop - 40;
      this.setState({loadLock: false,});
    }, 10);
  }

  jumpToChapter(chapter, chapterOrder) {
    console.log('jump to', chapter);
    this.props.dispatch(setCurBook({
      ...this.props.book,
      currentChapter: chapter,
      currentChapterOrder: chapterOrder,
      offsetTop: 0,
      scrollHeight: 0,
    }));
    setTimeout(() => {
      this.setState({chapterState: 3});
      setTimeout(() => {
        this.setState({chapterState: 0});
      }, 300);
      this.initReading();
      this.updateScrollTop();
    }, 1);
  }

  handleChapterButtonClick() {
    if (this.state.chapterState === 0) {
      this.setState({chapterState: 1});
      setTimeout(() => {
        this.setState({chapterState: 2});
      }, 300);
    } else if (this.state.chapterState === 2) {
      this.setState({chapterState: 3});
      setTimeout(() => {
        this.setState({chapterState: 0});
      }, 300);
    }
  }

  handleBookmarkButtonClick() {

  }

  handleAddbookmarkButtonClick() {

  }

  handleJumpButtonClick() {

  }

  handleSearchButtonClick() {

  }
}

export default connect (state => ({
  book:         state.main.curBook,
  navigator:    state.main.navigator,
  preNavigator: state.main.preNavigator,
  menuExpand:   state.setting.menuExpand,
}))(Reading);
