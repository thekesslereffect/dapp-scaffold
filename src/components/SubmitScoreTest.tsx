import { FC, useCallback, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { notify } from "../utils/notifications";

export const SubmitScoreTest: FC = () => {
    const { publicKey, signMessage } = useWallet();
    const [leaderboard, setLeaderboard] = useState([]);

    const submitScore = useCallback(async () => {
        if (!publicKey || !signMessage) {
            notify({ type: 'error', message: 'Wallet not connected or does not support signing!' });
            return;
        }

        const score = 42;  // Hardcoded score
        const message = new TextEncoder().encode(`Submit Score: ${score}`);
        try {
            const signature = await signMessage(message);
            const signatureBase58 = bs58.encode(signature);
            const response = await fetch('/api/games/flappypoot/submit-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    score,
                    signature: signatureBase58,
                    walletAddress: publicKey.toBase58(),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                notify({ type: 'success', message: 'Score submitted successfully!', txid: data.txid });
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Failed to submit score:', error);
            notify({ type: 'error', message: `Failed to submit score: ${error.message}` });
        }
    }, [publicKey, signMessage]);

    const fetchLeaderboard = useCallback(async () => {
        try {
            const response = await fetch('/api/games/flappypoot/leaderboard', {
                method: 'GET'
            });
            const data = await response.json();
            if (response.ok) {
                setLeaderboard(data);
                notify({ type: 'success', message: 'Leaderboard fetched successfully!' });
            } else {
                throw new Error(data.error || 'Failed to fetch leaderboard');
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
            notify({ type: 'error', message: `Failed to fetch leaderboard: ${error.message}` });
        }
    }, []);

    return (
        <div>
            <button
                onClick={submitScore}
                disabled={!publicKey || !signMessage}
                className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
            >
                {publicKey ? 'Submit Score' : 'Connect Wallet'}
            </button>
            <button
                onClick={fetchLeaderboard}
                className="btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Get Leaderboard
            </button>
            {leaderboard.length > 0 && (
                <div className="leaderboard mt-4">
                    <h3 className="text-lg font-bold">Top Scores:</h3>
                    <ul>
                        {leaderboard.map((entry, index) => (
                            <li key={index}>{entry.walletAddress}: {entry.score}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SubmitScoreTest;
