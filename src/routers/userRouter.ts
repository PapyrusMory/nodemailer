import express, { Request, Response } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { UserModel } from '../models/userModel'
import nodemailer from 'nodemailer'
import { generatePasswordToken } from '../utils'
import jwt from 'jsonwebtoken'

export const userRouter = express.Router()

userRouter.post(
  '/forgot-password',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const { email } = req.body
      const user = await UserModel.findOne({ email: email })
      if (user) {
        const token = generatePasswordToken(email, user._id)
        const transporter = nodemailer.createTransport({
          service: process.env.NODEMAILER_SERVICE,
          host: process.env.NODEMAILER_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.NODEMAILER_AUTH_USER,
            pass: process.env.NODEMAILER_AUTH_PASS,
          },
        })

        const mailOptions = {
          from: process.env.NODEMAILER_AUTH_USER,
          to: email,
          subject: 'Réinitialisation de mot de passe',
          text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe: http://localhost:5173/reset-password/${user._id}/${token}`,
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error)
            res.status(500).send(`Erreur lors de l'envoi du mail`)
          } else {
            console.log(`Email envoyé: ${info.response}`)
            res
              .status(200)
              .send(
                'Consultez votre email pour obtenir des informations sur la réinitialisation de votre mot de passe.'
              )
          }
        })

        res.send({
          email,
          token: token,
        })
      } else {
        res.status(404).send('Email Introuvable')
      }
    } catch (error) {
      console.log(error)
    }
  })
)
