const fs = require('fs/promises');
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

async function copyDir(sourceDir, destinationDir) {
  try {
    const dirFiles = await fs.readdir(sourceDir, { withFileTypes: true });
    await fs.rm(destinationDir, { recursive: true, force: true }); // Force to avoid errors if destinationDir doesn't exist
    await fs.mkdir(destinationDir, { recursive: true });

    for (const file of dirFiles) {
      if (file.isFile()) {
        const sourcePath = path.join(sourceDir, file.name);
        const destinationPath = path.join(destinationDir, file.name);
        await fs.copyFile(sourcePath, destinationPath);
      }
    }
    console.log('Folder copied succsessfuly');
  } catch (err) {
    console.error('Error copying folder:', err);
  }
}

copyDir(sourceDir, destinationDir);
