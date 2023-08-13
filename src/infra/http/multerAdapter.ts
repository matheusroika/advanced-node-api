import multer from 'multer'
import { ServerError } from '@/application/errors'
import type { RequestHandler } from 'express'

export const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('userProfilePicture')
  upload(req, res, (error) => {
    if (error) return res.status(500).json({ error: new ServerError(error).message })
    if (req.file) req.locals = { ...req.locals, file: { buffer: req.file.buffer, mimeType: req.file.mimetype } }
    next()
  })
}
