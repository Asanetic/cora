import { magicRandomStr, mosyFlexQuickSel, mosyRightNow, mosySqlUpdate } from "../apiUtils/dataControl/dataUtils";
import { AddPostingactivity } from "./posting_activity/postingactivity/PostingactivityDbGateway";
import {UpdatePostactivity} from './advert_tasktray/postactivity/PostactivityDbGateway';

export function appendParamsToUrl(baseUrl, params) {
    const url = new URL(baseUrl); // handles relative URLs too
  
    for (const key in params) {
      url.searchParams.set(key, params[key]);
    }
  
    return url.toString();
  }
  

  export async function nextTaskMarket({ taskId, mkId, campaignId, landingPageId, mkturl, post_status, screenshotPath, mktype }) {

    //add_task
    const relativeScreenShotPath = screenshotPath?.replace(/^storage\//, '') || '';

      //--- Begin  posting_activity inputs array ---// 
  const PostingactivityInputsArr = {
    "record_id":magicRandomStr(10),
    "url" : mkturl || '', 
    "market_name" : mkId, 
    "campaign_id" : campaignId, 
    "task_id" : taskId, 
    "dateposted" : mosyRightNow(), 
    "posted_status" : post_status, 
    "landing_page" : landingPageId, 
    "screen_shot" : relativeScreenShotPath, 

  };
  console.log(`notPostedMarket PostingactivityInputsArr`, PostingactivityInputsArr)

  if(mkturl!=""){
   await AddPostingactivity("", PostingactivityInputsArr)
  }
   //update next market
   const notPostedMarket = await mosyFlexQuickSel("audience","*", `   WHERE demographic = '${mktype}'
     AND record_id NOT IN (
       SELECT market_name 
       FROM posting_activity 
       WHERE task_id = '${taskId}'
     )`,"r")

     const nextId = notPostedMarket?.record_id || "Finished"

     console.log(`notPostedMarket`, notPostedMarket)

     await mosySqlUpdate("advert_tasktray", {"active_market":nextId}, {}, `record_id='${taskId}'`);


        return true 

  }