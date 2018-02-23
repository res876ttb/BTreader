// ChapterList.jsx

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// ============================================
// import react components

// ============================================
// import react redux-action

// ============================================
// import apis

// ============================================
// import css file
import '../styles/ChapterList.css';

// ============================================
// react components
class ChapterList extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    chapters: PropTypes.array,
    jumpToChapter: PropTypes.func,
    menuExpand: PropTypes.bool,
    langPack: PropTypes.object,
    chapterState: PropTypes.number,
    handleCloseChapterlist: PropTypes.func,
    currentChapter: PropTypes.any,
    bookTitle: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.lang = this.props.langPack.ChapterList;
    this.handleChapterClick = this.handleChapterClick.bind(this);
    this.handleCloseChapterlist = this.handleCloseChapterlist.bind(this);

    this.state = {
      prevChapter: '',
      chapters: [],
      bookTitle: '',
      preventUpdate: false,
    };
  }

  componentWillMount() {
    var chapters = this.getChapters();
    this.setState({chapters: chapters, bookTitle: this.props.bookTitle});
  }

  componentWillUpdate() {
    if (this.props.bookTitle !== this.state.bookTitle) {
      var chapters = this.getChapters();
      this.setState({chapters: chapters, bookTitle: this.props.bookTitle});
    }
  }

  componentDidUpdate() {
    if (this.props.chapterState !== 0 && this.props.currentChapter != 0 && !this.state.preventUpdate) {
      var currentChapter = document.getElementById(this.props.currentChapter);
      var parent = document.getElementById('chapterlist-items');
      parent.scrollTop = currentChapter.offsetTop - 60;
      currentChapter.style.color = 'rgb(0, 101, 184)';
      if (this.state.prevChapter !== this.props.currentChapter) {
        var previousChapter = document.getElementById(this.state.prevChapter);
        if (previousChapter !== null)
          previousChapter.style.color = 'black';
        this.setState({prevChapter: this.props.currentChapter});
      }
    }
  }

  render() {
    // var chapters = this.getChapters();
    return (
      <div className={this.props.chapterState === 0 ? 'chapterlist-out hide' : 'chapterlist-out'}>
        <div className={
          this.props.chapterState === 1 ? 'chapterlist-cover fadein' :
          this.props.chapterState === 2 ? 'chapterlist-cover' :
          this.props.chapterState === 3 ? 'chapterlist-cover fadeout' :
          'chapterlist-cover hide'}
          onClick={this.props.handleCloseChapterlist}
        >
          
        </div>
        <div className={
          this.props.chapterState === 1 ? 'chapterlist-main chapterlist-movein' :
          this.props.chapterState === 2 ? 'chapterlist-main' :
          this.props.chapterState === 3 ? 'chapterlist-main chapterlist-moveout' :
          'chapterlist-main hide'}
        >
          {/* title */}
          <div className='chapterlist-title'>
            {this.lang.title}
          </div>

          {/* chapter list */}
          <div id='chapterlist-items' className='chapterlist-items'>
            {this.state.chapters}
          </div>

          {/* close button */}
          <div className='chapterlist-closebutton' onClick={this.handleCloseChapterlist}>
            <i className='fas fa-times'></i>
          </div>
        </div>
      </div>
    );
  }

  getChapters() {
    var chapters = [];
    var chapterOrder = 0;
    this.props.chapters.map(chapter => {
      let order = chapterOrder;
      chapters.push(
        <div key={chapter} id={chapter}>
          <div 
            className='chapterlist-chapteritem' 
            onClick={() => this.handleChapterClick(chapter, order)}
          >
            {chapter}
          </div>
          <div className='chapterlist-chapteritem-sep'></div>
        </div>
      );
      chapterOrder += 1;
    });

    // remove chapter 0, which is only a default value and not an genuine chapter
    chapters.shift();
    if (chapters.length > 0) {
      var chapter = this.props.chapters[this.props.chapters.length - 1];
      var order = this.props.chapters.length - 1;
      chapters.pop();
      chapters.push(
        <div 
          key={chapter}
          id={chapter} 
          className='chapterlist-chapteritem'
          onClick={() => this.handleChapterClick(chapter, order)}
        >
          {chapter}
        </div>
      );
    } else {
      // chapter is empty after remove chapter
      chapters = (
        <div className='chapterlist-nochapter'>
          {this.lang.nochapter}
        </div>
      )
    }

    return chapters;
  }

  handleChapterClick(chapter, chapterOrder) {
    this.props.jumpToChapter(chapter, chapterOrder);
    this.setState({preventUpdate: true});
    setTimeout(() => {
      this.setState({preventUpdate: false});
    }, 350);
  }

  handleCloseChapterlist() {
    this.props.handleCloseChapterlist();
  }
}

export default connect (state => ({
  menuExpand: state.setting.menuExpand,
  langPack:   state.main.langPack,
}))(ChapterList);
