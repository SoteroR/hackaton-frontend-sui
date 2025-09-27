import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from '@mysten/sui/transactions';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { TESTNET_COUNTER_PACKAGE_ID } from "@/constants";
export function AutoCoinButton( { amount, id }: { amount: bigint , id: string } ) {
  const [loading, setLoading] = useState(false);

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

      const [splitCoin] = tx.splitCoins(tx.gas, [amount]);
      tx.moveCall({
        target: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::contribute`,
        arguments: [
          tx.object(id),  // &mut Campaign
          splitCoin                    // Coin<SUI>
          // TxContext is automatic
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (res) => {
            console.log("diavlo");
            console.log(res);
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
    <Button onClick={handleClick} disabled={loading} style={{ color: "black" }}>
      {loading ? "Processing..." : `AutoCoin`}
    </Button>
  );
}
