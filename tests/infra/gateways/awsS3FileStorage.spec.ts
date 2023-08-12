import { S3Client } from '@aws-sdk/client-s3'
import { mocked } from 'jest-mock'
import { AwsS3FileStorage } from '@/infra/gateways'

jest.mock('@aws-sdk/client-s3')

describe('AWS S3 File Storage', () => {
  test('Should configure AWS credentials on creation', () => {
    const accessKey = 'any_access_key'
    const secret = 'any_secret'
    const sut = new AwsS3FileStorage(accessKey, secret)
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
})
