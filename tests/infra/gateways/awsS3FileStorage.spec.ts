import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { mocked } from 'jest-mock'
import { AwsS3FileStorage } from '@/infra/gateways'

jest.mock('@aws-sdk/client-s3')

describe('AWS S3 File Storage', () => {
  const accessKey = 'any_access_key'
  const secret = 'any_secret'
  const bucket = 'any_bucket'
  const key = 'any_key'
  const file = Buffer.from('any_buffer')

  test('Should configure AWS credentials on creation', () => {
    const sut = new AwsS3FileStorage(accessKey, secret, bucket)
    const S3ClientInstance = mocked(S3Client).mock.instances[0]
    expect(sut.client).toEqual(S3ClientInstance)
    expect(S3Client).toHaveBeenCalledTimes(1)
    expect(S3Client).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  })

  test('Should call PutObjectCommand with correct params', async () => {
    const sut = new AwsS3FileStorage(accessKey, secret, bucket)
    await sut.upload({ key, file })
    expect(PutObjectCommand).toHaveBeenCalledTimes(1)
    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })
  })
})
