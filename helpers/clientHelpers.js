const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    server: 's',
    port: 'p',
  },
});

const defaultServerAddress = '159.223.111.28';
const defaultPort = 3000;

const validateFile = (filepath) => (
  // eslint-disable-next-line no-unused-vars
  new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.R_OK, (error) => {
      if (error) {
        console.error(`File could not be read: ${filepath}`);
        process.exit(9);
      }
      resolve(filepath);
    });
  })
);

const getFileList = async () => {
  const fileList = argv._;
  if (fileList.length < 1) {
    console.log('No files found to send');
    process.exit(0);
  }
  // Check if files exist
  return Promise.all(fileList.map((file) => validateFile(file)))
    .then((results) => results);
};

const getServerAddress = () => {
  const serverAddress = argv.s || defaultServerAddress;
  // Check if the command line arguments have a server address and that it is valid
  if (argv.hasOwnProperty('s') && !(typeof fileDir === 'string')) {
    console.log('Invalid server argument');
    process.exit(9);
  }

  return serverAddress;
};

/**
 * Read CLI and return the port number to use or error
 *
 * @returns
 */
const getServerPort = () => {
  const port = argv.p || defaultPort;
  // Check if the command line input has a port value and that it is actually a number
  if (argv.hasOwnProperty('p') && Number.isNaN(port)) {
    console.error(
      Array.isArray(port)
        ? 'Too many arguments for port.'
        : 'Invalid argument for port.',
    );
    // Exit the program
    process.exit(9);
  }
  if (port < 1025) {
    console.error(`Port ${port} is within the reserved ports. Please enter a higher port`);
    process.exit(9);
  }
  return port;
};

module.exports = {
  getFileList,
  getServerAddress,
  getServerPort,
};
