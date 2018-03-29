// OnlineListItem.jsx
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

    this.state = {
      menu: false,
    };
  }

  render() {
    return (
      <div className='oli-main has-shadow'>
        <div className='oli-booktitle'>{this.props.bookTitle}</div>
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
}

export default connect (state => ({
  langPack: state.main.langPack,
}))(OnlineListItem);
