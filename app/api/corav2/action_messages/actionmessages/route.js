
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {ActionmessagesRowMutations} from './ActionmessagesRowMutations';

import listActionmessagesRowMutationsKeys from './ActionmessagesMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddActionmessages, UpdateActionmessages } from './ActionmessagesDbGateway';


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
      tbl: 'action_messages',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('action_messages', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('action_messages', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listActionmessagesRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, ActionmessagesRowMutations);

      return Response.json({
        status: 'success',
        message: 'Actionmessages data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Actionmessages failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(ActionmessagesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = ActionmessagesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await ActionmessagesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await ActionmessagesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(ActionmessagesRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const ActionmessagesFormAction = body.action_messages_mosy_action;
    const action_messages_uptoken_value = base64Decode(body.action_messages_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  action_messages inputs array ---// 
  const ActionmessagesInputsArr = {

    "action" : "?", 
    "site_id" : "?", 

  };

  //--- End action_messages inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('action_messages',ActionmessagesInputsArr, ActionmessagesRequest, newId, authData)

    if (ActionmessagesFormAction === "add_action_messages") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Actionmessages
      const result = await AddActionmessages(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        action_messages_uptoken: result.record_id
      });
      
    }
    
    if (ActionmessagesFormAction === "update_action_messages") {
      
      // update table Actionmessages
      const result = await UpdateActionmessages(newId, mutatedDataArray, body, authData, `primkey='${action_messages_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        action_messages_uptoken: action_messages_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${ActionmessagesFormAction}`
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