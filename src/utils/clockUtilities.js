// clockUtilities.js

export function getCurrentTime() {
  var ct = new Date();
  return [
    ct.getFullYear(),
    ct.getMonth() + 1,
    ct.getDate(),
    ct.getHours(),
    ct.getMinutes(),
    ct.getSeconds()
  ];
}

export function compareTime(a, b) {
  for (let i = 0; i < 6; i++) {
    if (a[i] > b[i]) return true;
    if (a[i] < b[i]) return false;
  }
  return true;
}
