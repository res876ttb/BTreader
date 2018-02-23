// libraryState.js
//  Save imformation of user library.

// ============================================
// import
import {deleteBook} from '../utils/fileUtilities.js';

// ============================================
// functions
function save(obj) {
  console.log(obj);
  return obj;
}

function getCurrentTime() {
  var ct = new Date();
  return [
    ct.getFullYear(),
    ct.getMonth(),
    ct.getDate(),
    ct.getHours(),
    ct.getMinutes(),
    ct.getSeconds()
  ];
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
    //   fontSize -- if fontSize change, then use this data to
    //               recover reading progress
    //   -- If online:
    //   totalChapter: 
    //   currentChapter:
    //   currentChapterOrder:
    // }

    // following is am example
    '/Users/Ricky/Desktop/test/untitle.json': {
      addTime: [2018,2,14,9,8,7],
      author: 'unknown',
      bookPath: '/Users/Ricky/Desktop/test/untitle.json',
      bookTitle: 'untitle',
      currentChapter: -1,
      currentChapterOrder: -1,
      fontSize: 18,
      lastReadTime: [],
      scrollHeight: 0,
      scrollTop: 0,
      source: 'local',
      totalChapter: 4,
    },
    '/Users/Ricky/Desktop/test/快穿女主要上位.json': {
      addTime: [2017,1,1,0,0,0],
      author: "unknown",
      bookPath: "/Users/Ricky/Desktop/test/快穿女主要上位.json",
      bookTitle: "快穿女主要上位",
      currentChapter: "5.第5章 假千金的逆襲04",
      currentChapterOrder: 5,
      fontSize: 18,
      lastReadTime: [2018,2,16,18,18,18],
      scrollHeight: 0,
      scrollTop: 0,
      source: "local",
      totalChapter: 1210
    }
  }
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
          lastReadTime: [],
          scrollHeight: 0,
          scrollTop: 0,
          source: action.source,
          totalChapter: action.totalChapter,
        };
      }

      return save({
        books: books
      });
    case 'library deleteBooks':
      books = {...state.books};
      for (let p in action.bookPaths) {
        var b = books[action.bookPaths[p]];
        deleteBook(b);
        delete books[action.bookPaths[p]];
      }
      return save({
        books: books
      });
    case 'library updateBook':
      books = {...state.books};
      var t = books[action.bookPath];
      t.author = action.author;
      t.bookPath = action.bookPath;
      t.bookTitle = action.bookTitle;
      t.currentChapter = action.currentChapter;
      t.currentChapterOrder = action.currentChapterOrder;
      t.fontSize = action.fontSize;
      t.lastReadTime = action.lastReadTime;
      t.scrollHeight = action.scrollHeight;
      t.scrollTop = action.scrollTop;
      t.totalChapter = action.totalChapter;
      return save({
          books: books
      });
    default:
      return state;
  }
}

// ============================================
// action
export function addLocalBook(bookPath, bookTitle, fontSize, totalChapter) {
  // get book title
  // spacing and translating
  // analysing chapter
  return {
    type: 'library addBook',
    author: 'unknown',
    bookPath: bookPath,
    bookTitle: bookTitle,
    source: 'local',
    fontSize: fontSize,
    totalChapter: totalChapter,
  };
}

export function addOnlineBook(url, bookTitle, author, fontSize) {
  // get all url of all chapter and save it to a json file
  // analysing chapter
  return {
    type: 'library addBook',
    author: author,
    bookPath: bookPath,
    bookTitle: bookTitle,
    source: 'online',
    fontSize: fontSize,
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
