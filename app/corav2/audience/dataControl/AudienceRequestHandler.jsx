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
export async function insertAudience() {
 //console.log(`Form audience insert sent `)

  return await mosyPostFormData({
    formId: 'audience_profile_form',
    url: '/api/corav2/audience/audience',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateAudience() {

  //console.log(`Form audience update sent `)

  return await mosyPostFormData({
    formId: 'audience_profile_form',
    url: '/api/corav2/audience/audience',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateAudienceFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('audience_mosy_action');
 
 //console.log(`Form audience submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_audience') {

      actionMessage ='Record added succesfully!';

      result = await insertAudience();
    }

    if (actionType === 'update_audience') {

      actionMessage ='Record updated succesfully!';

      result = await updateAudience();
    }

    if (result?.status === 'success') {
      
      const audienceUptoken = btoa(result.audience_uptoken || '');

      //set id key
      setters.setAudienceUptoken(audienceUptoken);
      
      //update url with new audienceUptoken
      mosyUpdateUrlParam('audience_uptoken', audienceUptoken)

      setters.setAudienceActionStatus('update_audience')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: audienceUptoken,
        actionName : actionType,
        actionType : 'audience_form_submission'
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


export async function initAudienceProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Audience' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/corav2/audience/audience',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initAudienceProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('audience Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching audience data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteAudience(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/corav2/audience/delete',
        params: { 
          _audience_delete_record: (token), 
          },
      });

      console.log('Token DeleteAudience '+token)
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


export async function getAudienceListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
     
  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qaudience_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/corav2/audience/audience',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qaudience_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getAudienceListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('audience Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching audience data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadAudienceListData(customQueryStr, setters) {

    const gftAudience = MosyFilterEngine('audience', true);
    let finalFilterStr = btoa(gftAudience);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setAudienceLoading(true);
    
    const audienceListData = await getAudienceListData(finalFilterStr);
    
    setters.setAudienceLoading(false)
    setters.setAudienceListData(audienceListData?.data)

    setters.setAudienceListPageCount(audienceListData?.page_count)


    return audienceListData

}
  
  
export async function audienceProfileData(customQueryStr, setters, router, customProfileData={}) {

    const audienceTokenId = mosyUrlParam('audience_uptoken');
    
    const deleteParam = mosyUrlParam('audience_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedAudienceToken = '0';
    if (audienceTokenId) {
      
      decodedAudienceToken = atob(audienceTokenId); // Decode the record_id
      setters.setAudienceUptoken(audienceTokenId);
      setters.setAudienceActionStatus('update_audience');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawAudienceQueryStr =`where primkey ='${decodedAudienceToken}'`
    if(customQueryStr!='')
    {
      // if no audience_uptoken set , use customQueryStr
      if (!audienceTokenId) {
       rawAudienceQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initAudienceProfileData(rawAudienceQueryStr)

    if(deleteParam){
      popDeleteDialog(audienceTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setAudienceNode(finalProfileData)
    
    
}
  
  

export function InteprateAudienceEvent(data) {
     
  //console.log('🎯 Audience Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_audience){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setAudienceCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('AudienceProfileTray')

    
    mosyUpdateUrlParam('audience_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_audience){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add audience `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('AudienceProfileTray')
      }
    }
     
  }

  if(childActionName.update_audience){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update audience `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('AudienceProfileTray')
        
      }
    }
  }

  if(childActionName.delete_audience){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../audience/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteAudience(deleteToken).then(data=>{
  
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
       deleteUrlParam('audience_delete');
        
    }
  
  });

}