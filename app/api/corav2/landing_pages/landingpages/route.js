
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {LandingpagesRowMutations} from './LandingpagesRowMutations';

import listLandingpagesRowMutationsKeys from './LandingpagesMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddLandingpages, UpdateLandingpages } from './LandingpagesDbGateway';


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
      tbl: 'landing_pages',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('landing_pages', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('landing_pages', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listLandingpagesRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, LandingpagesRowMutations);

      return Response.json({
        status: 'success',
        message: 'Landingpages data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Landingpages failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(LandingpagesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = LandingpagesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await LandingpagesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await LandingpagesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(LandingpagesRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const LandingpagesFormAction = body.landing_pages_mosy_action;
    const landing_pages_uptoken_value = base64Decode(body.landing_pages_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  landing_pages inputs array ---// 
  const LandingpagesInputsArr = {

    "site_title" : "?", 
    "url" : "?", 
    "description" : "?", 
    "page_photo" : "?", 

  };

  //--- End landing_pages inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('landing_pages',LandingpagesInputsArr, LandingpagesRequest, newId, authData)

    if (LandingpagesFormAction === "add_landing_pages") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Landingpages
      const result = await AddLandingpages(newId, mutatedDataArray, body, authData);     

       
                // Now handle the file upload for page_photo, if any
                if (body.txt_landing_pages_page_photo) {
                  if(body["txt_landing_pages_page_photo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "txt_landing_pages_page_photo"], "media/landing_pages");
                    
                    LandingpagesInputsArr.page_photo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateLandingpages(newId, { page_photo: filePath }, body, authData,  `primkey='${result.record_id}'`)
                    
                    let fileToDelete = body.media_landing_pages_page_photo;
                      
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
        landing_pages_uptoken: result.record_id
      });
      
    }
    
    if (LandingpagesFormAction === "update_landing_pages") {
      
      // update table Landingpages
      const result = await UpdateLandingpages(newId, mutatedDataArray, body, authData, `primkey='${landing_pages_uptoken_value}'`)

      
                // Now handle the file upload for page_photo, if any
                if (body.txt_landing_pages_page_photo) {
                  if(body["txt_landing_pages_page_photo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "txt_landing_pages_page_photo"], "media/landing_pages");
                    
                    LandingpagesInputsArr.page_photo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateLandingpages(newId, { page_photo: filePath }, body, authData,  `primkey='${landing_pages_uptoken_value}'`)
                    
                    let fileToDelete = body.media_landing_pages_page_photo;
                      
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
        landing_pages_uptoken: landing_pages_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${LandingpagesFormAction}`
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