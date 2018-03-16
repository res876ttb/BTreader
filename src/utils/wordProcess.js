// wordProcess.js

const {
  Traditionalized, 
  Simplized
} = require('./chineseTranslator.js');

export function isEmptyLine(line) {
  for (var i in line) {
    if (line[i] !== ' ' && line[i] !== '\t' && line[i] !== '\r') {
      return false;
    }
  }
  return true;
}

export function processLine(line) {
  var result, i = 0;
  if (line[0] === ' ' || line[0] === '\t') {
    result = '    ';
  } else {
    return line;
  }
  while (line[i] === ' ' || line[i] === '\t') i++;
  for (; i < line.length; i++) result += line[i];
  return result;
}

export function isChapterLine(line) {
  var i = 0;
  while (line[i] === ' ' || line[i] === '\t') i++;
  var test = line.slice(i,i+12);
  return test.match(/^第?\s*[\d一二三四五六七八九十百千萬万兩两零]+\s*[章節]\s*\n?/) !== null ||
         test.match(/^\d*\./) !== null ||
         test.match(/^[Cc]hapter\.?\s*[\dIVX]{1,5}/) !== null;
}

export function processChapterLine(line) {
  var result = '', i = 0;
  while (line[i] === ' ' || line[i] === '\t') i++;
  for (; i < line.length; i++) result += line[i];
  return result;
}

export function translateCurBook(book, readPrefLang, lang) {
  if (readPrefLang === 'auto') {
    if (lang === 'tc') {
      return _translateCurBook(book, 'tc');
    } else if (lang === 'sc') {
      return _translateCurBook(boobookks, 'sc')
    } else {
      if (window.navigator.language === 'zh-TW' || window.navigator.language === 'zh-HK') {
        return _translateCurBook(book, 'tc');
      } else if (window.navigator.language === 'zh-CN') {
        return _translateCurBook(book, 'sc');
      } else {
        return book;
      }
    }
  } else if (readPrefLang === 'sc2tc') {
    return _translateCurBook(book, 'tc');
  } else if (readPrefLang === 'tc2sc') {
    return _translateCurBook(book, 'sc');
  } else {
    return book;
  }
}

function _translateCurBook(book, option) {
  var translate = option === 'tc' ? Traditionalized : Simplized;
  return {
    ...book,
    bookTitle:      translate(book.bookTitle),
    author:         translate(book.author),
    currentChapter: translate(book.currentChapter),
  }
}
