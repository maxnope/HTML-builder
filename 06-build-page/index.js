const fs = require('fs/promises');
const fspath = require('fs');
const path = require('path');

const componentsSourceDir = path.join(__dirname, 'components');
const stylesSourceDir = path.join(__dirname, 'styles');
const assetsSourceDir = path.join(__dirname, 'assets');
const templateFile = path.join(__dirname, 'template.html');

const destinationDir = path.join(__dirname, 'project-dist');
const assetsDestinationDir = path.join(destinationDir, 'assets');
const indexDestinationFile = path.join(destinationDir, 'index.html');

async function buildHtml() {
  try {
    await fs.mkdir(destinationDir, { recursive: true });
    await replaceTemplateTags();
    await combineStyles(stylesSourceDir, destinationDir, 'style.css');
    await copyAssets(assetsSourceDir, assetsDestinationDir);
  } catch (err) {
    console.error('Error building HTML', err);
  }
}

async function combineStyles(folderFrom, folderWhere, filename) {
  const destinationFile = path.join(folderWhere, filename);
  try {
    const dirents = await fs.readdir(folderFrom, { withFileTypes: true });
    const writeStream = new fspath.createWriteStream(destinationFile);
    const styleFiles = [];

    for (const dirent of dirents) {
      if (dirent.isFile() && path.extname(dirent.name) === '.css') {
        const filePath = path.join(folderFrom, dirent.name);
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
    console.log('The style.css is generated in project-dist folder!');
  } catch (err) {
    console.error('Error when combining CSS files', err);
  }
}

async function copyAssets(sourceDir, destinationDir) {
  await fs.rm(destinationDir, { recursive: true, force: true });
  await fs.mkdir(destinationDir, { recursive: true });
  try {
    const dirFiles = await fs.readdir(sourceDir, { withFileTypes: true });
    for (const file of dirFiles) {
      const sourcePath = path.join(sourceDir, file.name);
      const destinationPath = path.join(destinationDir, file.name);
      if (file.isFile()) {
        await fs.copyFile(sourcePath, destinationPath);
      } else if (file.isDirectory()) {
        await copyAssets(sourcePath, destinationPath);
      }
    }
    console.log('Assets succsessfuly copied to project-dist folder!');
  } catch (err) {
    console.error('Error copying folder:', err);
  }
}

async function replaceTemplateTags() {
  try {
    let template = await fs.readFile(templateFile, 'utf8');

    const tagRegex = /\{\{(\w+)\}\}/g;
    const tags = template.match(tagRegex);

    if (tags) {
      for (const tag of tags) {
        const componentName = tag.slice(2, -2);
        const componentFilePath = path.join(
          componentsSourceDir,
          `${componentName}.html`,
        );

        const componentContent = await fs.readFile(componentFilePath, 'utf8');

        template = template.replace(tag, componentContent);
      }
    }

    // Write the updated HTML to the output file
    await fs.writeFile(indexDestinationFile, template, 'utf8');

    console.log('The index.html is generated in project-dist folder!');
  } catch (err) {
    console.error('Error replacing template tags:', err);
  }
}

buildHtml();
