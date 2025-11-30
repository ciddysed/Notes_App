// WalletPanel.jsx
// Example React UI that uses `useCardanoWallet` and `transactionService`.
// - Provides Connect/Disconnect (Lace preferred), shows address & balance,
// - Inputs for recipient and amount, optional note metadata selection,
// - Sends a tx that optionally includes metadata fetched from backend.
//
// Usage:
// import WalletPanel from "./WalletPanel.jsx";
// <WalletPanel backendBaseUrl="http://localhost:8080" />

import React, { useState } from "react";
import { useCardanoWallet } from "./useCardanoWallet";
import { buildSignAndSubmit } from "./transactionService";

export default function WalletPanel() {
  const {
    wallets, selected, connect, disconnect, api, address, balance, isConnected, error, refreshBalance, setSelected
  } = useCardanoWallet("lace");

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(""); // hold string, convert to BigInt on submit
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [txStatus, setTxStatus] = useState(null);
  const [isSending, setIsSending] = useState(false);

  async function handleConnect() {
    // prefer currently selected; fallback to lace; else first detected
    const pick = selected || (wallets.includes("lace") ? "lace" : wallets[0] || null);
    if (!pick) {
      alert("No CIP-30 wallet detected. Install Lace or another Cardano wallet extension.");
      return;
    }
    setSelected(pick);
    await connect(pick);
  }

  // No backend: optional metadata can be entered directly as JSON in future.

  async function handleSend() {
    setTxStatus(null);
    setIsSending(true);

    if (!api) {
      setTxStatus({ error: "Wallet not connected / enabled." });
      setIsSending(false);
      return;
    }
    if (!recipient) {
      setTxStatus({ error: "Recipient is required." });
      setIsSending(false);
      return;
    }
    let lovelaceAmount;
    try {
      // Accept ADA decimal OR lovelace numeric input. Here we assume user inputs lovelaces as integer.
      if (amount.includes(".")) {
        // if user used ADA decimals, convert ADA->lovelace
        const ada = Number(amount);
        lovelaceAmount = BigInt(Math.round(ada * 1_000_000));
      } else {
        lovelaceAmount = BigInt(amount);
      }
      if (lovelaceAmount <= 0n) throw new Error("Amount must be > 0");
    } catch (err) {
      setTxStatus({ error: "Invalid amount. Use lovelaces integer or ADA decimal format." });
      setIsSending(false);
      return;
    }

    let metadata = null;
    // If a note id is provided, build simple inline metadata without backend
    if (selectedNoteId) {
      metadata = {
        1: {
          noteId: String(selectedNoteId),
          title: "Inline Note",
          content: "Metadata attached without backend",
        },
      };
    }

    // Pre-check: ensure wallet has at least one UTXO
    try {
      const utxosHex = await api.getUtxos();
      if (!utxosHex || utxosHex.length === 0) {
        setTxStatus({ error: "Wallet has no UTXOs. Fund the wallet to send." });
        setIsSending(false);
        return;
      }
    } catch (e) {
      // If getUtxos fails, surface a helpful message
      setTxStatus({ error: "Unable to query wallet UTXOs." });
      setIsSending(false);
      return;
    }

    try {
      setTxStatus({ info: "Building transaction..." });
      const result = await buildSignAndSubmit({
        walletApi: api,
        recipient,
        lovelaceAmount,
        metadata,
      });
      if (result?.success) {
        setTxStatus({ success: `Transaction submitted. TxHash: ${result.txHash}` });
        // refresh balance best-effort
        await refreshBalance();
      } else {
        setTxStatus({ error: "Unknown failure building/submitting transaction." });
      }
    } catch (err) {
      setTxStatus({ error: err?.message || "Transaction failed" });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="p-4 max-w-md space-y-4 border rounded">
      <h3 className="text-lg font-semibold">Cardano Wallet (Lace)</h3>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="space-y-2">
        <label className="text-xs">Select wallet</label>
        <select
          className="w-full px-3 py-2 border rounded"
          value={selected || ""}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="" disabled>{wallets.length ? "Choose a wallet" : "No wallets detected"}</option>
          {wallets.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      {!isConnected ? (
        <div className="space-y-2">
          <button onClick={handleConnect} className="px-4 py-2 bg-blue-600 text-white rounded">Connect Wallet</button>
          <div className="text-xs text-gray-600">Detected wallets: {wallets.join(", ") || "none"}</div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm">Connected: <strong>{selected}</strong></div>
          <div className="text-xs font-mono">Address: {address || "—"}</div>
          <div className="text-xs">Balance: {balance !== null ? `${balance} lovelace` : "unknown"}</div>
          <div className="flex gap-2">
            <button onClick={() => disconnect()} className="px-3 py-1 bg-gray-200 rounded">Disconnect</button>
            <button
              onClick={async () => { await disconnect(); await handleConnect(); }}
              className="px-3 py-1 bg-gray-200 rounded"
              disabled={!selected}
            >
              Switch to selected
            </button>
          </div>
        </div>
      )}

      <div className="pt-2 border-t"></div>

      <div className="space-y-2">
        <input placeholder="Recipient (bech32)" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full px-3 py-2 border rounded" />
        <input placeholder="Amount (lovelace or ADA e.g. 0.5)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 border rounded" />
        <input placeholder="Optional Note ID to attach metadata" value={selectedNoteId} onChange={(e) => setSelectedNoteId(e.target.value)} className="w-full px-3 py-2 border rounded" />
        <div className="flex gap-2">
          <button onClick={handleSend} disabled={isSending || !isConnected} className="px-4 py-2 bg-green-600 text-white rounded">
            {isSending ? "Sending..." : "Send ADA"}
          </button>
          <button onClick={() => { setRecipient(""); setAmount(""); setSelectedNoteId(""); setTxStatus(null); }} className="px-3 py-2 bg-gray-100 rounded">Reset</button>
        </div>
        {txStatus?.info && <div className="text-sm text-blue-600">{txStatus.info}</div>}
        {txStatus?.success && <div className="text-sm text-green-700">{txStatus.success}</div>}
        {txStatus?.error && <div className="text-sm text-red-700">{txStatus.error}</div>}
      </div>
    </div>
  );
}
