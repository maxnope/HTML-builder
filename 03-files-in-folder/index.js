const fs = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

async function listFilesFromDir(folderPath) {
  try {
    const dirents = await fs.readdir(folderPath, { withFileTypes: true });

    console.log(`Contents of directory "${folderPath}":`);

    for (const dirent of dirents) {
      if (dirent.isFile()) {
        const fileName = path.basename(dirent.name, path.extname(dirent.name));
        const stats = await fs.stat(path.join(folderPath, dirent.name));
        const fileSize = (stats.size / 1024).toFixed(2);
        const fileExt = path.extname(dirent.name).replace(/[\s.]/g, '');
        console.log(`${fileName} - ${fileExt} - ${fileSize}Kb`);
      }
    }
  } catch (err) {
    console.error(`Error reading directory "${folderPath}":`, err);
  }
}

listFilesFromDir(folderPath);
