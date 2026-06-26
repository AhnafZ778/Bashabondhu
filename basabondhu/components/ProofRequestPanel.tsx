import React, { useState } from "react";
import { HiddenCostSource } from "../lib/domain/hidden-cost-sources";

export default function ProofRequestPanel({ scopes }: { scopes: HiddenCostSource[] }) {
  const [copied, setCopied] = useState(false);

  if (!scopes || scopes.length === 0) return null;

  // Filter out low seriousness scopes and sort
  const priorityScopes = scopes.filter(s => s.seriousness !== "low").sort((a, b) => {
    if (a.seriousness === "critical") return -1;
    if (b.seriousness === "critical") return 1;
    if (a.seriousness === "high") return -1;
    if (b.seriousness === "high") return 1;
    return 0;
  });

  const questions = priorityScopes.flatMap(s => s.askBeforeVisit).slice(0, 5); // Limit to top 5 questions
  const proofs = priorityScopes.flatMap(s => s.proofToRequest).slice(0, 3); // Limit to top 3 proofs

  const messageText = `Bhai, amar flat ta pochondo hoise but kisu jinis confirm korar chilo:\n\n` +
    questions.map((q, i) => `${i + 1}. ${q}`).join("\n") +
    (proofs.length > 0 ? `\n\nJodi somvob hoy, nicher jinis gulo ektu diben:\n` + proofs.map((p, i) => `- ${p}`).join("\n") : "");

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
        <span className="material-icons text-blue-400 text-sm">chat</span> Proof Request Message
      </h3>
      <p className="text-zinc-400 text-xs mb-4">
        We detected {priorityScopes.length} hidden cost scopes. Send this message to the owner/broker to clarify before visiting.
      </p>

      <div className="relative">
        <pre className="bg-black/50 p-4 rounded-lg text-sm text-zinc-300 whitespace-pre-wrap font-sans">
          {messageText}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-md transition"
        >
          <span className="material-icons text-sm">{copied ? "check" : "content_copy"}</span>
        </button>
      </div>
    </div>
  );
}
