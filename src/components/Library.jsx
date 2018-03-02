// Library.jsx
//  Manage books.

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  Button,
} from 'reactstrap';

// ============================================
// import react components
import LibraryItem from './LibraryItem.jsx';

// ============================================
// import react redux-action
import {
  setSortby,
} from '../states/settingState.js';
import { 
  addLocalBook, deleteBooks 
} from '../states/libraryState';
import { 
  setNavigator 
} from '../states/mainState';

// ============================================
// import apis
import {
  newLocal,
  processLocal,
} from '../utils/fileUtilities.js';

// ============================================
// import css file
import '../styles/Library.css';

// ============================================
// constants

// ============================================
// react components
class Library extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    sortby: PropTypes.string,
    langPack: PropTypes.object,
    books: PropTypes.object,
    lang: PropTypes.string,
    fontSize: PropTypes.number,
    navigator: PropTypes.string,
    lineHeight: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.lang = this.props.langPack.Library;

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSortby = this.handleSortby.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleNewLocal = this.handleNewLocal.bind(this);
    this.handleAddSelect = this.handleAddSelect.bind(this);
    this.handleCancleSelect = this.handleCancleSelect.bind(this);
    this.handleToOnline = this.handleToOnline.bind(this);

    this.state = {
      edit: false,
      dropdown: false,
      select: [],
    };
  }

  render() {
    var books = [];
    var controlButton;

    // define button 
    var sortByButton = (
      <Button 
        color='info' 
        className='library-edit-button library-edit-sortby stashadow-mini' 
        onClick={this.handleSortby}
      >
        {this.lang.button_sortedby}{
          this.props.sortby === 'addTime' ? this.lang.sort1 : 
          this.props.sortby === 'lastReadTime' ? this.lang.sort2 : 
          this.lang.sort3}
      </Button>
    );
    var openButton = (
      <Button 
        color="primary" 
        className="library-edit-button stashadow-mini" 
        onClick={this.handleNewLocal}
      >
        {this.lang.button_newLocal}
      </Button>
    );
    var editButton = (
      <Button 
        color='info' 
        className="library-edit-button stashadow-mini" 
        onClick={this.handleEditClick}
      >
        {this.lang.button_edit}
      </Button>
    );
    var editDoneButton = (
      <Button 
        color="success" 
        className="library-edit-button stashadow-mini" 
        onClick={this.handleEditClick}
      >
        {this.lang.button_editDone}
      </Button>
    )
    var deleteButton = (
      <Button 
        color="danger" 
        className="library-edit-button stashadow-mini" 
        onClick={this.handleDelete}
      >
        {this.lang.button_delete}
      </Button>
    )

    // define control button panel
    if (this.state.edit === false) {
      controlButton = (
        <div>
          {sortByButton}{editButton}{openButton}
        </div>
      );
    } else {
      if (this.state.select.length === 0) {
        controlButton = (
          <div>
            {sortByButton}{editDoneButton}{openButton}
          </div>
        )
      } else {
        controlButton = (
          <div>
            {sortByButton}{editDoneButton}{deleteButton}
          </div>
        )
      }
    }

    // display books
    let libraryKeys = this.sortBook();
    for (var i = 0; i < libraryKeys.length; i++) {
      books.push((
        <LibraryItem 
          key={'libraryItem' + String(i)}
          bookPath={libraryKeys[i]}
          edit={this.state.edit}
          select={this.state.select.indexOf(libraryKeys[i]) > -1}
          handleAddSelect={this.handleAddSelect}
          handleCancleSelect={this.handleCancleSelect}
        />
      ));
    }

    return (
      <div className='library-main container'>
        <div className='library-control-panel container'>
          {controlButton}
        </div>
        {books.length === 0 ? 
        <div className='library-nobooks'>
          <div className='library-nobooks-in'>
            {this.lang.noBooks1}
            <span className='library-highlight' onClick={this.handleNewLocal}> {this.lang.noBooks2} </span>
            {this.lang.noBooks3}
            <span className='library-highlight' onClick={this.handleToOnline}> {this.lang.noBooks4} </span>
            {this.lang.noBooks5}
          </div>          
        </div>
         : books}
      </div>
    );
  }

  handleEditClick() {
    if (this.state.edit === true) {
      console.log('Edit:', false);
      this.setState({edit: false, select: []});
    } else {
      console.log('Edit:', true);
      this.setState({edit: true});
    }
  }

  handleSortby() {
    if (this.props.sortby === 'bookTitle') {
      this.props.dispatch(setSortby('addTime'));
    } else if (this.props.sortby === 'addTime') {
      this.props.dispatch(setSortby('lastReadTime'));
    } else {
      this.props.dispatch(setSortby('bookTitle'));
    }
  }

  handleAddSelect(bookPath) {
    var s = this.state.select.slice();
    s.push(bookPath)
    this.setState({select: s});
    console.log('Select book:', bookPath);
  }

  handleCancleSelect(bookPath) {
    var s = this.state.select.slice();
    var i = s.indexOf(bookPath);
    if (i > -1) {
      s.splice(i,1);
    }
    this.setState({select: s});
    console.log('Cancle select book:', bookPath);
  }

  handleDelete() {
    var select = this.state.select.slice();
    this.props.dispatch(deleteBooks(this.state.select));
    this.setState({select: [], edit: false});
  }

  handleToOnline() {
    this.props.dispatch(setNavigator('/online'));
  }

  handleNewLocal() {
    var paths = newLocal();
    this.setState({select: [], edit: false});
    for (var i in paths) {
      let path = paths[i];
      let bookTitle = path.split('/').pop().split('\\').pop().split('.')[0];
      if (this.isBookExists(bookTitle) === false) {
        processLocal(path, bookTitle, this.props.lang).then(v => {
          let bookPath = v.bookPath;
          let totalChapter = v.totalChapter;
          this.props.dispatch(addLocalBook(bookPath, bookTitle, this.props.fontSize, this.props.lineHeight, totalChapter));
        }).catch(err => {
          console.error(err);
        });
      } else {
        console.log('Book', bookTitle, 'has been added to library!');
        setTimeout(() => {
          alert('Book "' + bookTitle + '" has been added to library!');
        }, 500);
      }
    }
  }

  isBookExists(bookTitle) {
    for (var i in this.props.books) 
      if (this.props.books[i].bookTitle === bookTitle)
        return true;
    return false;
  }

  sortBook() {
    var books = this.props.books;
    var sorted;
    if (this.props.sortby === 'addTime') {
      sorted = Object.keys(books).sort((a, b) => {
        return books[a].addTime > books[b].addTime ? 1 : -1
      });
    } else if (this.props.sortby === 'lastReadTime') {
      sorted = Object.keys(books).sort((a, b) => {
        return books[a].lastReadTime < books[b].lastReadTime ? 1 : -1
      });
    } else {
      sorted = Object.keys(books).sort((a, b) => {
        return books[a].bookTitle > books[b].bookTitle ? 1 : -1
      });
    }
    
    return sorted;
  }
}

export default connect (state => ({
  sortby:     state.setting.sortby,
  langPack:   state.main.langPack,
  books:      state.library.books,
  lang:       state.setting.lang,
  fontSize:   state.setting.fontSize,
  lineHeight: state.setting.lineHeight,
  navigator:  state.main.navigator,
}))(Library);
