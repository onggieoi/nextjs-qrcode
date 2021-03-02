import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnection from 'utils/dbConfig';
import { Customer } from 'utils/entities/Customer';

export default async (req: NextApiRequest, res: NextApiResponse) => {

  try {
    await dbConnection();
  } catch (error) {
    if (error) {
      res.status(404).end({ result: { isDone: false, message: 'cannot connect db' } });
    }
  }

  if (req.method === 'POST') {
    const { id } = req.body;

    const customer = await Customer.findOne({ id });

    if (!customer) {
      res.status(404).end(JSON.stringify({ result: { isDone: false, message: 'not existing this qr' } }));
    } else if (customer.isUsedCoupon) {
      res.status(200).end(JSON.stringify({ result: { isDone: false, message: 'this QrCode is used' } }));
    } else {
      customer.isUsedCoupon = true;

      try {
        await customer.save();
        res.status(200).end(JSON.stringify({ result: { isDone: true, message: 'Scan successful' } }));
      } catch (error) {
        res.status(500).json({ result: { isDone: false, message: 'cannot update this customer coupon status' } });
      }
    }

  } else {
    res.status(404).json({ result: { isDone: false, message: 'page not found' } });
  }
}
