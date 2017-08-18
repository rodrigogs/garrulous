const debug = require('debug')('garrulous:index');
const Iconv  = require('iconv').Iconv;
const fs = require('fs');
const path = require('path');

const createDir = (dir) => {
  if (fs.existsSync(dir)) return;
  fs.mkdirSync(dir);
};

module.exports = (options) => {
  const { inDirectory, outDirectory, fromEncode, toEncode } = options;

  const iconv = new Iconv(fromEncode, toEncode);

  debug('creating directory', outDirectory);
  createDir(outDirectory);

  debug('looking for files');
  const files = fs.readdirSync(inDirectory);
  files.forEach((file) => {
    debug('converting file', file);
    const buffer = fs.readFileSync(path.join(inDirectory, file), { encoding: fromEncode });
    const convertered = iconv.convert(buffer);
    debug('writing file', file);
    fs.writeFileSync(path.join(outDirectory, file), convertered, { encoding: 'binary' });
  });

  debug('done');
};
