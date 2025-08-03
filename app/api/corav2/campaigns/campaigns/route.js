
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {CampaignsRowMutations} from './CampaignsRowMutations';

import listCampaignsRowMutationsKeys from './CampaignsMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddCampaigns, UpdateCampaigns } from './CampaignsDbGateway';


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
      tbl: 'campaigns',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('campaigns', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('campaigns', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listCampaignsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, CampaignsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Campaigns data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Campaigns failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(CampaignsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = CampaignsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await CampaignsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await CampaignsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(CampaignsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const CampaignsFormAction = body.campaigns_mosy_action;
    const campaigns_uptoken_value = base64Decode(body.campaigns_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  campaigns inputs array ---// 
  const CampaignsInputsArr = {

    "post_title" : "?", 
    "landing_page" : "?", 
    "target_market" : "?", 
    "campaign_type" : "?", 
    "post_status" : "?", 
    "ab_testing" : "?", 
    "post_content" : "?", 
    "post_image" : "?", 
    "date_posted" : "?", 

  };

  //--- End campaigns inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('campaigns',CampaignsInputsArr, CampaignsRequest, newId, authData)

    if (CampaignsFormAction === "add_campaigns") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Campaigns
      const result = await AddCampaigns(newId, mutatedDataArray, body, authData);     

       
                // Now handle the file upload for post_image, if any
                if (body.txt_campaigns_post_image) {
                  if(body["txt_campaigns_post_image"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "txt_campaigns_post_image"], "media/campaigns");
                    
                    CampaignsInputsArr.post_image = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateCampaigns(newId, { post_image: filePath }, body, authData,  `primkey='${result.record_id}'`)
                    
                    let fileToDelete = body.media_campaigns_post_image;
                      
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
        campaigns_uptoken: result.record_id
      });
      
    }
    
    if (CampaignsFormAction === "update_campaigns") {
      
      // update table Campaigns
      const result = await UpdateCampaigns(newId, mutatedDataArray, body, authData, `primkey='${campaigns_uptoken_value}'`)

      
                // Now handle the file upload for post_image, if any
                if (body.txt_campaigns_post_image) {
                  if(body["txt_campaigns_post_image"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "txt_campaigns_post_image"], "media/campaigns");
                    
                    CampaignsInputsArr.post_image = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateCampaigns(newId, { post_image: filePath }, body, authData,  `primkey='${campaigns_uptoken_value}'`)
                    
                    let fileToDelete = body.media_campaigns_post_image;
                      
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
        campaigns_uptoken: campaigns_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${CampaignsFormAction}`
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