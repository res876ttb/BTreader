// Online.jsx

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
// react components
class Online extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    return (
      <div>
        <div style={{
          position: 'absolute',
          left: '30%',
          right: '30%',
          width: '40%',
          top: '100px',
          height: '200px',
          borderRadius: '8px',
          backgroundColor: 'rgb(206, 192, 131)'
        }}>online</div>
      </div>
    );
  }
}

export default connect (state => ({

}))(Online);
