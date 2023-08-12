import { ForbiddenError, ServerError, UnauthorizedError } from '@/application/errors'

export type HttpResponse<Data = any> = {
  statusCode: number
  data: Data
}

export const ok = <Data = any> (data: Data): HttpResponse<Data> => ({
  statusCode: 200,
  data
})

export const noContent = (): HttpResponse<undefined> => ({
  statusCode: 204,
  data: undefined
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  data: error
})

export const unauthorized = (): HttpResponse<Error> => ({
  statusCode: 401,
  data: new UnauthorizedError()
})

export const forbidden = (): HttpResponse<Error> => ({
  statusCode: 403,
  data: new ForbiddenError()
})

export const serverError = (error?: Error): HttpResponse<Error> => ({
  statusCode: 500,
  data: new ServerError(error)
})
