<<<<<<< HEAD
import * as CSL from '@emurgo/cardano-serialization-lib-browser';

const BLOCKFROST_API_KEY = import.meta.env.VITE_BLOCKFROST_API_KEY;
const NETWORK = import.meta.env.VITE_CARDANO_NETWORK || 'preview';

// Helper function to convert hex string to Uint8Array
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Helper function to convert Uint8Array to hex string
function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Fetch protocol parameters from Blockfrost
async function getProtocolParameters() {
  const baseUrl = NETWORK === 'mainnet' 
    ? 'https://cardano-mainnet.blockfrost.io/api/v0'
    : `https://cardano-${NETWORK}.blockfrost.io/api/v0`;

  const response = await fetch(`${baseUrl}/epochs/latest/parameters`, {
    headers: { project_id: BLOCKFROST_API_KEY }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch protocol parameters: ${response.statusText}`);
  }

  return await response.json();
}

// Submit transaction to Blockfrost
async function submitTransaction(txCbor) {
  const baseUrl = NETWORK === 'mainnet'
    ? 'https://cardano-mainnet.blockfrost.io/api/v0'
    : `https://cardano-${NETWORK}.blockfrost.io/api/v0`;

  const response = await fetch(`${baseUrl}/tx/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/cbor',
      'project_id': BLOCKFROST_API_KEY
    },
    body: hexToBytes(txCbor)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Transaction submission failed: ${error}`);
  }

  return await response.json();
}

/**
 * Build, sign, and submit a Cardano transaction
 * @param {Object} walletApi - CIP-30 wallet API from wallet.enable()
 * @param {string} recipient - Bech32 address to send to
 * @param {BigInt} lovelaceAmount - Amount in lovelace (1 ADA = 1,000,000 lovelace)
 * @param {Object} metadata - Optional transaction metadata
 */
export async function buildSignAndSubmit({ 
  walletApi, 
  recipient, 
  lovelaceAmount, 
  metadata = null 
}) {
  try {
    // 1. Get protocol parameters
    const protocolParams = await getProtocolParameters();

    // 2. Get UTXOs from wallet
    const utxosHex = await walletApi.getUtxos();
    if (!utxosHex || utxosHex.length === 0) {
      throw new Error('No UTXOs available in wallet');
    }

    // 3. Parse UTXOs and calculate total available
    const utxos = [];
    let totalAvailable = BigInt(0);
    
    for (const utxoHex of utxosHex) {
      const utxo = CSL.TransactionUnspentOutput.from_bytes(hexToBytes(utxoHex));
      const amount = utxo.output().amount().coin();
      const amountBigInt = BigInt(amount.to_str());
      
      utxos.push(utxo);
      totalAvailable += amountBigInt;
    }

    console.log('Total available:', totalAvailable.toString(), 'lovelace');
    console.log('Requested amount:', lovelaceAmount.toString(), 'lovelace');

    // 4. Check if we have enough funds (including estimated fee)
    const estimatedFee = BigInt(200000); // 0.2 ADA estimate
    const totalNeeded = lovelaceAmount + estimatedFee;
    
    if (totalAvailable < totalNeeded) {
      throw new Error(
        `Insufficient funds. Available: ${totalAvailable} lovelace, ` +
        `Needed: ${totalNeeded} lovelace (${lovelaceAmount} + ${estimatedFee} fee)`
      );
    }

    // 5. Get change address
    const changeAddressHex = await walletApi.getChangeAddress();
    const changeAddress = CSL.Address.from_bytes(hexToBytes(changeAddressHex));

    // 6. Create inputs
    const inputs = CSL.TransactionInputs.new();
    let selectedInputValue = BigInt(0);
    
    // Select all UTXOs (simple approach)
    for (const utxo of utxos) {
      inputs.add(utxo.input());
      const amount = utxo.output().amount().coin();
      selectedInputValue += BigInt(amount.to_str());
    }

    // 7. Create outputs
    const outputs = CSL.TransactionOutputs.new();
    
    // Add recipient output
    const recipientAddress = CSL.Address.from_bech32(recipient);
    const outputValue = CSL.Value.new(CSL.BigNum.from_str(lovelaceAmount.toString()));
    outputs.add(CSL.TransactionOutput.new(recipientAddress, outputValue));

    // 8. Calculate change (input - output - fee)
    const changeAmount = selectedInputValue - lovelaceAmount - estimatedFee;
    
    console.log('Change amount:', changeAmount.toString(), 'lovelace');

    // Add change output if significant (> 1 ADA)
    if (changeAmount > BigInt(1000000)) {
      const changeValue = CSL.Value.new(CSL.BigNum.from_str(changeAmount.toString()));
      outputs.add(CSL.TransactionOutput.new(changeAddress, changeValue));
    } else if (changeAmount < BigInt(0)) {
      throw new Error('Insufficient funds after fee calculation');
    }

    // 9. Build transaction body
    const txBody = CSL.TransactionBody.new(
      inputs,
      outputs,
      CSL.BigNum.from_str(estimatedFee.toString()),
      undefined // ttl - optional
    );

    // 10. Add metadata if provided
    let auxData = undefined;
    if (metadata) {
      auxData = CSL.AuxiliaryData.new();
      const metadataMap = CSL.GeneralTransactionMetadata.new();
      
      Object.entries(metadata).forEach(([key, value]) => {
        metadataMap.insert(
          CSL.BigNum.from_str(key),
          CSL.encode_json_str_to_metadatum(
            JSON.stringify(value), 
            CSL.MetadataJsonSchema.BasicConversions
          )
        );
      });
      
      auxData.set_metadata(metadataMap);
    }

    // 11. Create unsigned transaction
    const witnessSet = CSL.TransactionWitnessSet.new();
    const transaction = CSL.Transaction.new(txBody, witnessSet, auxData);

    console.log('Transaction built, requesting signature...');

    // 12. Request wallet to sign
    const witnessSetHex = await walletApi.signTx(
      bytesToHex(transaction.to_bytes()),
      true
    );
    
    console.log('Transaction signed');

    // 13. Parse the returned witness set
    const txWitnessSet = CSL.TransactionWitnessSet.from_bytes(hexToBytes(witnessSetHex));
    
    // 14. Construct the final signed transaction
    const signedTx = CSL.Transaction.new(txBody, txWitnessSet, auxData);

    console.log('Submitting transaction...');

    // 15. Submit transaction
    const result = await submitTransaction(bytesToHex(signedTx.to_bytes()));

    return {
      success: true,
      txHash: result
    };

  } catch (error) {
    console.error('Transaction failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
=======
// src/services/transactionService.js
>>>>>>> d686a1f691fe4eddb549364592a574685489cb3f
