// settingState.js
//  Store setting data of BTreader.

// ============================================
// import

// ============================================
// functions
function save(obj) {
  // save obj
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
