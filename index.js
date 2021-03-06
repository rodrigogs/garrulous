const debug = require('debug')('garrulous:index');
const fs = require('fs');
const path = require('path');
const Iconv = require('iconv').Iconv;
const mkdirp = require('mkdirp');

let iconv;

const isDirectory = path => fs.statSync(path).isDirectory();

const createDir = (dir) => {
  if (fs.existsSync(dir)) return;
  mkdirp(dir);
};

const convert = (options) => {
  const { inDirectory, outDirectory, fromEncoding, toEncoding, recursive } = options;

  if (!iconv) iconv = new Iconv(fromEncoding, `${toEncoding}//TRANSLIT`);

  debug('creating directory', outDirectory);
  createDir(outDirectory);

  debug('looking for files');

  if (!isDirectory(inDirectory)) throw new Error('Input is not a directory');

  const files = fs.readdirSync(inDirectory);
  files.forEach((file) => {
    const filePath = path.join(inDirectory, file);

    if (isDirectory(filePath)) {
      debug('path', filePath, 'is a directory');
      if (recursive) {
        debug('converting', filePath, 'files recursively');
        const out = path.join(outDirectory, file);
        return convert({
          inDirectory: filePath,
          outDirectory: out,
          fromEncoding,
          toEncoding,
          recursive });
      }
      return;
    }

    debug('converting file', file);
    const buffer = fs.readFileSync(filePath, { encoding: 'binary' });
    const convertered = iconv.convert(buffer);
    debug('writing file', file);
    fs.writeFileSync(path.join(outDirectory, file), convertered, { encoding: 'binary' });
  });

  debug('finished directory', inDirectory);
};

module.exports = convert;
