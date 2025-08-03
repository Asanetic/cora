
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Campaigns 
export const CampaignsRowMutations = {

  //dope  _landing_pages_site_title_landing_page column to the response
  _landing_pages_site_title_landing_page : async (row)=>{

    const data_res = await mosyQddata("landing_pages", "record_id", row.landing_page);
    return data_res?.site_title ?? row.landing_page;

  },

  //dope  _audience_pagename_target_market column to the response
  _audience_pagename_target_market : async (row)=>{

    const data_res = await mosyQddata("audience", "record_id", row.target_market);
    return data_res?.pagename ?? row.target_market;

  }
}
