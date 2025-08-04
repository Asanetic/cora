import { magicRandomStr, mosyCountRows, mosySqlInsert } from "../../apiUtils/dataControl/dataUtils";

export async function OPTIONS(req) {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  
  export async function POST(req) {
    const body = await req.json();
  
    const { url, title, site_class, parent_site, timestamp } = body;
  
    console.log("📦 Received from extension:");
    console.log({ url, title, site_class, parent_site, timestamp });
  
    // You can save to a DB here (e.g. MongoDB, Supabase, SQLite...)
    const audienceInputsArr = {
        "record_id":magicRandomStr(10),
        "pagename" : title, 
        "pageurl" : url, 
        "parent_site" :parent_site, 
        "demographic" : site_class, 
        "remark" : "Extension call", 
    
      };
    
    const duplicateUrl = await mosyCountRows("audience",`where pageurl='${url}'`)
    
    let retMsg= `Url exists ${duplicateUrl}`

    if(Number(duplicateUrl)==0){  
     await mosySqlInsert("audience", audienceInputsArr,body)
     retMsg= "Url added"
    }

    return new Response(JSON.stringify({ message: retMsg }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
  
  export async function GET(req) {
    return new Response(
      JSON.stringify({ message: "Snatcher API is live!" }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
  