"use server";

import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TESTNET_COUNTER_PACKAGE_ID } from "../constants";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

// Define a type for campaigns
export interface Campaign {
  id: string;
  goal: number;
  deadline: number;
  owner: string;
  admin: string;
  totalRaised: number;
  isActive: boolean;
  name: string;
  description: string;
  canClaim?: boolean;
  canRefund?: boolean;
  canRequestRefund?: boolean;
}

// Inside fetchUserCampaigns
export async function fetchUserCampaigns(userAddress: string) {
  try {
    const response = await client.queryEvents({
      query: {
        MoveEventType: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::CampaignCreated`,
      },
    });

    const campaigns: Campaign[] = await Promise.all(
      response.data.map(async (evt: any) => {
        const fields = evt.parsedJson;
        const id = fields.campaign_id;

        const obj = await client.getObject({
          id,
          options: { showContent: true },
        });

        let objFields: any = {};
        if (obj.data?.content?.dataType === "moveObject") {
          objFields = (obj.data.content as any).fields;
        }

        const campaign: Campaign = {
          id,
          goal: Number(objFields.goal ?? 0),
          deadline: Number(objFields.deadline ?? 0),
          owner: objFields.owner ?? "",
          admin: objFields.admin ?? "",
          totalRaised: Number(objFields.total_raised ?? 0),
          isActive: objFields.is_active ?? true,
          name: objFields.name || "Untitled Campaign",
          description: objFields.description || "No description provided.",
        };

        return {
          ...campaign,
          canClaim:
            campaign.owner === userAddress &&
            campaign.totalRaised >= campaign.goal &&
            campaign.isActive,
          canRefund:
            campaign.admin === userAddress &&
            campaign.totalRaised < campaign.goal &&
            campaign.isActive,
          canRequestRefund:
            campaign.totalRaised < campaign.goal && !campaign.isActive,
        };
      })
    );

    // classify
    const adminCampaigns: Campaign[] = campaigns.filter(
      (c) => c.admin === userAddress
    );
    const ownerCampaigns: Campaign[] = campaigns.filter(
      (c) => c.owner === userAddress
    );
    const contributorCampaigns: Campaign[] = []; // later will be filled

    return { adminCampaigns, ownerCampaigns, contributorCampaigns };
  } catch (err) {
    console.error("❌ Error fetching user campaigns:", err);
    return { adminCampaigns: [], ownerCampaigns: [], contributorCampaigns: [] };
  }
}
