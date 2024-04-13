import mongoose, { Document, Model } from 'mongoose';

export interface IScore extends Document {
  walletAddress: string;
  score: number;
}

const scoreSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    index: true,
  },
  score: {
    type: Number,
    required: true,
  },
},{
  timestamps: true,
  collection: 'FlappyPoot'  // Explicitly specifying the collection name
});

const Score: Model<IScore> = mongoose.models.Score || mongoose.model<IScore>('Score', scoreSchema);

export default Score;
