"use server";

import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TESTNET_COUNTER_PACKAGE_ID } from "../constants";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

export async function fetchAllCampaigns() {
  try {
    // 🔎 leemos eventos emitidos por tu módulo
    const response = await client.queryEvents({
      query: {
        MoveEventType: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::CampaignCreated`,
      },
    });

    // 🔄 Mapear los datos del evento
    const campaigns = response.data.map((evt: any) => {
      const fields = evt.parsedJson;
      return {
        id: fields.campaign_id,
        goal: Number(fields.goal),
        deadline: Number(fields.deadline),
        owner: fields.owner,
      };
    });

    return campaigns;
  } catch (err) {
    console.error("❌ Error fetching campaigns:", err);
    return [];
  }
}
