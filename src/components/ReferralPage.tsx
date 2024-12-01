import React, { useState } from 'react';
import { Share2, Copy, CheckCircle } from 'lucide-react';

const ReferralPage: React.FC = () => {
  const [referralCode] = useState('COWORK123');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://coworkbuddy.com/refer?code=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">Refer a Friend</h2>
      <p className="text-lg mb-6 text-center">
        Share CoWork Buddy with your friends and earn rewards!
      </p>
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Referral Code</h3>
        <div className="flex items-center justify-between bg-white p-3 rounded">
          <span className="text-2xl font-bold">{referralCode}</span>
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-300"
          >
            {copied ? <CheckCircle size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Share via</h3>
        <div className="flex space-x-4">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
            Facebook
          </button>
          <button className="flex-1 bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-300">
            Twitter
          </button>
          <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300">
            WhatsApp
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">How it works</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Share your unique referral code with friends</li>
          <li>Your friend signs up using your code</li>
          <li>Once they complete their first session, you both get a reward!</li>
        </ol>
      </div>
      <div className="mt-6 bg-blue-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Your Rewards</h3>
        <p>For each friend who signs up and completes a session, you'll receive:</p>
        <ul className="list-disc list-inside mt-2">
          <li>1 week of premium membership</li>
          <li>50 productivity points</li>
          <li>Access to exclusive productivity workshops</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralPage;