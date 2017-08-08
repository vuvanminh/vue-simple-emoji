var request = require('request');
var fs = require('fs');
let data = {};
let src = 'https://unpkg.com/emoji-datasource-apple@3.0.0/img/apple/sheets/64.png';
let size = 16;

let categories = {};

let css = fs.readFileSync('./src/container.css','utf8');

css += `.emoji {
  width: 20px;
  height: 20px;
  display: inline-block;
  contenteditable: false;
  background-size: 4900%;
  background-image: url('${src}');
  background-repeat: no-repeat;
  margin: -2px 2px 0 2px;
  padding-bottom: -5px;
  vertical-align: middle;
  text-indent: -9999px;
  border: 0;
}
.emoji.emoji16 {
  width: 16px;
  height: 16px;
}
.emoji.emoji24 {
  width: 24px;
  height: 24px;
}
`;

request.get('https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji_pretty.json', (error, resp, body) => {
  data = JSON.parse(body);
  let target = "grinning";

  for (let i in data) {
    let item = data[i];

    let x = Math.round(100000 / 48 * item.sheet_x) / 1000;
    let y = Math.round(100000 / 48 * item.sheet_y) / 1000;
    let pos = `${x}% ${y}%`;

    categories[item.category] = categories[item.category] ? categories[item.category] + 1 : 1;
    css += `.emoji.emoji-${item.short_name.toLowerCase()} { background-position: ${pos}; }\n`;
    css += `.emoji.emoji-${item.unified.toLowerCase()} { background-position: ${pos}; }\n`;
  }

  var path = process.cwd() + "/build/emoji.css";
  console.log(path);
  fs.writeFile(path, css, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  for (let i in data) {
    let item = data[i];
  }
  console.log(categories);
});
