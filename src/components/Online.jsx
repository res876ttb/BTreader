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
import { CircularProgress } from 'material-ui/Progress';

// ============================================
// import react components
import OnlineListItem from './OnlineListItem.jsx';

// ============================================
// import react redux-action

// ============================================
// import apis
import {
  getChapters,
  searchBook,
  getRecommendList,
} from '../utils/parser.js';
import { 
  getLongRandomString,
} from '../utils/wordProcess';
import {
  checkDatabaseReturnListLength,
} from '../utils/database.js';

// ============================================
// import css file
import '../styles/Online.css';

// ============================================
// constants
const divw10 = (<div style={{width: '10px', display: 'inline-block'}}></div>);
const divh10 = (<div style={{height: '10px'}}></div>);
const divh45 = (<div style={{height: '45px'}}></div>);
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
    navigator: PropTypes.string,
    menuExpand: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.lang = this.props.langPack.Online;

    this.handleSearchTargetChange = this.handleSearchTargetChange.bind(this);
    this.handleSearchEnterPress = this.handleSearchEnterPress.bind(this);
    this.handleSearchClearButton = this.handleSearchClearButton.bind(this);
    this.handleSearchClearContent = this.handleSearchClearContent.bind(this);
    this.handleSearchButtonPress = this.handleSearchButtonPress.bind(this);
    this.handleSearchReturnValue = this.handleSearchReturnValue.bind(this);

    this.state = {
      searchTarget: "bookTitle",
      searchClear: false,
      recommendList: [],
      searchList: [],
      listIdList: [],
      inSearch: false, // default is false, true is for debugging
      searchBookDone: true, // if false, then show a progress circle. It is true by default.
      loadRecommendBookDone: false, // if false, then show a progress circle. jIt is false by default.
    };
  }

  componentWillMount() {
    this.getRecommendList();
  }

  render() {
    let search = this.getSearchBar();
    let controlButtons = this.getControlButtons();

    return (
      <div>
        {/* search */}
        {search}

        {/* list */}
        {this.state.inSearch ? this.state.searchList : this.state.recommendList}
        {this.state.searchBookDone === false || this.state.loadRecommendBookDone === false ?
          <div style={{textAlign: 'center'}}><CircularProgress /></div> :
          <div></div>
        }
        {this.props.menuExpand ? divh45 : <div></div> }

        {/* control buttons */}
        {controlButtons}
      </div>
    );
  }

// getControlButtons
  getControlButtons() {
    return (
      <div className='online-controlbuttons'>
        <Button className='nofocus' variant="fab" color="primary" style={{fontSize: '24px', position: 'absolute', right: '40px', bottom: '40px'}} onClick={() => {let k = document.getElementsByClassName('canvas-center')[0];this.scrollToTop(k);
        }}>
          {/* icon from fontawesome */}
          <svg aria-hidden="true" data-prefix="fas" data-icon="arrow-alt-to-top" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="svg-inline--fa fa-arrow-alt-to-top fa-w-12"><path fill="currentColor" d="M24 32h336c13.3 0 24 10.7 24 24v24c0 13.3-10.7 24-24 24H24C10.7 104 0 93.3 0 80V56c0-13.3 10.7-24 24-24zm232 424V320h87.7c17.8 0 26.7-21.5 14.1-34.1L205.7 133.7c-7.5-7.5-19.8-7.5-27.3 0L26.1 285.9C13.5 298.5 22.5 320 40.3 320H128v136c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24z"></path></svg>
        </Button>
        <Button className='nofocus' mini variant='fab' color='primary' style={{fontSize: '18px', position: 'absolute', right: '48px', bottom: '108px'}} onClick={() => {this.handleExpandAllList();}}>
          <i className='fas fa-angle-double-down'></i>
        </Button>
        <Button className='nofocus' mini variant='fab' color='primary' style={{fontSize: '18px', position: 'absolute', right: '48px', bottom: '160px'}} onClick={() => {this.handleCollapseAllList();}}>
          <i className='fas fa-angle-double-up'></i>
        </Button>
        <Button className='nofocus' mini variant='fab' color='primary' style={{fontSize: '18px', position: 'absolute', right: '48px', bottom: '212px'}} disabled={this.state.inSearch ? false : true} onClick={() => {this.handleGetRecommendList();}}>
          <i className="fas fa-undo-alt"></i>
        </Button>
      </div>
    );
  }

// scrollToTop
  scrollToTop(ele) {
    if (ele.scrollTop == 0) {
      return;
    } else if (ele.scrollTop < 3) {
      ele.scrollTop = 0;
      setTimeout(() => {
        this.scrollToTop(ele);
      }, 16);
    } else {
      ele.scrollTop *= 0.8;
      setTimeout(() => {
        this.scrollToTop(ele);
      }, 16);
    }
  }

// getSearchBar
  getSearchBar() {
    return (
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

        <Button className='nofocus' onClick={this.handleSearchButtonPress}>{this.lang.search}</Button>
      </div>
    );
  }

// getBooklists
  getRecommendList() {
    getRecommendList(this.lang.recommendList, list => {
      let {result, listid, iconid} = this.getList(list);
      this.setState({recommendList: result, listIdList: [{listid: listid, iconid: iconid}], loadRecommendBookDone: true});
      console.log(listid, iconid);
    });
  }

  getList(obj) {
    const searchList = obj;
    let result = [];
    let listid = getLongRandomString();
    let iconid = getLongRandomString();
    for (let server in searchList) {
      let list = this.getListItems(searchList[server]);
      result.push(
        <div key={listid}>
          <div 
            className='online-serverbar has-shadow'
            onClick={() => {
              let listout = document.getElementById(listid);
              let icon = document.getElementById(iconid);
              if (listout.style.height === '0px') {
                listout.style.height = listout.scrollHeight.toString() + 'px';
                icon.className = "online-serverbar-icon";
              } else {
                listout.style.height = '0px';
                icon.className = "online-serverbar-icon online-serverbar-icon-down";
              }
            }}
          >
            {server}
            <div style={{width: '15px', display: 'inline-block'}}></div>
            <div id={iconid} className='online-serverbar-icon'>
              <i className="fas fa-chevron-up" style={{fontSize: '16px', lineHeight: '50px'}}></i>
            </div>
          </div>
          <div id={listid} className='online-list'>
            {list}
          </div>
        </div>
      );
    }
    return {result, listid, iconid};
  }

  getListItems(obj) {
    let result = [];
    if (obj.length === 0) {
      return [
        <div key={getLongRandomString()} style={{textAlign: 'center'}}>
          {this.lang.noResult}
        </div>
      ];
    }
    for (let i in obj) {
      let book = obj[i];
      result.push((
        <OnlineListItem
          key={getLongRandomString()}
          author={book.author}
          bookTitle={book.bookTitle}
          intro={book.intro}
          latestChapter={book.latestChapter}
          url={book.url}
          inSerial={book.inSerial}
        />
      ));
    }
    return result;
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
        this.setState({searchBookDone: false, inSearch: true, recommendList: [], searchList: [], listIdList: []});
        searchBook(searchPattern, list => {
          this.handleSearchReturnValue(list);
        });
      }
    }
  }
// handleSearchButtonPress 
  handleSearchButtonPress() {
    let searchPattern = document.getElementById('online-search').value;
    if (searchPattern === "") {
      console.log("There are no content in search bar!");
      return;
    }
    this.setState({searchBookDone: false, inSearch: true, recommendList: [], searchList: [], listIdList: []});
    searchBook(searchPattern, list => {
      this.handleSearchReturnValue(list)
    })
  }

// handleSearchReturnValue
  handleSearchReturnValue(list) {
    let searchList = this.state.searchList.slice();
    let listIdList = this.state.listIdList.slice();
    let {result, listid, iconid} = this.getList(list);
    searchList.push(result);
    listIdList.push({listid: listid, iconid: iconid});
    this.setState({searchList: searchList, listIdList: listIdList});
    setTimeout(() => {
      if (checkDatabaseReturnListLength(searchList.length)) {
        this.setState({searchBookDone: true});
      }
    }, 1);
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

  handleGetRecommendList() {
    this.setState({
      inSearch: false,
      searchList: [],
      loadRecommendBookDone: false,
    });
    setTimeout(() => {
      this.getRecommendList();
    }, 1000);
  }

  handleCollapseAllList() {
    const {listIdList} = this.state;
    for (let i in listIdList) {
      let id = listIdList[i];
      let list = document.getElementById(id.listid);
      let icon = document.getElementById(id.iconid);
      list.style.height = '0px';
      icon.className = "online-serverbar-icon online-serverbar-icon-down";
    }
  }

  handleExpandAllList() {
    const {listIdList} = this.state;
    for (let i in listIdList) {
      let id = listIdList[i];
      let list = document.getElementById(id.listid);
      let icon = document.getElementById(id.iconid);
      list.style.height = list.scrollHeight.toString() + 'px';
      icon.className = "online-serverbar-icon";
    }
  }
}

export default connect (state => ({
  langPack:   state.main.langPack,
  navigator:  state.main.navigator,
  menuExpand: state.setting.menuExpand,
}))( withStyles(styles)(Online) );
