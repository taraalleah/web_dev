const fs = require('fs').promises;
const os = require('os');

async function readFileAndLogOSInfo() {
 try {
   const data = await fs.readFile('output.txt', 'utf8');
   console.log('Data from file:', data);

   const platform = os.platform();
   console.log('OS Platform:', platform);
 } catch (error) {
   console.error('Error:', error);
 }
}

readFileAndLogOSInfo();