import multer from 'multer'
import type { RequestHandler } from 'express'

export const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('userProfilePicture')
  upload(req, res, () => {})
}
