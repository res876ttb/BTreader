// Online.jsx

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

// ============================================
// import react components
import OnlineListItem from './OnlineListItem.jsx';

// ============================================
// import react redux-action

// ============================================
// import apis

// ============================================
// import css file
import '../styles/Online.css';

// ============================================
// constants
const styles = theme => ({
  searchBar: {
    width: '300px'
  },
  searchButton: {
    width: '36px',
    fontSize: '16px',
  }
});

// ============================================
// react components
class Online extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    langPack: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.lang = this.props.langPack.Online;

    this.handleSearchTargetChange = this.handleSearchTargetChange.bind(this);
    this.handleSearchEnterPress = this.handleSearchEnterPress.bind(this);
    this.handleSearchClearButton = this.handleSearchClearButton.bind(this);
    this.handleSearchClearContent = this.handleSearchClearContent.bind(this);

    this.state = {
      searchTarget: "bookTitle",
      searchClear: false,
      recommendList: [],
      searchList: [],
    };
  }

  componentDidMount() {
    this.getHTML('http://book100.com', response => {
      console.log(response.documentElement.innerHTML);
    });
  }

  render() {
    let divw10 = (<div style={{width: '10px', display: 'inline-block'}}></div>);
    let divh10 = (<div style={{height: '10px'}}></div>);

    let search = (
      <div className='online-search-panel online-search-background has-shadow'>
        <TextField
          id="online-search"
          placeholder={this.lang.search}
          type="search"
          className={this.props.classes.searchBar}
          margin="normal"
          onKeyDown={this.handleSearchEnterPress}
          onKeyUp={this.handleSearchClearButton}
          InputProps={{
            startAdornment: <div style={{marginTop: '5.8px', marginRight: '6px'}}><i className="fas fa-search"></i></div>,
            endAdornment: 
              <a
                className={this.state.searchClear ? '' : 'hide'}
                onClick={this.handleSearchClearContent}
                style={{marginTop: '5.8px', cursor: 'pointer'}}
              >
                <i className='fas fa-times-circle'></i>
              </a>,
          }}
        />

        {divw10}

        <FormControl>
          <InputLabel htmlFor='search-by'></InputLabel>
          <Select
            value={this.state.searchTarget}
            onChange={this.handleSearchTargetChange}
            inputProps={{
              id: 'search-by',
            }}
          >
            <MenuItem value={'bookTitle'}>{this.lang.bookTitle}</MenuItem>
            <MenuItem value={'author'}>{this.lang.author}</MenuItem>
          </Select>
        </FormControl>

        {divw10}

        <Button>{this.lang.search}</Button>
      </div>
    );

    let lists = this.getBooklists();

    return (
      <div>
        {/* search */}
        {search}

        {/* list */}
        <div className='online-list'>
          {lists}
        </div>
      </div>
    );
  }

// getBooklists
  getBooklists() {
    return [
      <OnlineListItem
        key='test1'
        author='花田一路'
        bookTitle='花甲男孩'
        intro='自從出了車禍之後，花田一路意外獲得了陰陽眼，生活也因此產生了巨大的變化：成為幫助好兄弟們達成遺願的人'
        latestChapter='第361章 助人亦利己'
        url='https://www.easeread.com/HuaJiaNanHai/index.html'
        inSerial={false}
      />,
      <OnlineListItem
        key='test2'
        author='Microsoft Studio'
        bookTitle='How to install Intel parallel compiler on your windows server'
        intro='This book will help solve the problems of installing intel MPI on your windows server to achieve better performance.'
        latestChapter='Chapter 13. Advance skills of solving scientific problem with parallel computing.'
        url='https://www.github.com/Microsoft/How_to_install_Intel_parallel_compiler_on_your_windows_server/index.html'
        inSerial={false}
      />,
      <OnlineListItem
        key='test3'
        author='毛利小五郎'
        bookTitle='名偵探的觀察日記'
        intro='因意外事件而身體變回想學生樣貌的偵探高中生工藤新，目前寄宿在名偵探毛利小五郎家中。以為自己隱藏的天衣無縫的工藤新一，其真實身份早在某次事件中暴露給毛利小五郎。，'
        latestChapter='987. 茶杯中的倒影'
        url='http://www03.eyny.com.tw/novels/charresses/4%23TW.html'
        inSerial={true}
      />,
    ];
  }

// getHTML
  getHTML(url) {
    var xhr = new XMLHttpRequest();

    // get html
    xhr.open('GET', url);
    xhr.responseType = 'document';
    xhr.send();
    console.log(xhr);
  }

/* handler */

// handleSearchTargetChange
  handleSearchTargetChange(event) {
    this.setState({searchTarget: event.target.value});
  }

// handleSearchEnterPress
  handleSearchEnterPress(event) {
    let keyCode = event.keyCode | event.which;
    if (keyCode === 13) {
      let searchPattern = document.getElementById('online-search').value;
      if (searchPattern === "") {
        console.log("There are no content in search bar!");
        return;
      } else {
        console.log("Search following keyword:\"", searchPattern, "\"");
      }
    }
  }

// handleSearchClearButton
  handleSearchClearButton() {
    let searchPattern = document.getElementById('online-search').value;
    if (searchPattern === "") {
      this.setState({searchClear: false});
    } else {
      this.setState({searchClear: true});
    }
  }

// handleSearchClearContent
  handleSearchClearContent() {
    let search = document.getElementById('online-search')
    search.value = '';
    search.focus();
    this.setState({searchClear: false});
  }
}

export default connect (state => ({
  langPack: state.main.langPack,
}))( withStyles(styles)(Online) );
