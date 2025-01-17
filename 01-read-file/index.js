const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(filePath, 'utf8');

stream.on('readable', function () {
  const data = stream.read();
  if (data !== null) console.log(data);
});

stream.on('error', (err) => {
  console.error('An error occurred:', err);
});
