// BookmarkListItem.jsx
//  Maintain top-level program data.

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

// ============================================
// constants

// ============================================
// react components
class BookmarkListItem extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    lang:                          PropTypes.object,
    bookmark:                      PropTypes.object,
    waitDelete:                    PropTypes.array,
    getAddTime:                    PropTypes.func,
    getPercentage:                 PropTypes.func,
    handleJumpToBookmark:          PropTypes.func,
    handleBookmarkButtonClick:     PropTypes.func,
    handleShowDeleteConfirmDialog: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    let bookmark = this.props.bookmark;
    let selected = this.props.waitDelete === bookmark.addTime;
    return (
      <div 
        className={'bl-item' + (selected ? ' bl-item-selected' : '')}
        onClick={() => {
          this.props.handleJumpToBookmark(bookmark);
          this.props.handleBookmarkButtonClick();
        }}
      >
        <div className='bl-item-content'>{bookmark.content}</div>
        <div className='bl-item-status'>
          <div className='bl-item-percentage'>
            {this.props.getPercentage(bookmark)}
          </div>
          <div className='bl-item-addTime'>
            {this.props.getAddTime(bookmark.addTime)}
          </div>
          <div className={'bl-item-delete' + (selected ? ' bl-item-delete-selected' : '')}
            onClick={(e) => {
              e.stopPropagation();
              this.props.handleShowDeleteConfirmDialog(bookmark.addTime)
            }}>
            <i className='fas fa-trash-alt'></i> {this.props.lang.delete}
          </div>
        </div>
      </div>
    );
  }
}

export default connect (state => ({

}))(BookmarkListItem);
