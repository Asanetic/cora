'use client';
//hive / data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//action modals 
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//filter util
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';


//insert data
export async function insertCampaigns() {
 //console.log(`Form campaigns insert sent `)

  return await mosyPostFormData({
    formId: 'campaigns_profile_form',
    url: '/api/corav2/campaigns/campaigns',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateCampaigns() {

  //console.log(`Form campaigns update sent `)

  return await mosyPostFormData({
    formId: 'campaigns_profile_form',
    url: '/api/corav2/campaigns/campaigns',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateCampaignsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('campaigns_mosy_action');
 
 //console.log(`Form campaigns submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_campaigns') {

      actionMessage ='Record added succesfully!';

      result = await insertCampaigns();
    }

    if (actionType === 'update_campaigns') {

      actionMessage ='Record updated succesfully!';

      result = await updateCampaigns();
    }

    if (result?.status === 'success') {
      
      const campaignsUptoken = btoa(result.campaigns_uptoken || '');

      //set id key
      setters.setCampaignsUptoken(campaignsUptoken);
      
      //update url with new campaignsUptoken
      mosyUpdateUrlParam('campaigns_uptoken', campaignsUptoken)

      setters.setCampaignsActionStatus('update_campaigns')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: campaignsUptoken,
        actionName : actionType,
        actionType : 'campaigns_form_submission'
      };
            
      
    } else {
      MosyNotify({message:"A small error occured. Kindly try again", iconColor :'text-danger'})
      
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
    }

  } catch (error) {
    console.error('Form error:', error);
    
    MosyNotify({message:`A small error occured.  ${error}`, iconColor :'text-danger'})
    
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
  } 
}


export async function initCampaignsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _landing_pages_site_title_landing_page : [],
          
    _audience_pagename_target_market : [],

  }
  

  MosyNotify({message : 'Refreshing Campaigns' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/corav2/campaigns/campaigns',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initCampaignsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('campaigns Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching campaigns data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteCampaigns(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/corav2/campaigns/delete',
        params: { 
          _campaigns_delete_record: (token), 
          },
      });

      console.log('Token DeleteCampaigns '+token)
      if (response.status === 'success') {

        closeMosyModal();

        return response.data; // ✅ Return the data
      } else {
        console.error('Error deleting systemusers data:', response.message);
        closeMosyModal();
        
        return []; // Safe fallback
      }
    } catch (err) {
      console.error('Error:', err);
      closeMosyModal();
      
      return []; //  Even safer fallback
    }

}


export async function getCampaignsListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
               
    _landing_pages_site_title_landing_page : [],
          
    _audience_pagename_target_market : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qcampaigns_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/corav2/campaigns/campaigns',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qcampaigns_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getCampaignsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('campaigns Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching campaigns data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadCampaignsListData(customQueryStr, setters) {

    const gftCampaigns = MosyFilterEngine('campaigns', true);
    let finalFilterStr = btoa(gftCampaigns);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setCampaignsLoading(true);
    
    const campaignsListData = await getCampaignsListData(finalFilterStr);
    
    setters.setCampaignsLoading(false)
    setters.setCampaignsListData(campaignsListData?.data)

    setters.setCampaignsListPageCount(campaignsListData?.page_count)


    return campaignsListData

}
  
  
export async function campaignsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const campaignsTokenId = mosyUrlParam('campaigns_uptoken');
    
    const deleteParam = mosyUrlParam('campaigns_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedCampaignsToken = '0';
    if (campaignsTokenId) {
      
      decodedCampaignsToken = atob(campaignsTokenId); // Decode the record_id
      setters.setCampaignsUptoken(campaignsTokenId);
      setters.setCampaignsActionStatus('update_campaigns');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawCampaignsQueryStr =`where primkey ='${decodedCampaignsToken}'`
    if(customQueryStr!='')
    {
      // if no campaigns_uptoken set , use customQueryStr
      if (!campaignsTokenId) {
       rawCampaignsQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initCampaignsProfileData(rawCampaignsQueryStr)

    if(deleteParam){
      popDeleteDialog(campaignsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setCampaignsNode(finalProfileData)
    
    
}
  
  

export function InteprateCampaignsEvent(data) {
     
  //console.log('🎯 Campaigns Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_campaigns){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setCampaignsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('CampaignsProfileTray')

    
    mosyUpdateUrlParam('campaigns_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_campaigns){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add campaigns `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('CampaignsProfileTray')
      }
    }
     
  }

  if(childActionName.update_campaigns){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update campaigns `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('CampaignsProfileTray')
        
      }
    }
  }

  if(childActionName.delete_campaigns){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../campaigns/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteCampaigns(deleteToken).then(data=>{
  
        childSetters?.setSnackMessage("Record deleted succesfully!")
        childSetters?.setParentUseEffectKey(magicRandomStr());
        childSetters?.setLocalEventSignature(magicRandomStr());

        if(router){
          router.push(`${afterDeleteUrl}?snack_alert=Record Deleted successfully!`)
        }
                  
      })
  
    },
  
    onNo: () => {
  
      // Remove the param from the URL
       closeMosyModal()
       deleteUrlParam('campaigns_delete');
        
    }
  
  });

}