module.exports = parseProfile;

var parser = require('xml2js').parseString;
var cheerio = require('cheerio');

function parseProfile(html) {
  html = html.replace(/\r?\n\r?/g, '');
  var match = html.match(/<table.+<\/table>/),
    tableHtml = match && match[0];
  if (! tableHtml) {
    throw new Error();
  }
  var $ = cheerio.load(tableHtml);
  var $table = $(tableHtml),
   $trs = $table.find('tr');
  return {
    code: $trs.eq(0).find('td').eq(1).text(),
    name: $trs.eq(0).find('td').eq(3).text(),
    avatar: $trs.eq(0).find('td').eq(6).find('img').attr('src'),
    politics: $trs.eq(2).find('td').eq(3).text(),
    sex: $trs.eq(1).find('td').eq(1).text(),
    birth: $trs.eq(1).find('td').eq(3).text(),
    nation: $trs.eq(1).find('td').eq(5).text(),
    major: $trs.eq(3).find('td').eq(1).text(),
    class: $trs.eq(3).find('td').eq(3).text(),
    college: $trs.eq(4).find('td').eq(1).text(),
    entrance: $trs.eq(5).find('td').eq(3).text(),
    dormitory: $trs.eq(8).find('td').eq(5).text()
  }
};
