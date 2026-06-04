"use client";

interface Props {
  score: number;
  missingPieces?: string[];
}

export default function PromptScore({ score, missingPieces }: Props) {
  const percentage = Math.max(0, Math.min(100, score));
  return (
    <div className="glass p-4 mt-4 text-sm">
      <h3 className="text-lg font-semibold mb-2">Prompt Score: {percentage}/100</h3>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
        <div
          className="bg-accent h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {missingPieces && missingPieces.length > 0 && (
        <div className="mt-2">
          <p className="font-semibold mb-1">Missing pieces to improve:</p>
          <ul className="list-disc list-inside space-y-1">
            {missingPieces.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}