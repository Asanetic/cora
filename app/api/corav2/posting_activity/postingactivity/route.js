
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {PostingactivityRowMutations} from './PostingactivityRowMutations';

import listPostingactivityRowMutationsKeys from './PostingactivityMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddPostingactivity, UpdatePostingactivity } from './PostingactivityDbGateway';


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
      tbl: 'posting_activity',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('posting_activity', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('posting_activity', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listPostingactivityRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, PostingactivityRowMutations);

      return Response.json({
        status: 'success',
        message: 'Postingactivity data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Postingactivity failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(PostingactivityRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = PostingactivityRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await PostingactivityRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await PostingactivityRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(PostingactivityRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const PostingactivityFormAction = body.posting_activity_mosy_action;
    const posting_activity_uptoken_value = base64Decode(body.posting_activity_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  posting_activity inputs array ---// 
  const PostingactivityInputsArr = {

    "screen_shot" : "?", 
    "posted_status" : "?", 
    "market_name" : "?", 
    "campaign_id" : "?", 
    "url" : "?", 
    "task_id" : "?", 
    "dateposted" : "?", 
    "landing_page" : "?", 

  };

  //--- End posting_activity inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('posting_activity',PostingactivityInputsArr, PostingactivityRequest, newId, authData)

    if (PostingactivityFormAction === "add_posting_activity") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Postingactivity
      const result = await AddPostingactivity(newId, mutatedDataArray, body, authData);     

       
                // Now handle the file upload for screen_shot, if any
                if (body.txt_posting_activity_screen_shot) {
                  if(body["txt_posting_activity_screen_shot"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "txt_posting_activity_screen_shot"], "media/posting_activity");
                    
                    PostingactivityInputsArr.screen_shot = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdatePostingactivity(newId, { screen_shot: filePath }, body, authData,  `primkey='${result.record_id}'`)
                    
                    let fileToDelete = body.media_posting_activity_screen_shot;
                      
                    //Delete file if need be

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        posting_activity_uptoken: result.record_id
      });
      
    }
    
    if (PostingactivityFormAction === "update_posting_activity") {
      
      // update table Postingactivity
      const result = await UpdatePostingactivity(newId, mutatedDataArray, body, authData, `primkey='${posting_activity_uptoken_value}'`)

      
                // Now handle the file upload for screen_shot, if any
                if (body.txt_posting_activity_screen_shot) {
                  if(body["txt_posting_activity_screen_shot"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "txt_posting_activity_screen_shot"], "media/posting_activity");
                    
                    PostingactivityInputsArr.screen_shot = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdatePostingactivity(newId, { screen_shot: filePath }, body, authData,  `primkey='${posting_activity_uptoken_value}'`)
                    
                    let fileToDelete = body.media_posting_activity_screen_shot;
                      
                    //Delete old file
mosyDeleteFile(fileToDelete);
// Log or store deleted file: fileToDelete

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        posting_activity_uptoken: posting_activity_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${PostingactivityFormAction}`
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