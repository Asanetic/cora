
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {VisitorslogRowMutations} from './VisitorslogRowMutations';

import listVisitorslogRowMutationsKeys from './VisitorslogMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddVisitorslog, UpdateVisitorslog } from './VisitorslogDbGateway';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const encodedMutations = searchParams.get('mutations');

    let requestedMutationsObj = {};
    if (encodedMutations) {
      try {
        const decodedMutations = Buffer.from(encodedMutations, 'base64').toString('utf-8');
        requestedMutationsObj = JSON.parse(decodedMutations);
      } catch (err) {
        console.error('Mutation decode failed:', err);
      }
    }

    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    

    // ✅ Provide default fallbacks
    const enhancedParams = {
      tbl: 'visitors_log',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('visitors_log', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('visitors_log', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listVisitorslogRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, VisitorslogRowMutations);

      return Response.json({
        status: 'success',
        message: 'Visitorslog data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Visitorslog failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(VisitorslogRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = VisitorslogRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await VisitorslogRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await VisitorslogRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(VisitorslogRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const VisitorslogFormAction = body.visitors_log_mosy_action;
    const visitors_log_uptoken_value = base64Decode(body.visitors_log_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  visitors_log inputs array ---// 
  const VisitorslogInputsArr = {

    "visitdate" : "?", 
    "asset" : "?", 
    "visitor_code" : "?", 
    "pagevisited" : "?", 
    "taskid" : "?", 
    "market_id" : "?", 
    "camp_id" : "?", 
    "sourcename" : "?", 
    "device" : "?", 
    "sourceurl" : "?", 
    "visitedurl" : "?", 
    "script_data" : "?", 
    "url_data" : "?", 

  };

  //--- End visitors_log inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('visitors_log',VisitorslogInputsArr, VisitorslogRequest, newId, authData)

    if (VisitorslogFormAction === "add_visitors_log") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Visitorslog
      const result = await AddVisitorslog(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        visitors_log_uptoken: result.record_id
      });
      
    }
    
    if (VisitorslogFormAction === "update_visitors_log") {
      
      // update table Visitorslog
      const result = await UpdateVisitorslog(newId, mutatedDataArray, body, authData, `primkey='${visitors_log_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        visitors_log_uptoken: visitors_log_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${VisitorslogFormAction}`
    }, { status: 400 });

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}