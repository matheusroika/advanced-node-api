import { ServerError, UnauthorizedError } from '@/application/errors'

export type HttpResponse<Data = any> = {
  statusCode: number
  data: Data
}

export const ok = <Data = any> (data: Data): HttpResponse<Data> => ({
  statusCode: 200,
  data
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  data: error
})

export const unauthorized = (): HttpResponse<Error> => ({
  statusCode: 401,
  data: new UnauthorizedError()
})

export const serverError = (error?: Error): HttpResponse<Error> => ({
  statusCode: 500,
  data: new ServerError(error)
})
