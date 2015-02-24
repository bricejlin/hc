/*

12. Q. Since, according to God's righteous judgment we deserve temporal and eternal punishment, how can we escape this punishment and be again received into favour?

A. God demands that His justice be satisfied.[1] Therefore full payment must be made either by ourselves or by another.[2]

[1] Ex. 20:5; 23:7; Rom. 2:1-11. [2] Is. 53:11; Rom. 8:3, 4.

*/


var fs = require('fs');

fs.readFile('hc', function (err, data) {
  if (err) { throw err; }

  var text = data.toString();
  var result = [];

  var lines = text.split('\n\n\n');

  for (var i = 0; i < lines.length; i++) {
    var partsArr = lines[i].split('\n');
    var schema = {};

    schema = parseParts(partsArr, i);

    // console.log(i);
    result.push(schema);
  }

  fs.writeFile('hcat.json', JSON.stringify(result), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
});

function parseParts (partsArr, index) {
  var obj = {};
  var partsCleaned = clean(partsArr);

  obj['id'] = index + 1;
  obj['question'] = partsCleaned[0].split(' ').slice(2).join(' ');
  obj['answer'] = partsCleaned[1].split(' ').slice(1).join(' ');
  obj['verses'] = partsCleaned[2];

  return obj;
}

function clean (parts) {
  var newArr = [];
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].length !== 0) {
      newArr.push(parts[i]);
    }
  }
  return newArr;
}
