
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Postingactivity 
export const PostingactivityRowMutations = {

  //dope  _audience_pagename_market_name column to the response
  _audience_pagename_market_name : async (row)=>{

    const data_res = await mosyQddata("audience", "record_id", row.market_name);
    return data_res?.pagename ?? row.market_name;

  },

  //dope  _campaigns_post_title_campaign_id column to the response
  _campaigns_post_title_campaign_id : async (row)=>{

    const data_res = await mosyQddata("campaigns", "record_id", row.campaign_id);
    return data_res?.post_title ?? row.campaign_id;

  }
}
