import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { UploadFile, DeleteFile } from '@/domain/contracts/gateways'

export type AwsRegion = 'us-east-2'
type AwsConfig = {
  accessKey: string
  secret: string
  region: AwsRegion
}

export class AwsS3FileStorage implements UploadFile, DeleteFile {
  client: S3Client

  constructor ({ accessKey, secret, region }: AwsConfig, private readonly bucket: string) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      },
      region
    })
  }

  async upload ({ filename, file }: UploadFile.Params): Promise<UploadFile.Result> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: filename,
      Body: file,
      ACL: 'public-read'
    })
    await this.client.send(command)
    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(filename)}`
  }

  async delete ({ filename }: DeleteFile.Params): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: filename
    })
    await this.client.send(command)
  }
}
