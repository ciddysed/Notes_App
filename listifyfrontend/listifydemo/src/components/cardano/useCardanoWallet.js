// useCardanoWallet.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BLOCKFROST_KEY = import.meta.env.VITE_BLOCKFROST_PROJECT_ID || "";
const BLOCKFROST_BASE = "https://cardano-mainnet.blockfrost.io/api/v0";

function detectWallets() {
  if (typeof window === "undefined" || !window.cardano) return [];
  return Object.keys(window.cardano).filter((k) => window.cardano[k] && typeof window.cardano[k].enable === "function");
}

export function useCardanoWallet(preferred = "lace") {
  const [wallets, setWallets] = useState(() => detectWallets());
  const [selected, setSelected] = useState("");
  const [api, setApi] = useState(null);
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  // Detect wallets on mount
  useEffect(() => {
    const onReady = () => setWallets(detectWallets());
    onReady();
    const t = setInterval(onReady, 2000);
    return () => clearInterval(t);
  }, []);

  // Fetch balance via Blockfrost
  const fetchBalance = useCallback(async (bech32Address) => {
    if (!BLOCKFROST_KEY) return null;
    try {
      const res = await axios.get(`${BLOCKFROST_BASE}/addresses/${bech32Address}`, {
        headers: { project_id: BLOCKFROST_KEY },
      });
      const amounts = res.data?.amount || [];
      const lovelaceObj = amounts.find((a) => a.unit === "lovelace");
      return lovelaceObj ? BigInt(lovelaceObj.quantity) : 0n;
    } catch (err) {
      console.warn("balance fetch failed", err?.message || err);
      return null;
    }
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
        setError(`${walletId} wallet not found`);
        return null;
      }
      try {
        const provider = window.cardano[walletId];
        const enabledApi = await provider.enable();
        setApi(enabledApi);
        setSelected(walletId);

        let addr = null;
        try {
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
          console.warn("address read error", addrErr);
        }
        setAddress(addr || null);
        setIsConnected(true);

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
    [preferred, fetchBalance]
  );

  const disconnect = useCallback(() => {
    setApi(null);
    setSelected("");
    setAddress(null);
    setIsConnected(false);
    setBalance(null);
    setError(null);
  }, []);

  // Fetch UTXOs
  const getUtxos = useCallback(
    async (limit = 100) => {
      if (!api) throw new Error("Wallet not enabled");
      if (typeof api.getUtxos === "function") {
        const utxos = await api.getUtxos();
        return utxos || [];
      }
      if (!address) throw new Error("Address required to query UTXOs");
      if (!BLOCKFROST_KEY) throw new Error("Blockfrost project ID missing");
      const url = `${BLOCKFROST_BASE}/addresses/${address}/utxos`;
      const res = await axios.get(url, { headers: { project_id: BLOCKFROST_KEY } });
      return res.data || [];
    },
    [api, address]
  );

  // Manual refresh balance
  const refreshBalance = useCallback(async () => {
    if (!address) return null;
    const b = await fetchBalance(address);
    setBalance(b);
    return b;
  }, [address, fetchBalance]);

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