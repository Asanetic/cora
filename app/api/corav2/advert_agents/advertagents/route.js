
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {AdvertagentsRowMutations} from './AdvertagentsRowMutations';

import listAdvertagentsRowMutationsKeys from './AdvertagentsMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddAdvertagents, UpdateAdvertagents } from './AdvertagentsDbGateway';


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
      tbl: 'advert_agents',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('advert_agents', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('advert_agents', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listAdvertagentsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, AdvertagentsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Advertagents data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Advertagents failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(AdvertagentsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = AdvertagentsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await AdvertagentsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await AdvertagentsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(AdvertagentsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const AdvertagentsFormAction = body.advert_agents_mosy_action;
    const advert_agents_uptoken_value = base64Decode(body.advert_agents_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  advert_agents inputs array ---// 
  const AdvertagentsInputsArr = {

    "agent_name" : "?", 
    "platform" : "?", 
    "agent_lastseen" : "?", 
    "current_task" : "?", 
    "config_info" : "?", 

  };

  //--- End advert_agents inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('advert_agents',AdvertagentsInputsArr, AdvertagentsRequest, newId, authData)

    if (AdvertagentsFormAction === "add_advert_agents") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Advertagents
      const result = await AddAdvertagents(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        advert_agents_uptoken: result.record_id
      });
      
    }
    
    if (AdvertagentsFormAction === "update_advert_agents") {
      
      // update table Advertagents
      const result = await UpdateAdvertagents(newId, mutatedDataArray, body, authData, `primkey='${advert_agents_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        advert_agents_uptoken: advert_agents_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${AdvertagentsFormAction}`
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