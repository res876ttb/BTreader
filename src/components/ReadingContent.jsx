// ReadingContent.jsx

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
class ReadingContent extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    content: PropTypes.string,
    cid: PropTypes.string,
    chapters: PropTypes.array,
    currentChapterOrder: PropTypes.number,
    bookTitle: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    return (
      <div id={this.props.cid}>
        <div className='reading-chapter'>
          {this.props.content === null ? '' :
           this.props.currentChapterOrder <= 0 ? 
           this.props.bookTitle : 
           this.props.chapters[this.props.currentChapterOrder]}
        </div>
        <div className='reading-content'>
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default connect (state => ({

}))(ReadingContent);
 