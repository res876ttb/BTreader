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
  lang: "tc", // 'tc' 'sc' 'en'
  color: "black",
  menuExpand: true,
  sortby: 'bookTitle', // 'bookTitle' 'addTime' 'lastReadTime'
  fontSize: 18,
  fontScale: 4,
  lineHeight: 1.5, // fontSize * lineHeight = actual line height
}

const fontSizeArr = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40];

// ============================================
// reducer
export function setting (state = initSettingState, action) {
  switch(action.type) {
    case 'setting setLang':
      return save({
        ...state,
        lang: action.lang
      });
    case 'setting setFontColor':
      return save({
        ...state,
        color: action.color
      });
    case 'setting setMenuExpand':
      return save ({
        ...state,
        menuExpand: action.menuExpand
      });
    case 'setting setFontSize':
      let scale = state.fontScale + action.deltaScale;
      if (scale > 13) {
        scale = 13;
      } else if (scale < 0) {
        scale = 0;
      }
      return save({
        ...state,
        fontSize: fontSizeArr[scale],
        fontScale: scale,
      });
    case 'setting setSortby':
      return save({
        ...state,
        sortby: action.sortby
      });
    case 'setting loadData':
      return save({
        ...action.setting,
      });
    case 'setting initData':
      return save({
        ...state,
      });
    case 'setting largerLineHeight':
      return save({
        ...state,
        lineHeight: state.lineHeight + 0.1 > 3 ? 3 : state.lineHeight + 0.1
      });
    case 'setting smallerLineHeight':
      return save({
        ...state,
        lineHeight: state.lineHeight - 0.1 < 1.1 ? 1.1 : state.lineHeight - 0.1
      });
    case 'setting defaultLineHeight':
      return save({
        ...state,
        lineHeight: 1.5
      });
    default:
      return state;
  }
}

// ============================================
// action
export function setLang(lang) {
  console.log('Set language to', lang);
  return {
    type: 'setting setLang',
    lang: lang,
  };
}

export function setFontColor(color) {
  console.log('Set font color to', color);
  return {
    type: 'setting setFontColor',
    color: color
  };
}

export function setMenuExpand(v) {
  console.log('Menu expand:', v);
  return {
    type: 'setting setMenuExpand',
    menuExpand: v
  };
}

export function setSortby(v) {
  console.log('Library sort by', v);
  return {
    type: 'setting setSortby',
    sortby: v
  };
}

export function setFontSize(deltaScale) {
  console.log('Delta font scale', deltaScale);
  return {
    type: 'setting setFontSize',
    deltaScale: deltaScale 
  };
}

export function largerLineHeight() {
  console.log('Larger line height');
  return {
    type: 'setting largerLineHeight'
  };
}

export function smallerLineHeight() {
  console.log('Smaller line height');
  return {
    type: 'setting smallerLineHeight'
  };
}

export function defaultLineHeight() {
  console.log('Reset line height');
  return {
    type: 'setting defaultLineHeight'
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
