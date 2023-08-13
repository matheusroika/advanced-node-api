import multer from 'multer'
import { ServerError } from '@/application/errors'
import type { RequestHandler } from 'express'

export const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('userProfilePicture')
  upload(req, res, (error) => {
    res.status(500).json({ error: new ServerError(error).message })
  })
}
