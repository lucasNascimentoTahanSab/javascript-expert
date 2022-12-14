const { error } = require('./src/constants');
const File = require('./src/file');
const { rejects, deepStrictEqual } = require('assert');

(async () => {
  {
    const filePath = './../mocks/emptyFile.csv';
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);

    // Compare received promise error to instantiated Error
    await rejects(result, rejection);
  }
  {
    const filePath = './../mocks/fourItems.csv';
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);

    await rejects(result, rejection);
  }
  {
    const filePath = './../mocks/invalidHeader.csv';
    const rejection = new Error(error.FILE_FIELDS_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);

    await rejects(result, rejection);
  }
  {
    const filePath = './../mocks/validFile.csv';
    const result = await File.csvToJson(filePath);
    const expected = JSON.stringify([
      {
        "name": "Erick Wendel",
        "id": 123,
        "profession": "Javascript Instructor",
        "birthday": 1997
      },
      {
        "name": "Xuxa da Silva",
        "id": 321,
        "profession": "Javascript Specialist",
        "birthday": 1942
      },
      {
        "name": "Joaozinho",
        "id": 231,
        "profession": "Java Developer",
        "birthday": 1992
      }
    ]);

    deepStrictEqual(result, expected);
  }
})();