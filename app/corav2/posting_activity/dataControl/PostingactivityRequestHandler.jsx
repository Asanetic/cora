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
export async function insertPostingactivity() {
 //console.log(`Form posting_activity insert sent `)

  return await mosyPostFormData({
    formId: 'posting_activity_profile_form',
    url: '/api/corav2/posting_activity/postingactivity',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updatePostingactivity() {

  //console.log(`Form posting_activity update sent `)

  return await mosyPostFormData({
    formId: 'posting_activity_profile_form',
    url: '/api/corav2/posting_activity/postingactivity',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function intepratePostingactivityFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('posting_activity_mosy_action');
 
 //console.log(`Form posting_activity submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_posting_activity') {

      actionMessage ='Record added succesfully!';

      result = await insertPostingactivity();
    }

    if (actionType === 'update_posting_activity') {

      actionMessage ='Record updated succesfully!';

      result = await updatePostingactivity();
    }

    if (result?.status === 'success') {
      
      const posting_activityUptoken = btoa(result.posting_activity_uptoken || '');

      //set id key
      setters.setPostingactivityUptoken(posting_activityUptoken);
      
      //update url with new posting_activityUptoken
      mosyUpdateUrlParam('posting_activity_uptoken', posting_activityUptoken)

      setters.setPostingactivityActionStatus('update_posting_activity')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: posting_activityUptoken,
        actionName : actionType,
        actionType : 'posting_activity_form_submission'
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


export async function initPostingactivityProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _audience_pagename_market_name : [],
          
    _campaigns_post_title_campaign_id : [],

  }
  

  MosyNotify({message : 'Refreshing Posting Activity' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/corav2/posting_activity/postingactivity',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initPostingactivityProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('posting_activity Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching posting_activity data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeletePostingactivity(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/corav2/posting_activity/delete',
        params: { 
          _posting_activity_delete_record: (token), 
          },
      });

      console.log('Token DeletePostingactivity '+token)
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


export async function getPostingactivityListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
               
    _audience_pagename_market_name : [],
          
    _campaigns_post_title_campaign_id : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qposting_activity_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/corav2/posting_activity/postingactivity',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qposting_activity_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getPostingactivityListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('posting_activity Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching posting_activity data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadPostingactivityListData(customQueryStr, setters) {

    const gftPostingactivity = MosyFilterEngine('posting_activity', true);
    let finalFilterStr = btoa(gftPostingactivity);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setPostingactivityLoading(true);
    
    const postingactivityListData = await getPostingactivityListData(finalFilterStr);
    
    setters.setPostingactivityLoading(false)
    setters.setPostingactivityListData(postingactivityListData?.data)

    setters.setPostingactivityListPageCount(postingactivityListData?.page_count)


    return postingactivityListData

}
  
  
export async function postingactivityProfileData(customQueryStr, setters, router, customProfileData={}) {

    const postingactivityTokenId = mosyUrlParam('posting_activity_uptoken');
    
    const deleteParam = mosyUrlParam('posting_activity_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedPostingactivityToken = '0';
    if (postingactivityTokenId) {
      
      decodedPostingactivityToken = atob(postingactivityTokenId); // Decode the record_id
      setters.setPostingactivityUptoken(postingactivityTokenId);
      setters.setPostingactivityActionStatus('update_posting_activity');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawPostingactivityQueryStr =`where primkey ='${decodedPostingactivityToken}'`
    if(customQueryStr!='')
    {
      // if no posting_activity_uptoken set , use customQueryStr
      if (!postingactivityTokenId) {
       rawPostingactivityQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initPostingactivityProfileData(rawPostingactivityQueryStr)

    if(deleteParam){
      popDeleteDialog(postingactivityTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setPostingactivityNode(finalProfileData)
    
    
}
  
  

export function IntepratePostingactivityEvent(data) {
     
  //console.log('🎯 Postingactivity Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_posting_activity){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setPostingactivityCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('PostingactivityProfileTray')

    
    mosyUpdateUrlParam('posting_activity_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_posting_activity){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add posting_activity `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('PostingactivityProfileTray')
      }
    }
     
  }

  if(childActionName.update_posting_activity){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update posting_activity `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('PostingactivityProfileTray')
        
      }
    }
  }

  if(childActionName.delete_posting_activity){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../posting_activity/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeletePostingactivity(deleteToken).then(data=>{
  
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
       deleteUrlParam('posting_activity_delete');
        
    }
  
  });

}