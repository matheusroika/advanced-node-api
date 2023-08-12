import type { ChangeProfilePicture } from '@/domain/features'

type HttpRequest = { userId: string }

export class DeleteProfilePictureController {
  constructor (
    private readonly changeProfilePicture: ChangeProfilePicture
  ) {}

  async handle ({ userId }: HttpRequest): Promise<void> {
    await this.changeProfilePicture.change({ userId, file: undefined })
  }
}
