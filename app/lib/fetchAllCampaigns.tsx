"use server";

import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TESTNET_COUNTER_PACKAGE_ID } from "../constants";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

export type Campaign = {
  id: string;
  goal: number;
  deadline: number;
  owner: string;
  totalRaised: number;
  isActive: boolean;
  name: string;
  description: string;
};

export async function fetchAllCampaigns(): Promise<Campaign[]> {
  try {
    // 1️⃣ Read events to discover campaign IDs
    const response = await client.queryEvents({
      query: {
        MoveEventType: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::CampaignCreated`,
      },
    });

    // 2️⃣ For each campaign ID, fetch the full object
    const campaigns: Campaign[] = [];
    for (const evt of response.data) {
      const fields = evt.parsedJson;

      // @ts-ignore
      const id = fields.campaign_id as string;

      const obj = await client.getObject({
        id,
        options: { showContent: true },
      });

      let objFields: any = {};
      if (obj.data?.content?.dataType === "moveObject") {
        objFields = (obj.data.content as any).fields;
      }

      campaigns.push({
        id,
        // @ts-ignore
        goal: Number(objFields.goal ?? fields.goal ?? 0),
        // @ts-ignore
        deadline: Number(objFields.deadline ?? fields.deadline ?? 0),
        // @ts-ignore
        owner: objFields.owner ?? fields.owner ?? "",
        totalRaised: Number(objFields.total_raised ?? 0),
        isActive: objFields.is_active ?? true,
        name: objFields.name ?? "",
        description: objFields.description ?? "",
      });
    }

    return campaigns;
  } catch (err) {
    console.error("❌ Error fetching campaigns:", err);
    return [];
  }
}
