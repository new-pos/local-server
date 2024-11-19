"use strict"

const { Storage } = require('@google-cloud/storage');

const stream = require('stream');
const storage = new Storage({ projectId: "pos-project-363816", keyFilename: 'google-access.json' });

async function upload_gcs(name, file) {
  try {
    const file_name = name.replace(/ /g, "-").replace(/@/g, "-").replace(/:/g, "-");
    const bufferStream = new stream.PassThrough();
    const myBucket = storage.bucket('dailypos');
    const file_stream = myBucket.file(file_name);

    await bufferStream.end(Buffer.from(file.slice(22), 'base64'));

    const uploader = new Promise((resolve, e) => {
      bufferStream
        .pipe(file_stream.createWriteStream({ public: true }))
        .on('finish', () => resolve("https://storage.googleapis.com/dailypos/" + file_name));
    });
    const upload = await uploader;

    return upload;
  } catch (error) {
    console.log("upload_gcs.error >> ", error);

    return null;
  }
}

module.exports = { upload_gcs };