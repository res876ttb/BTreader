// libraryState.js
//  Save imformation of user library.

// ============================================
// import
import { deleteBook, objToFile, loadLocalData } from '../utils/fileUtilities.js';
import { getCurrentTime } from '../utils/clockUtilities.js';

// ============================================
// functions
function save(obj) {
  objToFile('library.json', obj);
  return obj;
}

// ============================================
// constants
const initLibraryState = {
  books: {
    // bookPath: {
    //   bookPath -- This is path for a json file for the book.
    //               The json file will store bookmarks of the book.
    //               The translated file path will be stored in this
    //               file, too.
    //   bookTitle
    //   author
    //   addTime
    //   lastReadTime
    //   source: 'local', 'online'
    //   scrollHeight
    //   scrollTop
    //   -- if fontSize and lineHeight are changed, use these data to
    //      recover reading progress
    //   fontSize 
    //   lineHeight
    //   -- If online:
    //   totalChapter: 
    //   currentChapter:
    //   currentChapterOrder:
    // }

    // following objects are examples
    // '/Users/Ricky/Desktop/test/untitle': {
    //   addTime: [2018,2,14,9,8,7],
    //   author: 'unknown',
    //   bookPath: '/Users/Ricky/Desktop/test/untitle',
    //   bookTitle: 'untitle',
    //   currentChapter: -1,
    //   currentChapterOrder: -1,
    //   fontSize: 18,
    //   lineHeight: 1.5,
    //   lastReadTime: [],
    //   scrollHeight: 0,
    //   scrollTop: 0,
    //   source: 'local',
    //   totalChapter: 4,
    // },
    // '/Users/Ricky/Desktop/test/快穿女主要上位': {
    //   addTime: [2017,1,1,0,0,0],
    //   author: "unknown",
    //   bookPath: "/Users/Ricky/Desktop/test/快穿女主要上位",
    //   bookTitle: "快穿女主要上位",
    //   currentChapter: "5.第5章 假千金的逆襲04",
    //   currentChapterOrder: 5,
    //   fontSize: 18,
    //   lineHeight: 1.5,
    //   lastReadTime: [2018,2,16,18,18,18],
    //   scrollHeight: 0,
    //   scrollTop: 0,
    //   source: "local",
    //   totalChapter: 1210
    // }
  },
  recentReading: '',
}

// ============================================
// reducer
export function library(state = initLibraryState, action) {
  var books;
  switch (action.type) {
    case 'library addBook':
      books = {...state.books};

      if (!books.hasOwnProperty(action.bookPath)) {
        books[action.bookPath] = {
          addTime: getCurrentTime(),
          author: action.author,
          bookPath: action.bookPath,
          bookTitle: action.bookTitle,
          currentChapter: -1,
          currentChapterOrder: -1,
          fontSize: action.fontSize,
          lineHeight: action.lineHeight,
          lastReadTime: [],
          scrollHeight: 0,
          scrollTop: 0,
          source: action.source,
          totalChapter: action.totalChapter,
        };
      }

      return save({
        ...state,
        books: books,
      });
    case 'library deleteBooks':
      books = {...state.books};
      for (let p in action.bookPaths) {
        let b = books[action.bookPaths[p]];
        deleteBook(b);
        delete books[action.bookPaths[p]];
      }
      return save({
        ...state,
        books: books,
        recentReading: books[state.recentReading] !== undefined ? state.recentReading : '',
      });
    case 'library updateBook':
      books = {...state.books};
      var t = books[action.book.bookPath];
      t.author = action.book.author;
      t.bookTitle = action.book.bookTitle;
      t.currentChapter = action.book.currentChapter;
      t.currentChapterOrder = action.book.currentChapterOrder;
      t.fontSize = action.book.fontSize;
      t.lineHeight = action.book.lineHeight;
      t.lastReadTime = action.book.lastReadTime;
      t.scrollHeight = action.book.scrollHeight;
      t.scrollTop = action.book.scrollTop;
      t.totalChapter = action.book.totalChapter;
      return save({
        ...state,
        books: books,
      });
    case 'library setRecentReading':
      return save({
        ...state,
        recentReading: action.recentReading
      });
    case 'library loadData':
      return save({
        ...action.library,
      });
    case 'library initData':
      return save({
        ...state,
      });
    case 'library updateAllBooks':
      return save({
        ...state,
        books: action.books,
      });
    default:
      return state;
  }
}

// ============================================
// action
export function addLocalBook(bookPath, bookTitle, fontSize, lineHeight, totalChapter) {
  return {
    type: 'library addBook',
    author: 'unknown',
    bookPath: bookPath,
    bookTitle: bookTitle,
    source: 'local',
    fontSize: fontSize,
    lineHeight: lineHeight,
    totalChapter: totalChapter,
  };
}

export function addOnlineBook(url, bookTitle, author, fontSize, lineHeight) {
  // get all url of all chapter and save it to a json file
  // analysing chapter
  return {
    type: 'library addBook',
    author: author,
    bookPath: bookPath,
    bookTitle: bookTitle,
    source: 'online',
    fontSize: fontSize,
    lineHeight: lineHeight,
    totalChapter: totalChapter,
  };
}

export function updateBook(book) {
  return {
    type: 'library updateBook',
    book: book, 
  };
} 

export function deleteBooks(bookPaths) {
  return {
    type: 'library deleteBooks',
    bookPaths: bookPaths,
  };
}

export function setRecentReading(bookPath) {
  return {
    type: 'library setRecentReading',
    recentReading: bookPath,
  };
}

export function libraryLoadData() {
  var library = loadLocalData('library.json');
  return {
    type: 'library loadData',
    library: library,
  };
}

export function libraryInitData() {
  return {
    type: 'library initData',
  };
}

export function updateAllBooks(books) {
  return {
    type: 'library updateAllBooks',
    books: books,
  }
}
