export class AccessToken {
  constructor (readonly value: string) {}

  static get validTimeInMs (): number {
    // 30 minutes
    return 30 * 60 * 1000
  }
}
