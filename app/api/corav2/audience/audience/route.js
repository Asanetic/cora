
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {AudienceRowMutations} from './AudienceRowMutations';

import listAudienceRowMutationsKeys from './AudienceMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddAudience, UpdateAudience } from './AudienceDbGateway';


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
      tbl: 'audience',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('audience', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('audience', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listAudienceRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, AudienceRowMutations);

      return Response.json({
        status: 'success',
        message: 'Audience data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Audience failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(AudienceRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = AudienceRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await AudienceRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await AudienceRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(AudienceRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const AudienceFormAction = body.audience_mosy_action;
    const audience_uptoken_value = base64Decode(body.audience_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  audience inputs array ---// 
  const AudienceInputsArr = {

    "pagename" : "?", 
    "pageurl" : "?", 
    "parent_site" : "?", 
    "demographic" : "?", 
    "remark" : "?", 

  };

  //--- End audience inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('audience',AudienceInputsArr, AudienceRequest, newId, authData)

    if (AudienceFormAction === "add_audience") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Audience
      const result = await AddAudience(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        audience_uptoken: result.record_id
      });
      
    }
    
    if (AudienceFormAction === "update_audience") {
      
      // update table Audience
      const result = await UpdateAudience(newId, mutatedDataArray, body, authData, `primkey='${audience_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        audience_uptoken: audience_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${AudienceFormAction}`
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