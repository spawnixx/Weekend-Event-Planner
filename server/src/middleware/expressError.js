export class ExpressError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ExpressError";
    this.status = status;
  }
}
