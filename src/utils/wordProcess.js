// wordProcess.js

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
  return test.match(/^第?\s*[\d一二三四五六七八九十百千萬万兩两零]+\s*[章節]/) !== null ||
         test.match(/^\d*\./) !== null ||
         test.match(/^[Cc]hapter\.?\s*[\dIVX]{1,5}/) !== null;
}

export function processChapterLine(line) {
  var result = '', i = 0;
  while (line[i] === ' ' || line[i] === '\t') i++;
  for (; i < line.length; i++) result += line[i];
  return result;
}