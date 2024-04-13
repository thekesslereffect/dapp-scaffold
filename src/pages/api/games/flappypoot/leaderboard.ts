import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from 'lib/mongodb';
import Score from 'models/Score';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const scores = await Score.find({}).sort({ score: -1 }).limit(10);
      return res.status(200).json(scores);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
