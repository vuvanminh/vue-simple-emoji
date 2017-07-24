var request = require('request');
var fs = require('fs');
let data = {};
let src = 'https://unpkg.com/emoji-datasource-apple@3.0.0/img/apple/sheets/64.png';
let size = 16;

let categories = {};

let css = fs.readFileSync('./src/container.css','utf8');

css += `.emoji {
  width: ${size}px;
  height: ${size}px;
  display: inline-block;
  contenteditable: false;
  background-size: 4900%;
  background-image: url('${src}');
  background-repeat: no-repeat;
  margin: 0px 2px;
  padding-bottom: -5px;
  vertical-align: baseline;
  text-indent: -9999px;
  border: 0;
}
`;

request.get('https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji_pretty.json', (error, resp, body) => {


  data = JSON.parse(body);
  let target = "grinning";
  console.log('<pre>');

  for (let i in data) {
    let item = data[i];

    // if (item.short_name != target) continue;

    // console.log(item);


    let x = Math.round(100000 / 48 * item.sheet_x) / 1000;
    let y = Math.round(100000 / 48 * item.sheet_y) / 1000;
    let pos = `${x}% ${y}%`;
    // console.log(item);
    // break;

    categories[item.category] = categories[item.category] ? categories[item.category] + 1 : 1;

    css += `.emoji.emoji-${item.short_name} { background-position: ${pos}; }\n`;

    css += `.emoji.emoji-${item.unified} { background-position: ${pos}; }\n`;
  }

  var path = process.cwd() + "/build/emoji.css";
  console.log(path);
  fs.writeFile(path, css, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
// console.log('<style>' + css + '</style>');
  for (let i in data) {
    let item = data[i];


    // console.log(`<span class="emoji emoji-${item.short_name}"></span> ${item.short_name}`);
  }

  console.log(categories)


});
