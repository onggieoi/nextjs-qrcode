import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import inlineBase64 from 'nodemailer-plugin-inline-base64';

import dbConnection from 'utils/dbConfig';
import { Customer } from 'utils/entities/Customer';
import generateQR from 'utils/generateQR';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnection();
  } catch (error) {
    if (error) {
      res.status(404).end({ result: { isDone: false, message: 'cannot connect db' } });
    }
  }

  if (req.method === 'POST') {
    const { fullname, email, phoneNumber } = req.body;

    const isExistCus = await Customer.findOne({ email });

    if (isExistCus) {
      res.status(500).json(JSON.stringify({ result: { isDone: false, message: `Existing this email: ${email}` } }));
    } else {
      const newCustomer = Customer.create({ fullname, email, phoneNumber, isUsedCoupon: false });

      try {
        await newCustomer.save();

        const transporter = nodemailer.createTransport({
          host: 'smtp.googlemail.com',
          service: 'Gmail',
          auth: {
            user: 'hoangman110898@gmail.com',
            pass: 'yyymuibhgpifyuon',
          },
        });
        transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));

        const qrcode = await generateQR(newCustomer.id);

        const mailOption: Options = {
          from: 'Your Teacher',
          to: email,
          subject: 'QrCode Discount | Damsen Park',
          html: `
          <div>
            <h1>Hello ${fullname}</h1>
            <p>Here is your QRcode, use it to get discount for your ticket at Dam sen Park</p>
            <img src="${qrcode}" style="width:250px; margin: 1rem 0;" />
            <p>Thanks for your information</p>
          </div>
          `,
        };

        try {
          await transporter.sendMail(mailOption);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ result: { isDone: true } }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ result: { isDone: false, message: 'Cannot send email' } }));
        }

      } catch (error) {
        res.status(500).json({ result: { isDone: false, message: 'cannot insert to customer' } });
      }
    }

  } else {
    res.status(404).json({ result: { isDone: false, message: 'page not found' } });
  }
}
