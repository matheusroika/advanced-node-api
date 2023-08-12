import { S3Client } from '@aws-sdk/client-s3'

export class AwsS3FileStorage {
  client: S3Client

  constructor (
    private readonly accessKey: string,
    private readonly secret: string
  ) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secret
      }
    })
  }
}
