const fs = require('fs');
const os = require('os');

fs.readFile('sample.txt', 'utf8', (err, data) => {
    if (err) {
    console.error('Error reading file:', err);
    } else {
    console.log('File contents:', data);
    }
});

fs.writeFile('output.txt', 'This is some sample data.', (err) => {
if (err) {
console.error('Error writing file:', err);
} else {
console.log('Data written to output.txt');
}
});

fs.writeFile('optional.txt', "Platform: " + os.platform() + "\nHostname: " + os.hostname() + "\nArchitecture: " + os.arch(), (err) => {
if (err) {
console.error('Error writing file:', err);
} else {
console.log('Data written to optional.txt');
}
});