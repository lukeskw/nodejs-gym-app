export class LateCheckInValidationException extends Error {
  constructor() {
    super('Tried to validate the check-in after 20 minutes of its creation')
  }
}
