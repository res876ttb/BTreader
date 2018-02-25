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
