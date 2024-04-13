import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/mongodb';
import Score from '../../../../models/Score';
import { verifySignature } from '../../../../utils/verifySignature'; // Ensure this is implemented correctly

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === 'POST') {
    const { score, walletAddress, signature } = req.body;

    if (!verifySignature(score.toString(), signature, walletAddress)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const newScore = new Score({ walletAddress, score });
      await newScore.save();
      return res.status(200).json(newScore);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
