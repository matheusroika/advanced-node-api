import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { mocked } from 'jest-mock'
import { type AwsRegion, AwsS3FileStorage } from '@/infra/gateways'

jest.mock('@aws-sdk/client-s3')

describe('AWS S3 File Storage', () => {
  const accessKey = 'any_access_key'
  const secret = 'any_secret'
  const region: AwsRegion = 'us-east-2'
  const config = { accessKey, secret, region }
  const bucket = 'any_bucket'
  const filename = 'any_filename'

  test('Should configure AWS credentials on creation', () => {
    const sut = new AwsS3FileStorage(config, bucket)
    const s3ClientInstance = mocked(S3Client).mock.instances[0]
    expect(sut.client).toEqual(s3ClientInstance)
    expect(S3Client).toHaveBeenCalledTimes(1)
    expect(S3Client).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      },
      region
    })
  })

  describe('UploadFile', () => {
    const file = Buffer.from('any_buffer')

    test('Should call PutObjectCommand with correct params', async () => {
      const sut = new AwsS3FileStorage(config, bucket)
      await sut.upload({ filename, file })
      expect(PutObjectCommand).toHaveBeenCalledTimes(1)
      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: filename,
        Body: file,
        ACL: 'public-read'
      })
    })

    test('Should call S3Client.send with correct params', async () => {
      const sut = new AwsS3FileStorage(config, bucket)
      await sut.upload({ filename, file })
      const putObjectCommandInstance = mocked(PutObjectCommand).mock.instances[0]
      expect(sut.client.send).toHaveBeenCalledTimes(1)
      expect(sut.client.send).toHaveBeenCalledWith(putObjectCommandInstance)
    })

    test('Should return image url on S3Client.send success', async () => {
      const sut = new AwsS3FileStorage(config, bucket)
      const imageUrl = await sut.upload({ filename, file })
      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${filename}`)
    })

    test('Should return image url on S3Client.send success', async () => {
      const sut = new AwsS3FileStorage(config, bucket)
      const imageUrl = await sut.upload({ filename: 'any filename', file })
      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20filename`)
    })

    test('Should throw if S3Client.send throws', async () => {
      const sut = new AwsS3FileStorage(config, bucket)
      const error = new Error('s3 error')
      mocked(sut.client).send.mockImplementationOnce(() => { throw error })
      const promise = sut.upload({ filename, file })
      await expect(promise).rejects.toThrow(error)
    })
  })

  describe('DeleteFile', () => {
    test('Should call DeleteObjectCommand with correct params', async () => {
      const sut = new AwsS3FileStorage(config, bucket)
      await sut.delete({ filename })
      expect(DeleteObjectCommand).toHaveBeenCalledTimes(1)
      expect(DeleteObjectCommand).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: filename
      })
    })

    test('Should call S3Client.send with correct params', async () => {
      const sut = new AwsS3FileStorage(config, bucket)
      await sut.delete({ filename })
      const deleteObjectCommandInstance = mocked(DeleteObjectCommand).mock.instances[0]
      expect(sut.client.send).toHaveBeenCalledTimes(1)
      expect(sut.client.send).toHaveBeenCalledWith(deleteObjectCommandInstance)
    })

    test('Should throw if S3Client.send throws', async () => {
      const sut = new AwsS3FileStorage(config, bucket)
      const error = new Error('s3 error')
      mocked(sut.client).send.mockImplementationOnce(() => { throw error })
      const promise = sut.delete({ filename })
      await expect(promise).rejects.toThrow(error)
    })
  })
})
