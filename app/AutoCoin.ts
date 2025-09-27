import { CoinStruct, getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from '@mysten/sui/transactions';
import {
  useCurrentAccount
} from "@mysten/dapp-kit";
async function autoCoin(x: bigint) {
  const tx = new Transaction();
  const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
  });
  const currentAccount = useCurrentAccount();
  if (!currentAccount) {
    return;
  }
  const coins = await client.getCoins({
    owner: currentAccount?.address,
    coinType: "0x2::sui::SUI",
  });
  const sorted = [...coins.data].sort((a, b) => Number(BigInt(b.balance) - BigInt(a.balance)));

  const chosen: CoinStruct[] = [];
  let total = 0n;
  let lastCoinSplitAmount: bigint | undefined;

  for (const coin of sorted) {
    const bal = BigInt(coin.balance);
    if (total + bal < x) {
      chosen.push(coin);
      total += bal;
    } else {
      // Last coin needs to be split
      const needed = x - total;
      chosen.push(coin); // add reference to transaction
      lastCoinSplitAmount = needed;
      total += needed;
      break;
    }
  }

  let lastCoinRef = chosen[chosen.length - 1];
  let splitCoin = null
  // Split the last coin if needed
  if (lastCoinSplitAmount !== undefined &&
    lastCoinSplitAmount < BigInt(chosen[chosen.length - 1].balance)) {
    console.log(lastCoinRef);
    chosen.pop()
    splitCoin = tx.splitCoins(lastCoinRef.coinObjectId, [lastCoinSplitAmount]);
  }
  return [chosen, splitCoin]
}
