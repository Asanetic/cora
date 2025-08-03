
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {PostactivityRowMutations} from './PostactivityRowMutations';

import listPostactivityRowMutationsKeys from './PostactivityMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddPostactivity, UpdatePostactivity } from './PostactivityDbGateway';


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
      tbl: 'advert_tasktray',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('advert_tasktray', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('advert_tasktray', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listPostactivityRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, PostactivityRowMutations);

      return Response.json({
        status: 'success',
        message: 'Postactivity data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Postactivity failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(PostactivityRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = PostactivityRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await PostactivityRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await PostactivityRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(PostactivityRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const PostactivityFormAction = body.advert_tasktray_mosy_action;
    const advert_tasktray_uptoken_value = base64Decode(body.advert_tasktray_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  advert_tasktray inputs array ---// 
  const PostactivityInputsArr = {

    "task_name" : "?", 
    "active_campaign" : "?", 
    "task_status" : "?", 
    "headless" : "?", 
    "agent_name" : "?", 
    "platform_target" : "?", 
    "task_date" : "?", 
    "weekday" : "?", 
    "active_market" : "?", 
    "remark" : "?", 

  };

  //--- End advert_tasktray inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('advert_tasktray',PostactivityInputsArr, PostactivityRequest, newId, authData)

    if (PostactivityFormAction === "add_advert_tasktray") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Postactivity
      const result = await AddPostactivity(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        advert_tasktray_uptoken: result.record_id
      });
      
    }
    
    if (PostactivityFormAction === "update_advert_tasktray") {
      
      // update table Postactivity
      const result = await UpdatePostactivity(newId, mutatedDataArray, body, authData, `primkey='${advert_tasktray_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        advert_tasktray_uptoken: advert_tasktray_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${PostactivityFormAction}`
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