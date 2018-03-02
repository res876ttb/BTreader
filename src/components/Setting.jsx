// Setting.jsx

// ============================================
// React packages
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Switch from 'material-ui/Switch';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import Dialog, { DialogTitle, DialogActions } from 'material-ui/Dialog';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { SketchPicker } from 'react-color';
import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';

// ============================================
// import react components

// ============================================
// import react redux-action
import {
  setAutoLoad, 
  setFontSize,
  setFontColor,
  setLineHeight,
  setBackgroundColor,
  setBackgroundImage,
} from '../states/settingState.js';

// ============================================
// import apis
import {
  getImagePath,
  makeBackgroundImage,
} from '../utils/fileUtilities.js';

// ============================================
// import css file
import '../styles/Setting.css';

// ============================================
// constant
const _default   = 'rgb(212,212,212)';
const _white     = 'rgb(235,235,235)';
const _blue      = '#90CAF9';
const _skin      = 'rgb(238,221,190)';
const _darkgray  = 'rgb(168,168,168)';
const _ddgray    = 'rgb(100,100,100)';
const _black     = 'black';
const _green     = 'rgb(173,240,188)';
const _darkgreen = 'rgb(20,83,36)';
const _darkblue  = 'rgb(47,63,94)';
const _light     = '#000000';
const _dark      = '#FFFFFF';
const _brown     = 'rgb(97,46,17)';
const _twhite    = '#FFFFFF';
const _gray1     = '#DDDDDD';
const _gray2     = '#BBBBBB';
const _gray3     = '#999999';
const _gray4     = '#777777';
const _gray5     = '#555555';
const _ranbow    = 'linear-gradient(to right top, \
                 rgb(255, 95, 95), rgb(255, 95, 95), \
                 rgb(243, 161, 106), rgb(243, 218, 106), \
                 rgb(136, 204, 130), rgb(72, 142, 235), \
                 rgb(78, 97, 204))';

const styles     = theme => ({
// color setting for background color
  colorButtonBC: {
    boxShadow:   'none',
    border:      '1px solid rgba(0,0,0,0.25)',
    marginRight: '20px',
  },
  // color button for background color: default color
  colorButtonBCDefault:  {background: _default  , '&:hover': {background: _default  }},
  colorButtonBCWhite:    {background: _white    , '&:hover': {background: _white    }},
  colorButtonBCBlue:     {background: _blue     , '&:hover': {background: _blue     }},
  colorButtonBCSkin:     {background: _skin     , '&:hover': {background: _skin     }},
  colorButtonBCDarkgray: {background: _darkgray , '&:hover': {background: _darkgray }},
  colorButtonBCBlack:    {background: _black    , '&:hover': {background: _black    }},
  colorButtonBCGreen:    {background: _green    , '&:hover': {background: _green    }},
  colorButtonBCDarkgreen:{background: _darkgreen, '&:hover': {background: _darkgreen}},
  colorButtonBCDarkblue: {background: _darkblue , '&:hover': {background: _darkblue }},
  colorButtonBCBrown:    {background: _brown    , '&:hover': {background: _brown    }},
  colorButtonBCDdgray:   {background: _ddgray   , '&:hover': {background: _ddgray   }},
  colorButtonBCCustom:   {background: _ranbow   , '&:hover': {background: _ranbow   }},

// color setting for font color
  colorButtonFC: {
    boxShadow:   'none',
    border:      '1px solid rgba(0,0,0,0.25)',
    marginRight: '20px',
  },
  colorButtonFCTwhite: {background: _twhite, '&:hover': {background: _twhite}},
  colorButtonFCBlack:  {background: _black , '&:hover': {background: _black }},
  colorButtonFCGray1:  {background: _gray1 , '&:hover': {background: _gray1 }},
  colorButtonFCGray2:  {background: _gray2 , '&:hover': {background: _gray2 }},
  colorButtonFCGray3:  {background: _gray3 , '&:hover': {background: _gray3 }},
  colorButtonFCGray4:  {background: _gray4 , '&:hover': {background: _gray4 }},
  colorButtonFCGray5:  {background: _gray5 , '&:hover': {background: _gray5 }},
  colorButtonFCCustom: {background: _ranbow, '&:hover': {background: _ranbow}},
});

// ============================================
// react components
class Setting extends React.Component {
  static propTypes = {
    dispatch:        PropTypes.func,
    langPack:        PropTypes.object,
    autoLoad:        PropTypes.bool,
    fontSize:        PropTypes.number,
    fontColor:       PropTypes.string,
    lineHeight:      PropTypes.number,
    lang:            PropTypes.string,
    backgroundColor: PropTypes.string,
    backgroundPath:  PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.lang = this.props.langPack.Setting;

    this.handleSetFontSize    = this.handleSetFontSize.bind(this);
    this.handleAutoLoadSwitch = this.handleAutoLoadSwitch.bind(this);
    this.handleSetLineHeight  = this.handleSetLineHeight.bind(this);

  // handlers for background setting
    this.handleSetBCDefault   = this.handleSetBCDefault.bind(this);
    this.handleSetBCWhite     = this.handleSetBCWhite.bind(this);
    this.handleSetBCBlue      = this.handleSetBCBlue.bind(this);
    this.handleSetBCSkin      = this.handleSetBCSkin.bind(this);
    this.handleSetBCDarkgray  = this.handleSetBCDarkgray.bind(this);
    this.handleSetBCBlack     = this.handleSetBCBlack.bind(this);
    this.handleSetBCGreen     = this.handleSetBCGreen.bind(this);
    this.handleSetBCDarkgreen = this.handleSetBCDarkgreen.bind(this);
    this.handleSetBCDarkblue  = this.handleSetBCDarkblue.bind(this);
    this.handleSetBCBrown     = this.handleSetBCBrown.bind(this);
    this.handleSetBCDdgray    = this.handleSetBCDdgray.bind(this);
    
    this.handleClickBCCustom  = this.handleClickBCCustom.bind(this);
    this.handleColorChange        = this.handleColorChange.bind(this);
    this.handleCancleBCCustom     = this.handleCancleBCCustom.bind(this);
    this.handleConfirmBCCustom    = this.handleConfirmBCCustom.bind(this);
    this.handleGetBackgroundImage = this.handleGetBackgroundImage.bind(this);

  // handlers for font color setting
    this.handleSetFCTwhite     = this.handleSetFCTwhite.bind(this);
    this.handleSetFCGray1      = this.handleSetFCGray1.bind(this);
    this.handleSetFCGray2      = this.handleSetFCGray2.bind(this);
    this.handleSetFCGray3      = this.handleSetFCGray3.bind(this);
    this.handleSetFCGray4      = this.handleSetFCGray4.bind(this);
    this.handleSetFCGray5      = this.handleSetFCGray5.bind(this);
    this.handleSetFCBlack      = this.handleSetFCBlack.bind(this);
    this.handleFontColorChange = this.handleFontColorChange.bind(this);

    this.handleClickFCCustom   = this.handleClickFCCustom.bind(this);
    this.handleFontColorChange = this.handleFontColorChange.bind(this);
    this.handleCancleFCCustom  = this.handleCancleFCCustom.bind(this);
    this.handleConfirmFCCustom = this.handleConfirmFCCustom.bind(this);
  // state
    this.state = {
      customBCOpen: false,
      customFCOpen: false,
      backgroundColor: '#00000',
      fontColor: '#000000'
    };
  }

  componentWillMount() {
    this.setState({backgroundColor: this.props.backgroundColor});
    this.setState({fontColor: this.props.fontColor});
  }

  componentDidUpdate() {
    if (this.props.backgroundColor !== document.getElementById('root').style.backgroundColor) {
      document.getElementById('root').style.backgroundImage = 'none';
      document.getElementById('root').style.backgroundColor = this.props.backgroundColor;
    } 
    if (this.props.backgroundPath !== '' && this.props.backgroundPath !== document.getElementById('root').style.backgroundPath) {
      document.getElementById('root').style.backgroundImage = `url(\'${this.props.backgroundPath}\')`;
    }
  }

  render() {
  // Div space, h1, h30, and w20
    var h1  = (<div style={{height:  '1px', width: '100%'}}></div>);
    var h30 = (<div style={{height: '30px', width: '100%'}}></div>);
    var w20 = (<div style={{height:  '1px', width: '20px', display: 'inline-block'}}></div>);

  // Component of background setting
    var bcbdefault   = this.getBCB(this.handleSetBCDefault,   _default,   this.props.classes.colorButtonBCDefault,   _light);
    var bcbwhite     = this.getBCB(this.handleSetBCWhite,     _white,     this.props.classes.colorButtonBCWhite,     _light);
    var bcblightblue = this.getBCB(this.handleSetBCBlue,      _blue,      this.props.classes.colorButtonBCBlue,      _light);
    var bcbdarkgray  = this.getBCB(this.handleSetBCDarkgray,  _darkgray,  this.props.classes.colorButtonBCDarkgray,  _dark );
    var bcbskin      = this.getBCB(this.handleSetBCSkin,      _skin,      this.props.classes.colorButtonBCSkin,      _light);
    var bcbblack     = this.getBCB(this.handleSetBCBlack,     _black,     this.props.classes.colorButtonBCBlack,     _dark );
    var bcbgreen     = this.getBCB(this.handleSetBCGreen,     _green,     this.props.classes.colorButtonBCGreen,     _light);
    var bcbdarkgreen = this.getBCB(this.handleSetBCDarkgreen, _darkgreen, this.props.classes.colorButtonBCDarkgreen, _dark );
    var bcbdarkblue  = this.getBCB(this.handleSetBCDarkblue,  _darkblue,  this.props.classes.colorButtonBCDarkblue,  _dark );
    var bcbbrown     = this.getBCB(this.handleSetBCBrown,     _brown,     this.props.classes.colorButtonBCBrown,     _dark );
    var bcbddgray    = this.getBCB(this.handleSetBCDdgray,    _ddgray,    this.props.classes.colorButtonBCDdgray,    _dark );
    var bcbcustom    = (
      <Tooltip title={this.lang.bcbcustom}>
        <Button mini 
          className={this.props.classes.colorButtonBCCustom + ' nofocus ' + this.props.classes.colorButtonBC} 
          variant="fab" onClick={this.handleClickBCCustom}
        >
          <i className={'fas fa-paint-brush'}></i>
        </Button>
      </Tooltip>
    );
    var bcbcustomdialog = (
      <Dialog onClose={this.handleCancleBCCustom} open={this.state.customBCOpen}>
        <DialogTitle>{this.lang.bctitle}</DialogTitle>
        <div style={{display: 'flex', justifyContent: 'center', marginLeft: '10px', marginRight: '10px'}}>
          <SketchPicker disableAlpha={true} onChangeComplete={this.handleColorChange} color={this.state.backgroundColor}/>
        </div>
        <DialogActions>
          <Button onClick={this.handleCancleBCCustom}>
            {this.lang.cancel}
          </Button>
          <Button onClick={this.handleConfirmBCCustom}>
            {this.lang.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    );
    var bcbimage = (
      <Tooltip title={this.lang.localImage}>
        <Button variant='fab' mini 
          className={'nofocus ' + this.props.classes.colorButtonBC}
          onClick={this.handleGetBackgroundImage}
        >
          <i className='far fa-image'></i>
        </Button>
      </Tooltip>
    );

  // Component of font color setting
    var fcbTwhite = this.getFCB(this.handleSetFCTwhite, _twhite, this.props.classes.colorButtonFCTwhite, _light);
    var fcbBlack  = this.getFCB(this.handleSetFCBlack,  _black,  this.props.classes.colorButtonFCBlack,  _dark );
    var fcbGray1  = this.getFCB(this.handleSetFCGray1,  _gray1,  this.props.classes.colorButtonFCGray1,  _light);
    var fcbGray2  = this.getFCB(this.handleSetFCGray2,  _gray2,  this.props.classes.colorButtonFCGray2,  _light);
    var fcbGray3  = this.getFCB(this.handleSetFCGray3,  _gray3,  this.props.classes.colorButtonFCGray3,  _dark );
    var fcbGray4  = this.getFCB(this.handleSetFCGray4,  _gray4,  this.props.classes.colorButtonFCGray4,  _dark );
    var fcbGray5  = this.getFCB(this.handleSetFCGray5,  _gray5,  this.props.classes.colorButtonFCGray5,  _dark );
    var fcbcustom = (
      <Tooltip title={this.lang.fcbcustom}>
        <Button mini 
          className={this.props.classes.colorButtonFCCustom + ' nofocus ' + this.props.classes.colorButtonFC} 
          variant="fab" onClick={this.handleClickFCCustom}
        >
          <i className={'fas fa-paint-brush'}></i>
        </Button>
      </Tooltip>
    );
    var fcbcustomdialog = (
      <Dialog onClose={this.handleCancleFCCustom} open={this.state.customFCOpen}>
        <DialogTitle>{this.lang.fctitle}</DialogTitle>
        <div style={{display: 'flex', justifyContent: 'center', marginLeft: '10px', marginRight: '10px'}}>
          <SketchPicker disableAlpha={true} onChangeComplete={this.handleFontColorChange} color={this.state.fontColor}/>
        </div>
        <DialogActions>
          <Button onClick={this.handleCancleFCCustom}>
            {this.lang.cancel}
          </Button>
          <Button onClick={this.handleConfirmFCCustom}>
            {this.lang.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    );
  
  // Settomg of if auto navigate to reading
    var autoLoad = (
      <div className='setting-line has-shadow'>
        <div className='setting-switch' style={{width: '120px'}}>
          <Switch
            checked={this.props.autoLoad}
            onChange={this.handleAutoLoadSwitch}
            color='primary'
          />
        </div>
        <div className='setting-inline-text'>
          {this.lang.autoLoad}
        </div>
      </div>
    );
  
  // Setting of font size
    var fontSize = (
      /* adjust font size */
      <div className='setting-block has-shadow'>
        <div className='setting-inline-text' style={{width: '120px', paddingLeft: '14px', flex: 'none'}}>
          {this.lang.fontSize}
        </div>
        <div className='setting-inline-block'>
          <form>
            <FormControl style={{maxHeight: '300px'}}>
              {/* <InputLabel htmlFor="font size">Font Size</InputLabel> */}
              <Select
                value={this.props.fontSize}
                onChange={this.handleSetFontSize}
              >
                <MenuItem value={10}>10px</MenuItem>
                <MenuItem value={12}>12px</MenuItem>
                <MenuItem value={14}>14px</MenuItem>
                <MenuItem value={16}>16px</MenuItem>
                <MenuItem value={18}>18px -- {this.lang.default}</MenuItem>
                <MenuItem value={20}>20px</MenuItem>
                <MenuItem value={22}>22px</MenuItem>
                <MenuItem value={24}>24px</MenuItem>
                <MenuItem value={26}>26px</MenuItem>
                <MenuItem value={28}>28px</MenuItem>
                <MenuItem value={30}>30px</MenuItem>
                <MenuItem value={32}>32px</MenuItem>
                <MenuItem value={36}>36px</MenuItem>
                <MenuItem value={40}>40px</MenuItem>
              </Select>
            </FormControl>
          </form>
        </div>
      </div>
    );

  // Setting of line height
    var lineHeight = (
      <div className='setting-block has-shadow'>
        <div className='setting-inline-text' style={{width: '120px', paddingLeft: '14px', flex: 'none'}}>
          {this.lang.lineHeight}
        </div>
        <div className='setting-inline-block'>
          <form>
            <FormControl style={{maxHeight: '300px'}}>
              {/* <InputLabel htmlFor="font size">Font Size</InputLabel> */}
              <Select
                value={this.props.lineHeight}
                onChange={this.handleSetLineHeight}
              >
                <MenuItem value={1.1}>{this.lang.verySmall}</MenuItem>
                <MenuItem value={1.3}>{this.lang.small}</MenuItem>
                <MenuItem value={1.5}>{this.lang.default}</MenuItem>
                <MenuItem value={2.0}>{this.lang.large}</MenuItem>
                <MenuItem value={2.5}>{this.lang.veryLarge}</MenuItem>
                <MenuItem value={3.0}>{this.lang.superLarge}</MenuItem>
              </Select>
            </FormControl>
          </form>
        </div>
      </div>
    );

  // Setting of program language
    var programLanguage = (
      // adjust line height
      <div className='setting-block has-shadow'>
        <div className='setting-inline-text' style={{width: '120px', paddingLeft: '14px', flex: 'none'}}>
          {this.lang.language}
        </div>
        <div className='setting-inline-block'>
          <form>
            <FormControl style={{maxHeight: '300px'}}>
              {/* <InputLabel htmlFor="font size">Font Size</InputLabel> */}
              <Select
                value={this.props.lang}
                onChange={this.handleSetLanguage}
              >
                <MenuItem value={'default'}>{this.lang.systemDefault}</MenuItem>
                <MenuItem value={'en'}>{this.lang.english}</MenuItem>
                <MenuItem value={'tc'}>{this.lang.tchinese}</MenuItem>
                <MenuItem value={'sc'}>{this.lang.schinese}</MenuItem>
              </Select>
            </FormControl>
          </form>
        </div>
      </div>
    );

  // Setting of background
    var backgroundColor = (
      <div className='setting-block has-shadow' style={{padding: '0px'}}>
        <div className='setting-inline-text' style={{width: '120px', paddingLeft: '14px', flex: 'none'}}>
          {this.lang.backgroundColor}
        </div>
        <div className='setting-inline-block' style={{lineHeight: '60px'}}>
          {bcblightblue}
          {bcbgreen}
          {bcbskin}
          {bcbwhite}
          {bcbdefault}
          {bcbdarkgray}
          {bcbddgray}
          {bcbblack}
          {bcbdarkblue}
          {bcbdarkgreen}
          {bcbbrown}
          {bcbcustom}
          {bcbcustomdialog}
          {bcbimage}
        </div>
      </div>
    );

  // Setting of font color
    var fontColor = (
      <div className='setting-block has-shadow' style={{padding: '0px'}}>
        <div className='setting-inline-text' style={{width: '120px', paddingLeft: '14px', flex: 'none'}}>
          {this.lang.fontColor}
        </div>
        <div className='setting-inline-block' style={{lineHeight: '60px'}}>
          {fcbTwhite}
          {fcbGray1}
          {fcbGray2}
          {fcbGray3}
          {fcbGray4}
          {fcbGray5}
          {fcbBlack}
          {fcbcustom}
          {fcbcustomdialog}
        </div>
      </div>
    );
  // Preview of reading setting
    var preview = (
      <div className='setting-block has-shadow'>
        <div className='setting-inline-text' style={{width: '120px', paddingLeft: '14px', flex: 'none'}}>
          {this.lang.preview}
        </div>
        <div className='setting-inline-block' style={{
          fontSize: this.props.fontSize,
          color: this.props.fontColor,
          lineHeight: this.props.lineHeight,
          borderRadius: '2px',
          background: `url(\'${this.props.backgroundPath}\')`,
          backgroundColor: this.props.backgroundColor,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          whiteSpace: 'pre-wrap',
          padding: '10px 20px',
          margin: '10px 20px 10px 0px',
          transitionDuration: '200ms',
        }}>
          {this.lang.previewContent}
        </div>
      </div>
    );

    // return render content
    return (
      <div className='setting-out container'>
        <div className='setting-main'>
          {autoLoad}
          {h30}
          {programLanguage}
          {h30}
          {fontSize}
          {h1}
          {lineHeight}
          {h1}
          {backgroundColor}
          {h1}
          {fontColor}
          {h30}
          {preview}
          {h30}
        </div>
      </div>
    );
  }

// get backgorund color setting button
  // Detail: [handler: click handler], [color: button color], [bc: button class], [fill: dark or light theme when button is selected]
  getBCB(handler, color, bc, fill) {
    return (
      <Button mini 
        className={bc + ' nofocus ' + this.props.classes.colorButtonBC} 
        variant="fab" onClick={handler}
      >
        <svg 
          className={'animation02 ' + (this.props.backgroundColor === color ? 'visible' : 'invisible')} 
          fill={fill} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </Button>
    )
  }

// get font color setting button
  // Detail: [handler: click handler],[color: button color],[bc: button class],[fill: dark or light theme when button is selected]
  getFCB(handler, color, bc, fill) {
    return (
      <Button mini
        className={bc + ' nofocus ' + this.props.classes.colorButtonFC}
        variant="fab" onClick={handler}
      >
        <svg 
          className={'animation02 ' + (this.props.fontColor === color ? 'visible' : 'invisible')} 
          fill={fill} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </Button>
    );
  }

// handleSetFontSize
  handleSetFontSize(event) {
    this.props.dispatch(setFontSize(event.target.value));
  }

// handleSetLineHeight 
  handleSetLineHeight(event) {
    this.props.dispatch(setLineHeight(event.target.value));
  }

// handleSetLanguage
  handleSetLanguage(event) {
    console.log(event.target.value);
  }

// handleAutoLoadSwitch
  handleAutoLoadSwitch() {
    if (this.props.autoLoad === true) {
      this.props.dispatch(setAutoLoad(false));
    } else {
      this.props.dispatch(setAutoLoad(true));
    }
  }

// handlers for setup background color
  handleSetBCDefault() {
    this.setBackgroundColor(_default);
  }
  handleSetBCWhite() {
    this.setBackgroundColor(_white);
  }
  handleSetBCBlue() {
    this.setBackgroundColor(_blue);
  }
  handleSetBCSkin() {
    this.setBackgroundColor(_skin);
  }
  handleSetBCDarkgray() {
    this.setBackgroundColor(_darkgray);
  }
  handleSetBCBlack() {
    this.setBackgroundColor(_black);
  }
  handleSetBCGreen() {
    this.setBackgroundColor(_green);
  }
  handleSetBCDarkgreen() {
    this.setBackgroundColor(_darkgreen);
  }
  handleSetBCDarkblue() {
    this.setBackgroundColor(_darkblue);
  }
  handleSetBCBrown() {
    this.setBackgroundColor(_brown);
  }
  handleSetBCDdgray() {
    this.setBackgroundColor(_ddgray);
  }
  setBackgroundColor(color) {
    this.props.dispatch(setBackgroundColor(color));
    this.setState({backgroundColor: color});
  }

// handlers for set font color
  setFontColor(color) {
    this.props.dispatch(setFontColor(color));
    this.setState({fontColor: color});   
  }
  handleSetFCTwhite() {
    this.setFontColor(_twhite);
  }
  handleSetFCGray1() {
    this.setFontColor(_gray1);
  }
  handleSetFCGray2() {
    this.setFontColor(_gray2);
  }
  handleSetFCGray3() {
    this.setFontColor(_gray3);
  }
  handleSetFCGray4() {
    this.setFontColor(_gray4);
  }
  handleSetFCGray5() {
    this.setFontColor(_gray5);
  }
  handleSetFCBlack() {
    this.setFontColor(_black);
  }

// handleClickBCCustom
  handleClickBCCustom() {
    console.log(this.state.customBCOpen);
    if (this.state.customBCOpen === true) {
      this.setState({customBCOpen: false});
    } else {
      this.setState({customBCOpen: true});
    }
  }

// handleClickFCCustom
  handleClickFCCustom() {
    if (this.state.customFCOpen === true) {
      this.setState({customFCOpen: false});
    } else {
      this.setState({customFCOpen: true});
    }
  }  

// handleColorChange
  handleColorChange(color) {
    this.setState({backgroundColor: color.hex});
  }

// handleFontColorChange
  handleFontColorChange(color) {
    this.setState({fontColor: color.hex});
  }

// handleCancleBCCustom 
  handleCancleBCCustom() {
    this.setState({customBCOpen: false});
  }

// handleCancleFCCustom 
  handleCancleFCCustom() {
    this.setState({customFCOpen: false});
  }

// handleConfirmBCCustom
  handleConfirmBCCustom() {
    this.props.dispatch(setBackgroundColor(this.state.backgroundColor));
    this.setState({customBCOpen: false});
  }

// handleConfirmFCCustom
  handleConfirmFCCustom() {
    this.props.dispatch(setFontColor(this.state.fontColor));
    this.setState({customFCOpen: false});
  }

// handle get background image
  handleGetBackgroundImage() {
    setTimeout(() => {
      let path = getImagePath();
      if (path === '') return;
      makeBackgroundImage(path);
      this.props.dispatch(setBackgroundImage(path));
    }, 200);
  }
}

export default connect (state => ({
  langPack:        state.main.langPack,
  fontSize:        state.setting.fontSize,
  autoLoad:        state.setting.autoLoad,
  lineHeight:      state.setting.lineHeight,
  lang:            state.setting.lang,
  backgroundColor: state.setting.backgroundColor,
  backgroundPath:  state.setting.backgroundPath,
  fontColor:       state.setting.color,
}))(
  withStyles(styles)(Setting)
);
