"use server";

import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TESTNET_COUNTER_PACKAGE_ID } from "../constants";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

export interface Contribution {
  contributor: string;
  amount: number;
  refunded: boolean;
}

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
  contributions: Contribution[];
  canClaim?: boolean;
  canRefund?: boolean;
  canRequestRefund?: boolean;
}

export async function fetchUserCampaigns(userAddress: string) {
  try {
    console.log("👤 Fetching campaigns for:", userAddress);

    const response = await client.queryEvents({
      query: {
        MoveEventType: `${TESTNET_COUNTER_PACKAGE_ID}::crowdfunding_app::CampaignCreated`,
      },
    });

    console.log("📦 Events found:", response.data.length);

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

        // 🔹 Contributions pueden venir como vector
        const contributions: Contribution[] =
          objFields.contributions?.map((c: any) => ({
            contributor: c.fields.contributor,
            amount: Number(c.fields.amount),
            refunded: c.fields.refunded,
          })) || [];

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
          contributions,
        };

        console.log("📝 Campaign loaded:", {
          id: campaign.id,
          owner: campaign.owner,
          totalRaised: campaign.totalRaised,
          contributions: campaign.contributions.length,
        });

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
    const adminCampaigns = campaigns.filter((c) => c.admin === userAddress);
    const ownerCampaigns = campaigns.filter((c) => c.owner === userAddress);

    // 🔹 ahora buscamos contribuidor
    const contributorCampaigns = campaigns.filter((c) =>
      c.contributions.some(
        (contrib) =>
          contrib.contributor.toLowerCase() === userAddress.toLowerCase()
      )
    );

    console.log("✅ Classification done:", {
      admins: adminCampaigns.length,
      owners: ownerCampaigns.length,
      contributors: contributorCampaigns.length,
    });

    return { adminCampaigns, ownerCampaigns, contributorCampaigns };
  } catch (err) {
    console.error("❌ Error fetching user campaigns:", err);
    return { adminCampaigns: [], ownerCampaigns: [], contributorCampaigns: [] };
  }
}
