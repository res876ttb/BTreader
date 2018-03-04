// settingState.js
//  Store setting data of BTreader.

// ============================================
// import
import { objToFile, loadLocalData } from '../utils/fileUtilities.js';

// ============================================
// functions
function save(obj) {
  objToFile('setting.json', obj);
  return obj;
}

// ============================================
// constants
const initSettingState = {
  lang: "default", // 'tc' 'sc' 'en' 'default'
  color: "black",
  menuExpand: true,
  sortby: 'bookTitle', // 'bookTitle' 'addTime' 'lastReadTime'
  fontSize: 18,
  fontScale: 4,
  lineHeight: 1.5, // fontSize * lineHeight = actual line height
  autoLoad: false,
  backgroundColor: 'rgb(212,212,212)',
  backgroundPath: '',
  readingPreferLanguage: 'auto', // auto, sc2tc, tc2sc, none
}

const fontSizeArr = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];

// ============================================
// reducer
export function setting (state = initSettingState, action) {
  switch(action.type) {
    case 'setting setLang':
      console.log('Set program language to', action.lang);
      return save({
        ...state,
        lang: action.lang
      });
    case 'setting setFontColor':
      console.log('Set font color to', action.color);
      return save({
        ...state,
        color: action.color
      });
    case 'setting setMenuExpand':
      console.log('Set menu', action.menuExpand ? 'expand' : 'collapse');
      return save ({
        ...state,
        menuExpand: action.menuExpand
      });
    case 'setting setFontSize':
      console.log('Set font size to', action.fontSize);
      return save({
        ...state,
        fontSize: action.fontSize,
      });
    case 'setting setLineHeight':
      console.log('Set line height to', action.lineHeight);
      return save({
        ...state,
        lineHeight: action.lineHeight,
      });
    case 'setting setSortby':
      console.log('Set sorting order to', action.sortby);
      return save({
        ...state,
        sortby: action.sortby
      });
    case 'setting loadData':
      console.log('Load setting...');
      return save({
        ...action.setting,
      });
    case 'setting initData':
      console.log('No local setting! Load default setting...');
      return save({
        ...state,
      });
    case 'setting setAutoLoad':
      console.log('Set autoLoad to', action.autoLoad);
      return save({
        ...state,
        autoLoad: action.autoLoad,
      });
    case 'setting setBackgroundColor':
      console.log('Set background color to', action.backgroundColor);
      return save({
        ...state,
        backgroundColor: action.backgroundColor,
        backgroundPath: '',
      });
    case 'setting setBackgroundImage':
      console.log('Set background image');
      return save({
        ...state,
        backgroundColor: '',
        backgroundPath: action.backgroundPath,
      });
    case 'setting setReadingPreferLanguage':
      console.log('Set prefer language of reading to', action.readingPreferLanguage);
      return save({
        ...state,
        readingPreferLanguage: action.readingPreferLanguage,
      });
    default:
      return state;
  }
}

// ============================================
// action
export function setLang(lang) {
  return {
    type: 'setting setLang',
    lang: lang,
  };
}

export function setFontColor(color) {
  return {
    type: 'setting setFontColor',
    color: color
  };
}

export function setMenuExpand(v) {
  return {
    type: 'setting setMenuExpand',
    menuExpand: v
  };
}

export function setSortby(v) {
  return {
    type: 'setting setSortby',
    sortby: v
  };
}

export function setFontSize(fontSize) {
  return {
    type: 'setting setFontSize',
    fontSize: fontSize 
  };
}

export function setLineHeight(lineHeight) {
  return {
    type: 'setting setLineHeight',
    lineHeight: lineHeight,
  };
}

export function settingLoadData() {
  var setting = loadLocalData('setting.json');
  return {
    type: 'setting loadData',
    setting: setting,
  };
}

export function settingInitData() {
  return {
    type: 'setting initData',
  };
}

export function setAutoLoad(autoLoad) {
  return {
    type: 'setting setAutoLoad',
    autoLoad: autoLoad,
  };
}

export function setBackgroundColor(backgroundColor) {
  return {
    type: 'setting setBackgroundColor',
    backgroundColor: backgroundColor,
  };
}

export function setBackgroundImage(path) {
  return {
    type: 'setting setBackgroundImage',
    backgroundPath: path,
  };
}

export function setReadingPreferLanguage(v) {
  return {
    type: 'setting setReadingPreferLanguage',
    readingPreferLanguage: v,
  };
}
