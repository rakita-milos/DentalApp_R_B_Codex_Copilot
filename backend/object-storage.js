const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3');

function requiredEnvironment(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) throw new Error(`Set ${name} before using persistent object storage.`);
  return value;
}

function createObjectStorage() {
  const bucket = requiredEnvironment('S3_BUCKET');
  const client = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: requiredEnvironment('S3_ENDPOINT'),
    credentials: {
      accessKeyId: requiredEnvironment('S3_ACCESS_KEY_ID'),
      secretAccessKey: requiredEnvironment('S3_SECRET_ACCESS_KEY')
    }
  });

  return {
    async put({ key, body, contentType }) {
      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType
      }));
      return key;
    },

    async get(key) {
      const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      return Buffer.from(await result.Body.transformToByteArray());
    },

    async remove(key) {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    }
  };
}

module.exports = { createObjectStorage };
