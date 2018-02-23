// LibraryItem.jsx

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
  setCurBook,
} from '../states/mainState.js';

// ============================================
// import apis

// ============================================
// import css file
import '../styles/LibraryItem.css';

// ============================================
// react components
class LibraryItem extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    edit: PropTypes.bool,
    select: PropTypes.bool,
    book: PropTypes.object,
    handleAddSelect: PropTypes.func,
    langPack: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.lang = this.props.langPack.LibraryItem;

    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      
    };
  }

  render() {
    var lastReadTime = this.getLastReadTime(this.props.book.lastReadTime);
    return (
      <div className='libraryItem'>
        <div className='libraryItem-cover' onClick={this.handleSelect}>
          <div className='container'>
            <div className={this.props.select === true && this.props.edit === true ?
              'libraryItem-title libraryItem-select' : 'libraryItem-title'}>
              {this.props.book.bookTitle}
            </div>

            <div style={{height: '1px', backgroundColor: '#bbb', margin: '4px'}}></div>

            <div className='libraryItem-author'>{this.lang.author}{this.props.book.author === 'unknown' ? this.lang.authorUnknown : this.props.book.author}</div>
            <div className='libraryItem-property'>{this.lang.currentChapter} {this.props.book.currentChapterOrder !== -1 ? ' (' + String(this.props.book.currentChapterOrder) + '/' + String(this.props.book.totalChapter) + ')' : ''}</div>
            <div className='libraryItem-property'>{this.props.book.currentChapter === -1 ? this.lang.unread : this.props.book.currentChapter}</div>

            <div className='libraryItem-lastRead'>{this.lang.lastRead}{lastReadTime}</div>
          </div>
        </div>
      </div>
    );
  }

  handleSelect() {
    if (this.props.edit === true) {
      if (this.props.select === false) {
        this.props.handleAddSelect(this.props.book.bookPath);
      } else {
        this.props.handleCancleSelect(this.props.book.bookPath);
      }
    } else {
      this.props.dispatch(setCurBook(this.props.book));
      this.props.dispatch(setNavigator('/reading'));
    }
  }

  getLastReadTime(timeArr) {
    // if current book is not read, then timeArr will be [], whose length is 0
    if (timeArr.length !== 6) { 
      return this.lang.unread;
    } 
    return String(timeArr[0]) + '/' +
           String(timeArr[1]) + '/' +
           String(timeArr[2]) + ' ' +
           String(timeArr[3]) + ':' +
           String(timeArr[4]) + ':' +
           String(timeArr[5]);
  }
}

export default connect (state => ({
  langPack: state.main.langPack
}))(LibraryItem);
