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
export async function insertPostactivity() {
 //console.log(`Form advert_tasktray insert sent `)

  return await mosyPostFormData({
    formId: 'advert_tasktray_profile_form',
    url: '/api/corav2/advert_tasktray/postactivity',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updatePostactivity() {

  //console.log(`Form advert_tasktray update sent `)

  return await mosyPostFormData({
    formId: 'advert_tasktray_profile_form',
    url: '/api/corav2/advert_tasktray/postactivity',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function intepratePostactivityFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('advert_tasktray_mosy_action');
 
 //console.log(`Form advert_tasktray submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_advert_tasktray') {

      actionMessage ='Record added succesfully!';

      result = await insertPostactivity();
    }

    if (actionType === 'update_advert_tasktray') {

      actionMessage ='Record updated succesfully!';

      result = await updatePostactivity();
    }

    if (result?.status === 'success') {
      
      const advert_tasktrayUptoken = btoa(result.advert_tasktray_uptoken || '');

      //set id key
      setters.setPostactivityUptoken(advert_tasktrayUptoken);
      
      //update url with new advert_tasktrayUptoken
      mosyUpdateUrlParam('advert_tasktray_uptoken', advert_tasktrayUptoken)

      setters.setPostactivityActionStatus('update_advert_tasktray')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: advert_tasktrayUptoken,
        actionName : actionType,
        actionType : 'advert_tasktray_form_submission'
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


export async function initPostactivityProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _campaigns_post_title_active_campaign : [],
    
    audience : [],
    
    posts : [],
          
    _advert_agents_agent_name_agent_name : [],
          
    _audience_demographic_platform_target : [],
          
    _audience_pagename_active_market : [],

  }
  

  MosyNotify({message : 'Refreshing Post activity' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/corav2/advert_tasktray/postactivity',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initPostactivityProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('advert_tasktray Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching advert_tasktray data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeletePostactivity(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/corav2/advert_tasktray/delete',
        params: { 
          _advert_tasktray_delete_record: (token), 
          },
      });

      console.log('Token DeletePostactivity '+token)
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


export async function getPostactivityListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
               
    _campaigns_post_title_active_campaign : [],
    
    audience : [],
    
    posts : [],
          
    _advert_agents_agent_name_agent_name : [],
          
    _audience_demographic_platform_target : [],
          
    _audience_pagename_active_market : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qadvert_tasktray_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/corav2/advert_tasktray/postactivity',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qadvert_tasktray_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getPostactivityListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('advert_tasktray Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching advert_tasktray data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadPostactivityListData(customQueryStr, setters) {

    const gftPostactivity = MosyFilterEngine('advert_tasktray', true);
    let finalFilterStr = btoa(gftPostactivity);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setPostactivityLoading(true);
    
    const postactivityListData = await getPostactivityListData(finalFilterStr);
    
    setters.setPostactivityLoading(false)
    setters.setPostactivityListData(postactivityListData?.data)

    setters.setPostactivityListPageCount(postactivityListData?.page_count)


    return postactivityListData

}
  
  
export async function postactivityProfileData(customQueryStr, setters, router, customProfileData={}) {

    const postactivityTokenId = mosyUrlParam('advert_tasktray_uptoken');
    
    const deleteParam = mosyUrlParam('advert_tasktray_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedPostactivityToken = '0';
    if (postactivityTokenId) {
      
      decodedPostactivityToken = atob(postactivityTokenId); // Decode the record_id
      setters.setPostactivityUptoken(postactivityTokenId);
      setters.setPostactivityActionStatus('update_advert_tasktray');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawPostactivityQueryStr =`where primkey ='${decodedPostactivityToken}'`
    if(customQueryStr!='')
    {
      // if no advert_tasktray_uptoken set , use customQueryStr
      if (!postactivityTokenId) {
       rawPostactivityQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initPostactivityProfileData(rawPostactivityQueryStr)

    if(deleteParam){
      popDeleteDialog(postactivityTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setPostactivityNode(finalProfileData)
    
    
}
  
  

export function IntepratePostactivityEvent(data) {
     
  //console.log('🎯 Postactivity Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_advert_tasktray){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setPostactivityCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('PostactivityProfileTray')

    
    mosyUpdateUrlParam('advert_tasktray_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_advert_tasktray){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add advert_tasktray `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('PostactivityProfileTray')
      }
    }
     
  }

  if(childActionName.update_advert_tasktray){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update advert_tasktray `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('PostactivityProfileTray')
        
      }
    }
  }

  if(childActionName.delete_advert_tasktray){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../advert_tasktray/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeletePostactivity(deleteToken).then(data=>{
  
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
       deleteUrlParam('advert_tasktray_delete');
        
    }
  
  });

}