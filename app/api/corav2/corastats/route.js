import { magicRandomStr, mosyRightNow, mosySqlInsert } from '../../apiUtils/dataControl/dataUtils';

// CORS headers for universal access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Handle preflight (CORS)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function POST(req) {
       const body = await req.json();

  try {
   

   const asset = body.scriptData?.coraasset || "N/A"
   const marketId = body.urlData?.ma || "N/A"
   const campId = body.urlData?.campId || "N/A"
   const taskId = body.urlData?.tid || "N/A"

   const visitor_code =body.visitorId || magicRandomStr(10)
   const pagevisited =body.pagevisited || ""

   const title = body?.title || ""
   const url = body?.url || ""
   const referer = body.referer || ""
   const host =body.host || ""
   const scriptData= body.scriptData || ""
   const urlData = body.urlData || ""
   const userAgent = body.userAgent || ""
   const platform = body.platform || ""


  //--- Begin  visitors_log inputs array ---// 
  const VisitorslogInputsArr = {

    "record_id":magicRandomStr(10),
    "visitdate" : mosyRightNow(), 
    "asset" : asset,
    "visitor_code" : visitor_code, 
    "pagevisited" : title, 
    "taskid" : taskId, 
    "market_id" : marketId, 
    "camp_id" : campId, 
    "sourcename" : host, 
    "device" : platform, 
    "sourceurl" : referer , 
    "visitedurl" : url, 
    "script_data" : scriptData, 
    "url_data" : body, 

  };

  //--- End visitors_log inputs array --//

   await mosySqlInsert("visitors_log",VisitorslogInputsArr)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: `${err}`, req : req }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

