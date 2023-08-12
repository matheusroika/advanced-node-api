import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { UploadFile, DeleteFile } from '@/domain/contracts/gateways'

export class AwsS3FileStorage implements UploadFile, DeleteFile {
  client: S3Client

  constructor (accessKey: string, secret: string, private readonly bucket: string) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }

  async upload ({ key, file }: UploadFile.Params): Promise<UploadFile.Result> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
    await this.client.send(command)
    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`
  }

  async delete ({ key }: DeleteFile.Params): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key
    })
    await this.client.send(command)
  }
}
