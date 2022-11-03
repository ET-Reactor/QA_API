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

let readStream = fs.createReadStream('../../data/answers.csv');
let writeStream = fs.createWriteStream('../../data/cleanAnswers.csv');

class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
  }
}

_transform(chunk, encoding, next) {
  for (let key in chunk) {
    // trims whitespace
    let trimKey = key.trim();
    chunk[trimKey] = chunk[key];
    if (key !== trimKey) {
      delete chunk[key];
    }
  }

  // filters out all non-number characters
  let onlyNumbers = chunk.default_price.replace(/\D/g, '');
  chunk.default_price = onlyNumbers;

  // use our csvStringifier to turn our chunk into a csv string
  chunk = csvStringifier.stringifyRecords([chunk]);
  this.push(chunk);

  next();
}

const transformer = new CSVCleaner({ writableObjectMode: true });

//write header
writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('finished transforming products'); });