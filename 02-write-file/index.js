const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readline = require('readline');

const writeStream = new fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = () => {
  rl.question('Enter message (or type "exit" to quit): ', (answer) => {
    if (answer.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
      writeStream.end();
      return;
    }
    const promt = `${answer}\n`;
    writeStream.write(promt, (err) => {
      if (err) {
        console.error('Can`t write to the file' + filePath + ':', err);
        return;
      }
      askQuestion(); // Ask the question again
    });
  });
};

askQuestion();
