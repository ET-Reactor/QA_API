const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');
const Transform = require('stream').Transform;

const csvStringifier = createCsvStringifier({
  header: [{
    id: 'id', title: 'id'
  }, {
    id: 'question_id', title: 'question_id'
  }, {
    id: 'body', title: 'body'
  }, {
    id: 'date_written', title: 'date_written'
  }, {
    id: 'answerer_name', title: 'answerer_name'
  }, {
    id: 'answerer_email', title: 'answerer_email'
  },{
    id: 'reported', title: 'reported'
  },{
    id: 'helpful', title: 'helpful'
  }]
});

let readStream = fs.createReadStream('server/data/answers.csv');
let writeStream = fs.createWriteStream('server/data/cleanAnswers.csv');

class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, next) {
    let valueLengths = [];

    for (let key in chunk) {
      // trims whitespace
      let trimKey = key.trim();
      chunk[trimKey] = chunk[key];
      if (key !== trimKey) {
        delete chunk[key];
      }
      valueLengths.push(chunk[trimKey].length)
    }

    // filters out all non-number characters
    let onlyIdNumbers = chunk.id.replace(/\D/g, '');
    let onlyQuestionIdNumbers = chunk.question_id.replace(/\D/g, '');
    let onlyDateNumbers = chunk.date_written.replace(/\D/g, '');
    let onlyReportedNumbers = chunk.reported.replace(/\D/g, '');
    let onlyHelpfulNumbers = chunk.helpful.replace(/\D/g, '');
    chunk.id = onlyIdNumbers;
    chunk.question_id = onlyQuestionIdNumbers;
    chunk.date_written = onlyDateNumbers;
    chunk.reported = onlyReportedNumbers;
    chunk.helpful = onlyHelpfulNumbers;

    // use our csvStringifier to turn our chunk into a csv string

    chunk = csvStringifier.stringifyRecords([chunk]);

    // where should quotes be inserted?
    let quoteInsertIndex = [];

    quoteInsertIndex.push(2 + valueLengths[0] + valueLengths[1]);
    quoteInsertIndex.push(2 + valueLengths[0] + valueLengths[1] + valueLengths[2]);
    quoteInsertIndex.push(4 + valueLengths[0] + valueLengths[1] + valueLengths[2] + valueLengths[3]);
    quoteInsertIndex.push(4 + valueLengths[0] + valueLengths[1] + valueLengths[2] + valueLengths[3] + valueLengths[4]);
    quoteInsertIndex.push(5 + valueLengths[0] + valueLengths[1] + valueLengths[2] + valueLengths[3] + valueLengths[4]);
    quoteInsertIndex.push(5 + valueLengths[0] + valueLengths[1] + valueLengths[2] + valueLengths[3] + valueLengths[4] + valueLengths[5]);

    let stringified = JSON.stringify(chunk);
    let split = stringified.split('');

    for (let i = 0; i < split.length; i++) {
      if (split[i] === '\\') {
        split.splice(i, 2)
      }
    }
    let joined = JSON.parse(split.join(''))
    // joined is cleaned version of chunk

    let text = joined.slice(0, quoteInsertIndex[0]) + '"' + joined.slice(quoteInsertIndex[0], quoteInsertIndex[1]) + '"' + joined.slice(quoteInsertIndex[1], quoteInsertIndex[2]) + '"' + joined.slice(quoteInsertIndex[2], quoteInsertIndex[3]) + '"' + joined.slice(quoteInsertIndex[3], quoteInsertIndex[4]) + '"' + joined.slice(quoteInsertIndex[4], quoteInsertIndex[5]) + '"' + joined.slice(quoteInsertIndex[5]) + `\n`

    this.push(text);

    next();
  }
}

const transformer = new CSVCleaner({ writableObjectMode: true });

//write header
writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('finished transforming products'); });