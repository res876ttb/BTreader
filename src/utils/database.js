/**
 * @file database.js
 * @version 0.1
 * @description
 *  store a collection of parsers, which parse a variety of websites
 */

/**
 * @constant
 * @description
 *  Only for shorten parser structure.
 */
const b = 'body';
const c = 'children';

/** 
 * @function getHTML
 * @description 
 *   get HTML content by url only
 */
function getHTML(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    callback(xhr.responseXML);
  }

  // get html
  xhr.open('GET', url);
  xhr.responseType = 'document';
  xhr.send();
}

/**
 * @function checkDatabaseReturnListLength
 * @param listLength
 * 
 * @return boolean, true if listLength is equal to server list length.
 */
export function checkDatabaseReturnListLength(listLength) {
  if (listLength === Object.keys(database.serverList).length) {
    return true;
  } else {
    return false;
  }
}

/**
 * @var database
 * @description
 *  A collection of parsers. At the beginning, there are a array which stores the urls of supported websites.
 * 
 * @return object 
 *  format: {
 *    'url of server': {
 *      searchBook: function() {},
 *      getChapters: function() {},
 *      getIntro: function() {},
 *      getAuthor: function() {},
 *      getInSerial: function() {},
 *      getLatestChapter: function() {},
 *    },
 *    'url of another server': {
 *      ...
 *    } ...
 *  }
 */
export var database = {
  serverList: {
    'book100.com': "精品文學網"
  },
  'book100.com': {
    searchBook: function(keyword, callback) {
      var xhr = new XMLHttpRequest();
      var url = 'http://www.book100.com/data/search.aspx?key=' + escape(keyword);
      var ret = [];
      var papa = this;

      xhr.onload = function() {
        var resultbase = xhr.responseXML[c][0][c][1][c][6][c][2][c][0][c][0][c][1][c][0][c][0][c][1][c][1][c][1][c][0][c][0][c][0][c][0][c][0];
        let counter = 0;
        if (resultbase === undefined) { // there are no book which matches to the keyword
          console.log('There are no match book.');
          callback([]);
          return;
        }
        console.log(resultbase);
        for (let i = 0; i < resultbase[c].length; i += 2) {
          let bookUrl = resultbase[c][i][c][0][c][2].href;
          let bookTitle = resultbase[c][i][c][0][c][1].innerText;
          let author = 
          papa.getBookIndexPage(bookUrl, base => {
            let intro = papa.getIntro(base);
            let author = papa.getAuthor(base);
            let inSerial = papa.getInSerial(base);
            let latestChapter = papa.getLatestChapter(base);
            if (author === bookTitle) author = 'unknown';
            ret.push({
              author: author,
              bookTitle: bookTitle,
              inSerial: inSerial,
              intro: intro,
              latestChapter: latestChapter,
              url: bookUrl,
            });
            counter += 2;
            if (counter >= resultbase[c].length) {
              callback(ret);
            }
          });
        }
      }

      xhr.open('GET', url);
      xhr.responseType = 'document';
      xhr.send();
    },
    getChapters: function(url) {

    },
    getIntro: function(obj) {
      return obj[c][1][c][0][c][0][c][1][c][0][c][0][c][0][c][0][c][0][c][0][c][0][c][1][c][0][c][0][c][2][c][0][c][0][c][0].innerText;
    },
    getAuthor: function(obj) {
      return obj[c][1][c][0][c][0][c][1][c][0][c][0][c][0][c][0][c][0][c][0][c][0][c][1][c][0][c][0][c][1][c][0][c][0].innerText;
    },
    getInSerial: function(obj) {
      return obj[c][1][c][0][c][0][c][1][c][0][c][0][c][0][c][0][c][0][c][0][c][0][c][1][c][0][c][0][c][0][c][1].innerText.match(/\[全本\]/) !== null;
    },
    getLatestChapter: function(obj) {
      let bookbase = obj[c][2][c][0][c][0][c][1][c][1][c][0];
      let i = bookbase[c].length - 1;
      let chapterListBase = bookbase[c][i][c][0][c][0][c][0];
      for (let j = chapterListBase[c].length - 1; j >= 0; j--) {
        if (chapterListBase[c][j][c][0] !== undefined) {
          return chapterListBase[c][j][c][0].innerText;
        }
      }
      console.error('Database error: cannot fetch latest chapter!');
      return 'unknown';
    },
    getChapterContent: function() {

    },
    getBookIndexPage: function(url, callback) {
      getHTML(url, htmlobj => {
        let base = htmlobj[b][c][11][c][0][c][0][c][1];
        callback(base);
      })
    }
  }
};
