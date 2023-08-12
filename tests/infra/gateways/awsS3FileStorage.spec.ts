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
    const s3ClientInstance = mocked(S3Client).mock.instances[0]
    expect(sut.client).toEqual(s3ClientInstance)
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

  test('Should call S3Client.send with correct params', async () => {
    const sut = new AwsS3FileStorage(accessKey, secret, bucket)
    await sut.upload({ key, file })
    const putObjectCommandInstance = mocked(PutObjectCommand).mock.instances[0]
    expect(sut.client.send).toHaveBeenCalledTimes(1)
    expect(sut.client.send).toHaveBeenCalledWith(putObjectCommandInstance)
  })

  test('Should return image url on S3Client.send success', async () => {
    const sut = new AwsS3FileStorage(accessKey, secret, bucket)
    const imageUrl = await sut.upload({ key, file })
    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${key}`)
  })

  test('Should return image url on S3Client.send success', async () => {
    const sut = new AwsS3FileStorage(accessKey, secret, bucket)
    const imageUrl = await sut.upload({ key: 'any key', file })
    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20key`)
  })

  test('Should throw if S3Client.send throws', async () => {
    const sut = new AwsS3FileStorage(accessKey, secret, bucket)
    const error = new Error('s3 error')
    mocked(sut.client).send.mockImplementationOnce(() => { throw error })
    const promise = sut.upload({ key, file })
    await expect(promise).rejects.toThrow(error)
  })
})
