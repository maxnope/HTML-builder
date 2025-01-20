const fs = require('fs/promises');
const fspath = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'styles');
const destinationDir = path.join(__dirname, 'project-dist');
const destinationFile = path.join(destinationDir, 'bundle.css');

async function combineFilesFromDir(folderPath) {
  try {
    const dirents = await fs.readdir(folderPath, { withFileTypes: true });
    await fs.mkdir(destinationDir, { recursive: true });

    const writeStream = new fspath.createWriteStream(destinationFile);
    const styleFiles = [];

    for (const dirent of dirents) {
      if (dirent.isFile() && path.extname(dirent.name) === '.css') {
        const filePath = path.join(folderPath, dirent.name);
        const stream = new fspath.createReadStream(filePath, 'utf8');
        const file = new Promise((resolve, reject) => {
          stream.on('end', resolve);
          stream.on('error', reject);
        });
        stream.pipe(writeStream, { end: false });
        styleFiles.push(file);
      }
    }
    await Promise.all(styleFiles);

    writeStream.end();
    console.log('The bundle.css is generated!');
  } catch (err) {
    console.error(`Error reading directory "${folderPath}":`, err);
  }
}

combineFilesFromDir(folderPath);
