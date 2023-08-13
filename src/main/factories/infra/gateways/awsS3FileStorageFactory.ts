import { AwsS3FileStorage } from '@/infra/gateways'

export const makeAwsS3FileStorage = (): AwsS3FileStorage => {
  return new AwsS3FileStorage({
    accessKey: process.env.AWS_S3_ACCESS_KEY as string,
    secret: process.env.AWS_S3_SECRET as string,
    region: 'us-east-2'
  }, process.env.AWS_S3_BUCKET as string)
}
