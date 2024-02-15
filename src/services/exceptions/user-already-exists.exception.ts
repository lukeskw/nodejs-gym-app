export class UserAlreadyExistsException extends Error {
  constructor() {
    super('Email already exists')
  }
}
