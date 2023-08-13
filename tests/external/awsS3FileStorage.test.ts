import axios from 'axios'
import { AwsS3FileStorage } from '@/infra/gateways'

type Sut = {
  sut: AwsS3FileStorage
}

const makeSut = (): Sut => {
  const sut = new AwsS3FileStorage(
    {
      accessKey: process.env.AWS_S3_ACCESS_KEY as string,
      secret: process.env.AWS_S3_SECRET as string,
      region: 'us-east-2'
    },
    process.env.AWS_S3_BUCKET as string
  )
  return {
    sut
  }
}

describe('AWS S3 Integration', () => {
  test('Should upload image successfully to AWS S3', async () => {
    const { sut } = makeSut()
    const key = 'integration_test_image.png'
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjUNF88R8AA98CNazd1XsAAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')
    const pictureUrl = await sut.upload({ key, file })
    expect((await axios.get(pictureUrl)).status).toBe(200)
  })

  test('Should delete image successfully on AWS S3', async () => {
    const { sut } = makeSut()
    const key = 'integration_test_deleted_image.png'
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjUNF88R8AA98CNazd1XsAAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')
    const pictureUrl = await sut.upload({ key, file })
    expect((await axios.get(pictureUrl)).status).toBe(200)
    await sut.delete({ key })
    await expect(axios.get(pictureUrl)).rejects.toThrow()
  })
})
