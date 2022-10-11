const fs = require('fs');
const http = require('http');
const FormData = require('form-data');

const { getFileList, getServerAddress, getServerPort } = require('./helpers/clientHelpers');

const form = new FormData();
const server = getServerAddress();
const port = getServerPort();

getFileList()
  .then((files) => {
    // Add files to the form request
    files.forEach((filename) => {
      form.append('files', fs.createReadStream(filename));
    });
    // Build the HTTP request
    const request = http.request({
      method: 'post',
      host: server,
      port,
      path: '/upload',
      headers: form.getHeaders(),
    });

    form.pipe(request);
    request.on('response', (res) => {
      if (res.statusCode === 200) {
        console.log(`${res.statusCode} - Successfully sent files: ${files.join(',')}`);
      } else {
        console.error(`An error occurred: ${res.statusCode}`);
      }
    });
  });
