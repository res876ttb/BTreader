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

export function processLocal(path, bookTitle, lang) {
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
    if (lang === 'tc') {
      return Traditionalized(content).split(/\r?\n/);
    } else if (lang === 'sc') {
      return Simplized(content).split(/\r?\n/);
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
    let indexFilePath = Path.resolve(appPath, bookTitle + '.json');
    if (fs.existsSync(addPath) === true) {
      fs.removeSync(addPath);
    }
    if (fs.existsSync(indexFilePath) === true) {
      fs.removeSync(indexFilePath);
    }
    fs.mkdirSync(addPath);
    jf.writeFileSync(indexFilePath, {chapter: chapterList, bookmark: []});
    for (var i in content) {
      fs.writeFileSync(Path.resolve(addPath, chapterList[i]), content[i]);
    }
    return {
      bookPath: indexFilePath, 
      totalChapter: chapterList.length
    };
  }).catch(err => {
    console.error(err);
  });
}

export function deleteBook(book) {
  var folderPath = Path.resolve(window.appPath, book.bookTitle);
  var indexFilePath = folderPath + '.json';
  if (fs.existsSync(folderPath))
    fs.removeSync(folderPath);
  if (fs.existsSync(indexFilePath))
    fs.removeSync(indexFilePath);
}

export function readIndex(book) {
  var folderPath = Path.resolve(window.appPath, book.bookTitle);
  var indexFilePath = folderPath + '.json';
  if (!fs.existsSync(folderPath) || !fs.existsSync(indexFilePath)) return null;
  return jf.readFileSync(indexFilePath);
}

export function readChapter(book, currentChapterOrder, index, offset) {
  var currentOrder = (currentChapterOrder === -1 ? 0 : currentChapterOrder) + offset;
  var totalChapter = book.totalChapter;
  if (currentOrder >= totalChapter || currentOrder < 0) return null;
  var p = Path.resolve(book.bookPath.split('.json')[0], index.chapter[currentOrder]);
  return String(fs.readFileSync(p));
}
