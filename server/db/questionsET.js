const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');
const Transform = require('stream').Transform;

const csvStringifier = createCsvStringifier({
  header: [{
    id: 'id', title: 'id'
  }, {
    id: 'product_id', title: 'product_id'
  }, {
    id: 'body', title: 'body'
  }, {
    id: 'date_written', title: 'date_written'
  }, {
    id: 'asker_name', title: 'asker_name'
  }, {
    id: 'asker_email', title: 'asker_email'
  },{
    id: 'reported', title: 'reported'
  },{
    id: 'helpful', title: 'helpful'
  }]
});

let readStream = fs.createReadStream('server/data/questions.csv');
let writeStream = fs.createWriteStream('server/data/cleanQuestions.csv');

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
  let onlyIdNumbers = chunk.id.replace(/\D/g, '');
  let onlyProductIdNumbers = chunk.answer_id.replace(/\D/g, '');
  chunk.id = onlyIdNumbers;
  chunk.product_id = onlyProductIdNumbers;

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