// fileUtilities.js

// import packages
const fs = require('fs-extra');
const jf = require('jsonfile');
const {ipcRenderer} = require('electron');
const jcd = require('jschardet');
const iconv = require('iconv-lite');
const Path = require('path');

// import function
const {
  Traditionalized, 
  Simplized
} = require('./chineseTranslator.js');
const {
  isEmptyLine, 
  processLine,
  isChapterLine,
  processChapterLine,
} = require('./wordProcess.js');

// functions
export function getCurPath() {
  let path = ipcRenderer.sendSync('synchronous-message', ['getDataPath']);
  window.appDataPath = path;
  let a = window.location.pathname;
  let b = a.split('/');
  let c = '';
  b.pop();
  for (let i in b) {
    c += b[i] + '/';
  }
  window.appPath = c;
  if (navigator.appVersion.indexOf("Win") !== -1) {
    console.log('original c:', c);
    window.appPath = c.slice(3,c.length);
  }
  console.log('Main: Program data path is', window.appDataPath);
  if (!fs.existsSync(window.appDataPath + '/data')) {
    console.log('Folder ' + window.appDataPath + ' does NOT exist!');
    fs.mkdirSync(window.appDataPath + '/data');
  }


  // debug:
  window.appPath = '/Users/Ricky/Desktop/test/';
}

export function newLocal() {
  let paths = ipcRenderer.sendSync('synchronous-message', ['openTXT']);
  console.log("Select local file:", paths);
  return paths;
}

export function processLocal(path, bookTitle, lang, readPrefLang) {
  console.log('Open local file:', path);
  var dataPath = window.appDataPath;
  return new Promise((resolve, reject) => {
    // get a part of file to get encoding
    var buffer = new Buffer(100);
    fs.open(path, 'r', (err, fd) => {
      if (err !== null) console.error(err);
      fs.read(fd, buffer, 0, buffer.length, 0, (err, byteRead, readResult) => {
        if (err !== null) console.error(err);
        if (readResult === null) console.log('Error! content of', path, 'is empty!');
        fs.closeSync(fd);
        resolve(readResult);
      });
    });
  }).then(content => {
    // get encoding
    let encoding = jcd.detect(content).encoding.toLowerCase();
    console.log('Detected encoding:', encoding);
    return encoding;

  }).then(encoding => {
    // read file content
    let content = fs.readFileSync(path);
    return [encoding, content];

  }).then(v => {
    // decoding file content
    let encoding = v[0];
    let content  = v[1];
    return iconv.decode(content, encoding);

  }).then(content => {
    // translating file content
    if (readPrefLang === 'auto') {
      if (lang === 'tc') {
        return Traditionalized(content).split(/\r?\n/);
      } else if (lang === 'sc') {
        return Simplized(content).split(/\r?\n/);
      } else {
        if (window.navigator.language === 'zh-TW' || window.navigator.language === 'zh-HK') {
          return Traditionalized(content).split(/\r?\n/);
        } else if (window.navigator.language === 'zh-CN') {
          return Simplized(content).split(/\r?\n/);
        } else {
          return content.split(/\r?\n/);
        }
      }
    } else if (readPrefLang === 'sc2tc') {
      return Traditionalized(content).split(/\r?\n/);
    } else if (readPrefLang === 'tc2sc') {
      return Simplized(content).split(/\r?\n/);
    } else {
      return content.split(/\r?\n/);
    }

  }).then(content => {
    // remove empty line and replace empty line head with 4 space. 
    // at the same time, detect the chapter line.
    let processed = {
      0: '',
    };
    let chapterList = ['0'];
    for (let l in content) {
      let line = content[l];
      if (isEmptyLine(line) === false) {
        let processedLine = processLine(line);
        if (isChapterLine(processedLine) !== false) {
          let chapterLine = processChapterLine(processedLine);
          chapterList.push(chapterLine);
          processed[chapterList.length - 1] = '';
        } else {
          processed[chapterList.length - 1] += processedLine + '\n';
        }
      }
    }
    return {processed, chapterList};
    
  }).then(v => {
    // save to disk
    let content = v.processed;
    let chapterList = v.chapterList;
    console.log(v);
    let addPath = Path.resolve(appPath, bookTitle);
    let indexFilePath = Path.resolve(appPath, bookTitle + '-index.json');
    let bookmarkFilePath = Path.resolve(appPath, bookTitle + '-bookmark.json');

    // if file already exist, remove it
    if (fs.existsSync(addPath) === true) {
      fs.removeSync(addPath);
    }
    if (fs.existsSync(indexFilePath) === true) {
      fs.removeSync(indexFilePath);
    }
    if (fs.existsSync(bookmarkFilePath) === true) {
      fs.removeSync(bookmarkFilePath);
    }

    // create folder 
    fs.mkdirSync(addPath);

    // write chapter and index into disk
    jf.writeFileSync(indexFilePath, {chapter: chapterList});
    jf.writeFileSync(bookmarkFilePath, {bookmark: []});

    // write content into the folder just created
    for (var i in content) {
      fs.writeFileSync(Path.resolve(addPath, chapterList[i]), content[i]);
    }

    return {
      bookPath: Path.resolve(appPath, bookTitle), 
      totalChapter: chapterList.length
    };
  }).catch(err => {
    console.error(err);
  });
}

export function deleteBook(book) {
  var folderPath = Path.resolve(window.appPath, book.bookTitle);
  var indexFilePath = folderPath + '-index.json';
  var bookmarkFilePath = folderPath + '-bookmark.json';
  if (fs.existsSync(folderPath))
    fs.removeSync(folderPath);
  if (fs.existsSync(indexFilePath))
    fs.removeSync(indexFilePath);
  if (fs.existsSync(bookmarkFilePath))
    fs.removeSync(bookmarkFilePath);
}

export function readIndex(book) {
  var folderPath = Path.resolve(window.appPath, book.bookTitle);
  var indexFilePath = folderPath + '-index.json';
  var bookmarkFilePath = folderPath + '-bookmark.json';
  if (!fs.existsSync(folderPath) || !fs.existsSync(indexFilePath) || !fs.existsSync(bookmarkFilePath)) return null;
  return {
    chapter: jf.readFileSync(indexFilePath).chapter,
    bookmark: jf.readFileSync(bookmarkFilePath).bookmark,
  };
}

export function readChapter(book, currentChapterOrder, index, offset) {
  var currentOrder = (currentChapterOrder === -1 ? 0 : currentChapterOrder) + offset;
  var totalChapter = book.totalChapter;
  if (currentOrder >= totalChapter || currentOrder < 0) return null;
  var p = Path.resolve(book.bookPath, index.chapter[currentOrder]);
  return String(fs.readFileSync(p));
}

export function objToFile(type, obj) {
  var path = Path.resolve(window.appPath, type);
  jf.writeFileSync(path, obj);
}

export function dataExists(folder, type) {
  var path = Path.resolve(folder, type + '.json');
  return fs.existsSync(path);
}

export function loadLocalData(type) {
  var path = Path.resolve(window.appPath, type);
  var data = jf.readFileSync(path);
  return data;
}

export function getImagePath() {
  return ipcRenderer.sendSync('synchronous-message', ['backgroundImage']);
}

export function makeBackgroundImage(path) {
  fs.copySync(path, Path.resolve(window.appPath, 'background.' + path.split('.').pop()));
}

export function retranslate(books, readPrefLang, lang, dispatch, update) {
  if (readPrefLang === 'auto') {
    if (lang === 'tc') {
      translateAll(books, 'tc', dispatch, update);
    } else if (lang === 'sc') {
      translateAll(books, 'sc', dispatch, update)
    } else {
      if (window.navigator.language === 'zh-TW' || window.navigator.language === 'zh-HK') {
        translateAll(books, 'tc', dispatch, update);
      } else if (window.navigator.language === 'zh-CN') {
        translateAll(books, 'sc', dispatch, update);
      } else {
        return;
      }
    }
  } else if (readPrefLang === 'sc2tc') {
    translateAll(books, 'tc', dispatch, update);
  } else if (readPrefLang === 'tc2sc') {
    translateAll(books, 'sc', dispatch, update);
  } else {
    return;
  }
}

function translateAll(books, option, dispatch, update) {
  var translate = option === 'tc' ? Traditionalized : Simplized;
  var newBooks = {...books};
  for (let path in books) {
    let folderPath = books[path].bookPath;
    let chaptersPath = folderPath + '-index.json';
    let bookmarkPath = folderPath + '-bookmark.json';
    let chapters = jf.readFileSync(chaptersPath).chapter;
    for (let chapterIndex in chapters) {
      let chapterPath = Path.resolve(folderPath, chapters[chapterIndex]);
      let newChapterPath = Path.resolve(folderPath, translate(chapters[chapterIndex]));
      let content = String(fs.readFileSync(chapterPath));
      fs.removeSync(chapterPath);
      fs.writeFileSync(newChapterPath, translate(content));
    }
    let chapterContent = String(fs.readFileSync(chaptersPath));
    let bookmarkContent = String(fs.readFileSync(bookmarkPath));
    fs.writeFileSync(chaptersPath, translate(chapterContent));
    fs.writeFileSync(bookmarkPath, translate(bookmarkContent));
    newBooks[path].author = translate(books[path].author);
    newBooks[path].bookTitle = translate(books[path].bookTitle);
    newBooks[path].currentChapter = translate(books[path].currentChapter);
  }
  dispatch(update(newBooks));
}