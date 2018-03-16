// BookmarkList.jsx

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle, DialogActions } from 'material-ui/Dialog';

// ============================================
// import react components
import BookmarkListItem from './BookmarkListItem.jsx';

// ============================================
// import react redux-action

// ============================================
// import apis
import {
  compareTime
} from '../utils/clockUtilities.js';

// ============================================
// import css file
import '../styles/BookmarkList.css';

// ============================================
// constants
const styles = {
  
};

// ============================================
// react components
class BookmarkList extends React.Component {
  static propTypes = {
    dispatch:                  PropTypes.func,
    bookmarks:                 PropTypes.array,
    bookmarkState:             PropTypes.bool,
    handleBookmarkButtonClick: PropTypes.func,
    langPack:                  PropTypes.object,
    book:                      PropTypes.object,
    deleteBookmark:            PropTypes.func,
    handleJumpToBookmark:      PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.lang = this.props.langPack.BookmarkList;

    this.handleShowDeleteConfirmDialog = this.handleShowDeleteConfirmDialog.bind(this);
    this.handleCancleDelete = this.handleCancleDelete.bind(this);
    this.handleDeleteBookmark = this.handleDeleteBookmark.bind(this);

    this.getPercentage = this.getPercentage.bind(this);
    this.getAddTime = this.getAddTime.bind(this);

    this.state = {
      sortby: 'progress', // addTime, progress
      confirmDelete: false, // for displaying confirm dialog
      waitDelete: [], // after confirm dialog is show, the bookmark will be deleted.
    };
  }

  render() {
    let bookmarks = this.sortBookmark();
    let bookmarkComponents = this.getBookmarkComponents(bookmarks);
    return (
      <Dialog
        open={this.props.bookmarkState}
        onClose={this.props.handleBookmarkButtonClick}
      >
        <DialogTitle>{this.lang.title}</DialogTitle>
        <div style={{width: '400px', padding: '0px 24px', overflow: 'scroll'}}>
          {bookmarkComponents}
        </div>
        <div style={{height: '24px', minHeight: '24px'}}></div>
        <Dialog
          open={this.state.confirmDelete}
          onClose={this.handleCancleDelete}
        >
          <DialogTitle>{this.lang.confirmDelete}</DialogTitle>
          <DialogActions>
            <Button onClick={this.handleCancleDelete}>
              {this.lang.cancel}
            </Button>
            <Button onClick={this.handleDeleteBookmark} color='secondary'>
              {this.lang.confirm}
            </Button>
          </DialogActions>
        </Dialog>    
      </Dialog>
    );
  }

// getBookmarkComponents
  // return an array in which are bookmark items and sepration marks. 
  getBookmarkComponents(bookmarks) {
    var components = [];
    bookmarks.map(bookmark => {
      components.push(
        <BookmarkListItem 
          key={bookmark.addTime.toString()}
          lang={this.lang}
          bookmark={bookmark}
          waitDelete={this.state.waitDelete}
          getAddTime={this.getAddTime}
          getPercentage={this.getPercentage}
          handleJumpToBookmark={this.props.handleJumpToBookmark}
          handleBookmarkButtonClick={this.props.handleBookmarkButtonClick}
          handleShowDeleteConfirmDialog={this.handleShowDeleteConfirmDialog}
        />
      );
      components.push(
        <div className='bl-item-sep' key={bookmark.addTime.toString()+'sep'}></div>
      );
    });
    if (components.length > 0) {
      components.pop();
    }
    return components;
  }

// sortBookmark
  // sort bookmark order by addTime or progress.
  sortBookmark() {
    let bookmarks = this.props.bookmarks.slice();
    if (this.state.sortby === 'addTime') {
      bookmarks.sort((a,b) => {
        return compareTime(a.addTime, b.addTime) ? 1 : -1;
      });
      return bookmarks;
    } else {
      bookmarks.sort((a,b) => {
        return (  a.currentChapterOrder >   b.currentChapterOrder) ? 1 :
               (((a.currentChapterOrder === b.currentChapterOrder) &&
               (  a.scrollTop / a.scrollHeight > b.scrollTop / b.scrollHeight)) ? 1 :
               (( compareTime(a.addTime, b.addTime)) ? 1 : -1)); 
      });
      return bookmarks;
    }
  }

// getAddTime
  // convert addTime array into a string with proper time format.
  getAddTime(timeArr) {
    return String(timeArr[0]) + '/' +
           String(timeArr[1]) + '/' +
           String(timeArr[2]) + ' ' +
           String(timeArr[3]) + ':' +
           ((timeArr[4] > 10) ? String(timeArr[4]) : ('0' + String(timeArr[4]))) + ':' +
           ((timeArr[5] > 10) ? String(timeArr[5]) : ('0' + String(timeArr[5])));
  }

// getPercentage
  // get bookmark progress and return a string
  getPercentage(bookmark) {
    var cco = bookmark.currentChapterOrder;
    var tc  = this.props.book.totalChapter;
    var st  = bookmark.scrollTop;
    var sh  = bookmark.scrollHeight;
    var pt  = cco * 100 / tc + 100 * st / sh / tc;
    return pt.toPrecision(3).toString() + '%';
  }

// handleShowDeleteConfirmDialog 
  // handle open delete confirm dialog
  handleShowDeleteConfirmDialog(addTime) {
    this.setState({
      confirmDelete: true,
      waitDelete: addTime,
    });
  }

// handleDeleteBookmark 
  // delete selected book by addTime because addTime always unique.
  handleDeleteBookmark() {
    for (let i in this.props.bookmarks) {
      if (this.state.waitDelete === this.props.bookmarks[i].addTime) {
        this.props.deleteBookmark(this.state.waitDelete);
        this.setState({
          confirmDelete: false,
          waitDelete: [],
        });
      }
    }
  }

// handleCancleDelete
  // if blank is clicked or cancel button is clicked, cancle deletion
  handleCancleDelete() {
    this.setState({
      confirmDelete: false,
      waitDelete: [],
    });
  }
}

export default connect (state => ({
  langPack: state.main.langPack,
  book:     state.main.curBook,
}))(
  withStyles(styles)(BookmarkList)
);
