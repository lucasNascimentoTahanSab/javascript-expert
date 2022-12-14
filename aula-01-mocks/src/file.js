const { readFile } = require('fs/promises');
const { join } = require('path');
const User = require('./user')
const { error } = require('./constants');

const DEFAULT_OPTIONS = {
  maxLines: 3,
  fields: ["id", "name", "profession", "age"]
}

class File {
  static async csvToJson(filePath) {
    const content = await File.getFileContent(filePath);
    const validation = File.isValid(content);

    if (!validation.valid) throw new Error(validation.error);

    return File.parseCSVToJson(content);
  }

  static async getFileContent(filePath) {
    const fileName = join(__dirname, filePath);

    return (await readFile(fileName)).toString('utf-8');
  }

  static isValid(csvString, options = DEFAULT_OPTIONS) {
    const [header, ...fileWithoutHeader] = csvString.split(/\r?\n/);
    const isHeaderValid = header === options.fields.join(',');

    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false
      };
    }

    const isContentLengthAccepted = (
      fileWithoutHeader.length > 0 &&
      fileWithoutHeader.length <= options.maxLines
    );

    if (!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false
      };
    }

    return { valid: true };
  }

  static parseCSVToJson(csv) {
    const csvLines = csv.split(/\r?\n/);
    const csvHeader = csvLines.shift();
    const csvAttributes = csvHeader.split(',');
    const users = csvLines.map(csvLine => {
      const user = {};
      const csvValues = csvLine.split(',');

      csvValues.forEach((csvValue, index) => (user[csvAttributes[index]] = csvValue));

      return new User(user);
    });

    return JSON.stringify(users);
  }
}

module.exports = File;