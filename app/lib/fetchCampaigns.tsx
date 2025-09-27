import { getFullnodeUrl, SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
import { TESTNET_COUNTER_PACKAGE_ID } from "../constants";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

const ADMIN_ADDRESS =
  "0x9f44045feeafbfb27342e9aa325bade7a558366993ab736fd01a02215a0379e6";

export async function fetchAllCampaigns() {
  try {
    const res = await client.getOwnedObjects({
      owner: ADMIN_ADDRESS,
      options: {
        showContent: true,
      },
      filter: {
        StructType: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::Campaign`,
      },
    });

    return res.data.map((obj: SuiObjectResponse) => {
      const content = obj.data?.content;

      if (content && content.dataType === "moveObject") {
        const fields = content.fields as any; // 👈 cast so TS knows about fields
        return {
          id: obj.data?.objectId,
          goal: fields.goal,
          deadline: fields.deadline,
          totalRaised: fields.total_raised,
          isActive: fields.is_active,
        };
      }

      return null;
    }).filter(Boolean);
  } catch (err) {
    console.error("❌ Failed to fetch campaigns", err);
    return [];
  }
}
