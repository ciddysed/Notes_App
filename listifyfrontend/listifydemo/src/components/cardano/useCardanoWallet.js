// useCardanoWallet.js
// A React hook to detect CIP-30 wallets, connect (Lace primary), get address/utxos/balance,
// and expose connected state. Designed for frontend-only usage (Vite + React).
//
// Exports:
// - useCardanoWallet() -> { wallets, selected, connect, disconnect, api, address, balance, getUtxos, isConnected, error }
// Notes:
// - Expects window.cardano.* CIP-30 providers (Lace, Nami, Eternl, etc).
// - store VITE_BLOCKFROST_PROJECT_ID in .env for optional balance/utxo queries.

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BLOCKFROST_KEY = import.meta.env.VITE_BLOCKFROST_PROJECT_ID || "";
const BLOCKFROST_BASE = "https://cardano-mainnet.blockfrost.io/api/v0";

function detectWallets() {
  if (typeof window === "undefined" || !window.cardano) return [];
  // Normalize to a simple list of wallet ids (strings)
  return Object.keys(window.cardano).filter((k) => window.cardano[k] && typeof window.cardano[k].enable === "function");
}

export function useCardanoWallet(preferred = "lace") {
  const [wallets, setWallets] = useState(() => detectWallets());
  const [selected, setSelected] = useState("");
  const [api, setApi] = useState(null); // CIP-30 API object returned by enable()
  const [address, setAddress] = useState(null); // hex or bech32 string depending on wallet
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(null); // lovelace (BigInt) or null
  const [error, setError] = useState(null);

  // Detect wallets on mount and when window.cardano changes (very lightweight)
  useEffect(() => {
    const onReady = () => setWallets(detectWallets());
    onReady();
    // some wallets emit events or inject later; poll a few times
    const t = setInterval(onReady, 2000);
    return () => clearInterval(t);
  }, []);

  // Connect to CIP-30 wallet
  const connect = useCallback(
    async (walletId = preferred) => {
      setError(null);
      if (!walletId) {
        setError("No wallet selected");
        return null;
      }
      if (!window?.cardano?.[walletId]) {
        setError(${walletId} wallet not found);
        return null;
      }
      try {
        const provider = window.cardano[walletId];
        // enable() will prompt the wallet popup. Do not call repeatedly.
        const enabledApi = await provider.enable();
        setApi(enabledApi);
        setSelected(walletId);

        // Try to get a readable address (prefer getUsedAddresses/getChangeAddress)
        let addr = null;
        try {
          // Many wallets provide getChangeAddress or getUsedAddresses. We try safe order.
          if (typeof enabledApi.getChangeAddress === "function") {
            addr = await enabledApi.getChangeAddress();
          } else if (typeof enabledApi.getUsedAddresses === "function") {
            const used = await enabledApi.getUsedAddresses();
            addr = Array.isArray(used) && used.length ? used[0] : null;
          } else if (typeof enabledApi.getRewardAddresses === "function") {
            const rewards = await enabledApi.getRewardAddresses();
            addr = Array.isArray(rewards) && rewards.length ? rewards[0] : null;
          }
        } catch (addrErr) {
          // Non-fatal: some wallets require explicit address format conversion
          console.warn("address read error", addrErr);
        }
        setAddress(addr || null);
        setIsConnected(true);

        // fetch balance asynchronously (best-effort)
        if (addr && BLOCKFROST_KEY) {
          fetchBalance(addr).then((b) => setBalance(b)).catch(() => {});
        }
        return enabledApi;
      } catch (err) {
        setError(err?.message || "Failed to enable wallet");
        setApi(null);
        setIsConnected(false);
        return null;
      }
    },
    [preferred]
  );

  const disconnect = useCallback(() => {
    // CIP-30 does not always have a disconnect API; simply clear local state.
    setApi(null);
    setSelected("");
    setAddress(null);
    setIsConnected(false);
    setBalance(null);
    setError(null);
  }, []);

  // Fetch UTXOs using CIP-30 API if available (getUtxos) or via Blockfrost as fallback
  const getUtxos = useCallback(
    async (limit = 100) => {
      if (!api) throw new Error("Wallet not enabled");
      if (typeof api.getUtxos === "function") {
        // returns hex CBOR UTXOs in many wallet implementations
        const utxos = await api.getUtxos();
        return utxos || [];
      }
      // Fallback: use Blockfrost public API if we have address and key
      if (!address) throw new Error("Address required to query UTXOs");
      if (!BLOCKFROST_KEY) throw new Error("Blockfrost project ID missing");
      const url = ${BLOCKFROST_BASE}/addresses/${address}/utxos;
      const res = await axios.get(url, { headers: { project_id: BLOCKFROST_KEY } });
      return res.data || [];
    },
    [api, address]
  );

  // Fetch balance via Blockfrost (lovelace). Accepts bech32 address.
  async function fetchBalance(bech32Address) {
    if (!BLOCKFROST_KEY) return null;
    try {
      const res = await axios.get(${BLOCKFROST_BASE}/addresses/${bech32Address}, {
        headers: { project_id: BLOCKFROST_KEY },
      });
      // Blockfrost returns an 'amount' array with lovelace entry
      const amounts = res.data?.amount || [];
      const lovelaceObj = amounts.find((a) => a.unit === "lovelace");
      return lovelaceObj ? BigInt(lovelaceObj.quantity) : 0n;
    } catch (err) {
      console.warn("balance fetch failed", err?.message || err);
      return null;
    }
  }

  // Manual refresh balance
  const refreshBalance = useCallback(async () => {
    if (!address) return null;
    const b = await fetchBalance(address);
    setBalance(b);
    return b;
  }, [address]);

  return {
    wallets,
    selected,
    connect,
    disconnect,
    api,
    address,
    balance,
    getUtxos,
    isConnected,
    error,
    refreshBalance,
    setSelected,
  };
}