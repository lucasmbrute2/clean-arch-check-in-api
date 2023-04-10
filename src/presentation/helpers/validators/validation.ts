export interface Validation {
  validate<T>(input: T): Error | null
}