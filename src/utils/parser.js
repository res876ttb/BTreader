// parser.js

// packages
const iconv = require('iconv-lite');

// import database
var {database} = require('./database.js');

// constants
const b = 'body';
const c = 'children';

/** 
 * @function searchBook
 * @description 
 *   search book from server
 * 
 * @param keyword :string
 * @param callback :function     
 *  
 * @return  
 *   books: [
 *     {
 *       author,
 *       bookTitle,
 *       inSerial, 
 *       intro, 
 *       latestChapter,
 *       url, 
 *     }
 *   ]
 */
export function searchBook(keyword, callback) {
  for (let i in database.serverList) {
    console.log(database.serverList[i]);
    database[i].searchBook(keyword, ret => {
      let result = {};
      result[database.serverList[i]] = ret;
      callback(result);
    });
  }
}

/**
 * @function getRecommendList
 * @description 
 *  get recommend list by randomly selecting a server
 * @param callback :function
 * @callback @param list :object
 */
export function getRecommendList(lang, callback) {
  let server = database[Object.keys(database.serverList)[Math.floor(Math.random() * Object.keys(database.serverList).length)]];
  server.getRecommendList(ret => {
    let result = {};
    result[lang] = ret;
    callback(result);
  });
}

/**
 * @function getChapterList
 * @description
 *  Get chapter list from server. The server selected is depend on the url you give to this function.
 * 
 * @param url
 * @param callback
 * @callback @param list :array
 *  [{chapterTitle, url, false}, {...}, ...]
 */
export function getChapterList(url, callback) {
  if (url.match(/book100\.com/) !== null) {
    database['book100.com'].getChapters(url, callback);
  }
}

/** 
 * @function getChapters
 * @description 
 *   get chapters by url only
 * 
 * @return // this is parameter of callback function
 *   {
 *     chapter: [
 *       {
 *         title: chapter title, string
 *         local: if this chapter is stored in local storage, bool
 *         link: url to the origin website of current chapter, stirng
 *       }, {another chapter ...}
 *     ],
 *     intro: introduction of current book, string
 *   }
 */
export function getChapters(url, callback) {
  getHTML(url, htmlobj => {
    if (url.match(/book100\.com/) !== null) {
      getChaptersBook100_com(htmlobj, callback);
    }
  });
}

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
 * @function getChaptersBook100_com
 * @description
 *   get chapter list of website book100.com
 */
function getChaptersBook100_com(htmlobj, callback) {
  // following structure is parser for book100.com
  const _base = htmlobj[b][c][11][c][0][c][0][c][1];
  const intro = _base[c][1][c][0][c][0][c][1][c][0][c][0][c][0][c][0][c][0][c][0][c][0][c][1][c][0][c][0][c][2][c][0][c][0][c][0].innerText;
  const bookbase = _base[c][2][c][0][c][0][c][1][c][1][c][0];
  const addEpisodeName = bookbase[c].length > 6;
  let chapters = [];
  for (let i = 1; i < bookbase[c].length; i += 5) {
    let episodeTitle = bookbase[c][i + 2][c][0][c][0].innerText;
    let chapterListBase = bookbase[c][i + 4][c][0][c][0][c][0];
    for (let j = 0; j < chapterListBase[c].length; j += 1) {
      for (let k = 0; k < chapterListBase[c][j][c].length; k += 1) {
        let chapterComponent = chapterListBase[c][j][c][k][c][0];
        if (chapterComponent === undefined) continue;
        let link = chapterComponent['href'];
        let chapter = (addEpisodeName ? (episodeTitle + ' ') : '') + chapterComponent.innerText;
        chapters.push({
          title: chapter,
          local: false,
          link: link,
        });
      }
    }
  }
  callback({
    chapter: chapters, 
    intro: intro,
  });
}
