import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from '@mysten/sui/transactions';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
export function AutoCoinButton({ amount }: { amount: bigint }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const currentAccount = useCurrentAccount()?.address;
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) => {
      const client = new SuiClient({ url: getFullnodeUrl("testnet") });
      return await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      });
    },
  });

  const handleClick = async () => {
    if (!currentAccount) {
      console.error("No current account");
      return;
    }

    setLoading(true);

    try {
      const client = new SuiClient({ url: getFullnodeUrl("testnet") });
      const tx = new Transaction();

      const coins = await client.getCoins({
        owner: currentAccount,
        coinType: "0x2::sui::SUI",
      });
      console.log(1234);
      console.log(coins);
      const coinList = coins.data.map((item) => item.coinObjectId);
      if (coinList.length!=1) {
        tx.mergeCoins(tx.gas, coinList.slice(1));
      }

      const splitCoin = tx.splitCoins(tx.gas, [amount]);
      tx.transferObjects([splitCoin], currentAccount);

      let dc: string | undefined;
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (res) => {
            dc = res.objectChanges?.find(
              (item) => item.type === "created",
            )?.objectId;
            if (!dc) console.log("Error creating object");
            setResult(dc ?? "Error");
          },
        },
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? "Processing..." : `AutoCoin ${amount.toString()}`}
      {result && <div>Result: {result}</div>}
    </Button>
  );
}
