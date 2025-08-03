
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Postactivity 
export const PostactivityRowMutations = {

  //dope  _campaigns_post_title_active_campaign column to the response
  _campaigns_post_title_active_campaign : async (row)=>{

    const data_res = await mosyQddata("campaigns", "record_id", row.active_campaign);
    return data_res?.post_title ?? row.active_campaign;

  },

  
  //dope audience column to the response              
  audience: async (row) => {

    const data_res = await mosyCountRows("audience", `where demographic ='${row?.platform_target}'`);

    return data_res;

  },

  
  //dope posts column to the response              
  posts: async (row) => {

    const data_res = await mosyCountRows("posting_activity", `where task_id ='${row?.record_id}'`);

    return data_res;

  },

  //dope  _advert_agents_agent_name_agent_name column to the response
  _advert_agents_agent_name_agent_name : async (row)=>{

    const data_res = await mosyQddata("advert_agents", "record_id", row.agent_name);
    return data_res?.agent_name ?? row.agent_name;

  },

  //dope  _audience_demographic_platform_target column to the response
  _audience_demographic_platform_target : async (row)=>{

    const data_res = await mosyQddata("audience", "demographic", row.platform_target);
    return data_res?.demographic ?? row.platform_target;

  },

  //dope  _audience_pagename_active_market column to the response
  _audience_pagename_active_market : async (row)=>{

    const data_res = await mosyQddata("audience", "record_id", row.active_market);
    return data_res?.pagename ?? row.active_market;

  }
}
