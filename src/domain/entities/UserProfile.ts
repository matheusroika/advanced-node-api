export class UserProfile {
  initials?: string
  pictureUrl?: string
  constructor (
    readonly id: string
  ) {}

  setPicture ({ pictureUrl, name }: { pictureUrl?: string, name?: string }): void {
    this.pictureUrl = pictureUrl
    if (name && !pictureUrl) {
      const nameArray = name.split(' ')
      if (nameArray.length === 1) {
        this.initials = nameArray[0].substring(0, 2).toUpperCase()
      } else {
        const letterArray = nameArray.map(n => n[0].toUpperCase())
        this.initials = letterArray[0] + letterArray[letterArray.length - 1]
      }
    }
  }
}
