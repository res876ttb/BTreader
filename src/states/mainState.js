// mainState.js
//  Maintain important global state which is not nevessary
//  to be saved.

// ============================================
// import
import {lang} from '../utils/lang.js';

// ============================================
// functions
function getDivWidth(w) {
  if (w < 768) {
    return 420;
  } else if (w < 992) {
    return 600;
  } else if (w < 1200) {
    return 840;
  } else {
    return 1020
  }
}

// ============================================
// constants
const initMainState = {
  windowWidth: 800,
  windowHeight: 600,
  navigator: '/',
  navDirection: 0,
  preNavigator: '',
  host: 'unknown',
  langPack: lang.tc,
  curBook: null,
  navTitle: null,
  navbarCover: 0,
  readingReload: false,
}

// ============================================
// reducer
export function main(state = initMainState, action) {
  var t;
  switch(action.type) {
    case 'main setHostType':
      return {
        ...state,
        host: action.hostType
      };
    case 'main changeWindowSize':
      return {
        ...state,
        windowWidth: action.w,
        windowHeight: action.h
      };
    case 'main setNavigator':
      t = {
        preNavigator: state.navigator,
        navDirection: state.navDirection === 1 ? 0 : 1
      };
      return {
        ...state,
        navigator: action.navigator,
        navDirection: t.navDirection,
        preNavigator: t.preNavigator
      };
    case 'main setLangPack':
      return {
        ...state,
        lang: action.langPack,
      };
    case 'main setCurBook':
      return {
        ...state,
        curBook: action.curBook,
      };
    case 'main setNavTitle':
      return {
        ...state,
        navTitle: action.navTitle,
      };
    case 'main setNavbarCover': 
      return {
        ...state,
        navbarCover: action.navbarCover
      };
    case 'main curBookCheckDelete':
      t = state.curBook;
      if (action.bookPaths.indexOf(t.bookPath) > -1) {
        t = null;
      }
      return {
        ...state,
        curBook: t,
      };
    case 'main setReadingReload':
      return {
        ...state,
        readingReload: action.readingReload,
      }
    default:
      return state;
  }
}

// ============================================
// action
export function setHostType() {
  var retVal = {
    type: 'main setHostType',
    hostType: 'Unknown'
  };

  if (navigator.appVersion.indexOf('Win') !== -1) {
    console.log('Host: Windows');
    retVal.hostType = 'Windows';
  } else if (navigator.appVersion.indexOf('Mac') !== -1) {
    console.log('Host: Macintosh');
    retVal.hostType = 'Macintosh';
  } else if (navigator.appVersion.indexOf('X11') !== -1) {
    console.log('Host: UNIX');
    retVal.hostType = 'UNIX';
  } else if (navigator.appVersion.indexOf('Linux') !== -1) {
    console.log('Host: Linux');
    retVal.hostType = 'Linux';
  } else {
    console.log('Host: Unknown');
  }
  
  return retVal;
}

export function changeWindowSize(_w, h) {
  let w = getDivWidth(_w);
  console.log('New windows size: (', w, h, ')')
  return {
    type: 'main changeWindowSize',
    w: w,
    h: h
  }
}

export function setNavigator(n) {
  console.log('Navigator change:', n);
  return {
    type: 'main setNavigator',
    navigator: n
  };
}

export function setLangPack(langSetting) {
  var retVal = {
    type: 'main setLangPack',
    langPack: lang.tc
  };
  
  if (langSetting === 'default') {
    if (window.navigator.language === 'zh-TW' || window.navigator.language === 'zh-HK') {
      retVal.langPack = lang.tc;
      console.log('Set program language to Traditional Chinese.');
    } else if (window.navigator.language === 'zh-CN') {
      retVal.langPack = lang.sc;
      console.log('Set program language to Simplified Chinese.');
    } else {
      retVal.langPack = lang.en;
      console.log('Set program language to English.');
    }
  } else if (langSetting === 'tc') {
    retVal.langPack = lang.tc;
    console.log('Set program language to Traditional Chinese.');
  } else if (langSetting === 'sc') {
    retVal.langPack = lang.sc;
    console.log('Set program language to Simplified Chinese.');
  } else if (langSetting === 'en') {
    retVal.langPack = lang.en;
    console.log('Set program language to English.');
  }

  return retVal;
}

export function setCurBook(curBook) {
  return {
    type: 'main setCurBook',
    curBook: curBook === null ? null : {
      addTime: curBook.addTime,
      author: curBook.author,
      bookPath: curBook.bookPath,
      bookTitle: curBook.bookTitle,
      currentChapter: curBook.currentChapter,
      currentChapterOrder: curBook.currentChapterOrder,
      fontSize: curBook.fontSize,
      lineHeight: curBook.lineHeight,
      lastReadTime: curBook.lastReadTime,
      scrollHeight: curBook.scrollHeight,
      scrollTop: curBook.scrollTop,
      source: curBook.source,
      totalChapter: curBook.totalChapter,
    },
  };
}

export function setNavTitle(title) {
  return {
    type: 'main setNavTitle',
    navTitle: title,
  };
}

export function setNavbarCover(navbarCover) {
  return {
    type: 'main setNavbarCover', 
    navbarCover: navbarCover,
  };
}

export function curBookCheckDelete(bookPaths) {
  return {
    type: 'main curBookCheckDelete',
    bookPaths: bookPaths,
  };
}

export function setReadingReload(v) {
  return {
    type: 'main setReadingReload',
    readingReload: v,
  };
}
