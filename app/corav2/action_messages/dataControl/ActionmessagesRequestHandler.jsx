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
export async function insertActionmessages() {
 //console.log(`Form action_messages insert sent `)

  return await mosyPostFormData({
    formId: 'action_messages_profile_form',
    url: '/api/corav2/action_messages/actionmessages',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateActionmessages() {

  //console.log(`Form action_messages update sent `)

  return await mosyPostFormData({
    formId: 'action_messages_profile_form',
    url: '/api/corav2/action_messages/actionmessages',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateActionmessagesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('action_messages_mosy_action');
 
 //console.log(`Form action_messages submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_action_messages') {

      actionMessage ='Record added succesfully!';

      result = await insertActionmessages();
    }

    if (actionType === 'update_action_messages') {

      actionMessage ='Record updated succesfully!';

      result = await updateActionmessages();
    }

    if (result?.status === 'success') {
      
      const action_messagesUptoken = btoa(result.action_messages_uptoken || '');

      //set id key
      setters.setActionmessagesUptoken(action_messagesUptoken);
      
      //update url with new action_messagesUptoken
      mosyUpdateUrlParam('action_messages_uptoken', action_messagesUptoken)

      setters.setActionmessagesActionStatus('update_action_messages')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: action_messagesUptoken,
        actionName : actionType,
        actionType : 'action_messages_form_submission'
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


export async function initActionmessagesProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Action Messages' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/corav2/action_messages/actionmessages',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initActionmessagesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('action_messages Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching action_messages data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteActionmessages(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/corav2/action_messages/delete',
        params: { 
          _action_messages_delete_record: (token), 
          },
      });

      console.log('Token DeleteActionmessages '+token)
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


export async function getActionmessagesListData(qstr = "") {
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
  const pageNo = mosyUrlParam('qaction_messages_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/corav2/action_messages/actionmessages',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qaction_messages_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getActionmessagesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('action_messages Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching action_messages data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadActionmessagesListData(customQueryStr, setters) {

    const gftActionmessages = MosyFilterEngine('action_messages', true);
    let finalFilterStr = btoa(gftActionmessages);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setActionmessagesLoading(true);
    
    const actionmessagesListData = await getActionmessagesListData(finalFilterStr);
    
    setters.setActionmessagesLoading(false)
    setters.setActionmessagesListData(actionmessagesListData?.data)

    setters.setActionmessagesListPageCount(actionmessagesListData?.page_count)


    return actionmessagesListData

}
  
  
export async function actionmessagesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const actionmessagesTokenId = mosyUrlParam('action_messages_uptoken');
    
    const deleteParam = mosyUrlParam('action_messages_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedActionmessagesToken = '0';
    if (actionmessagesTokenId) {
      
      decodedActionmessagesToken = atob(actionmessagesTokenId); // Decode the record_id
      setters.setActionmessagesUptoken(actionmessagesTokenId);
      setters.setActionmessagesActionStatus('update_action_messages');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawActionmessagesQueryStr =`where primkey ='${decodedActionmessagesToken}'`
    if(customQueryStr!='')
    {
      // if no action_messages_uptoken set , use customQueryStr
      if (!actionmessagesTokenId) {
       rawActionmessagesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initActionmessagesProfileData(rawActionmessagesQueryStr)

    if(deleteParam){
      popDeleteDialog(actionmessagesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setActionmessagesNode(finalProfileData)
    
    
}
  
  

export function InteprateActionmessagesEvent(data) {
     
  //console.log('🎯 Actionmessages Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_action_messages){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setActionmessagesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('ActionmessagesProfileTray')

    
    mosyUpdateUrlParam('action_messages_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_action_messages){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add action_messages `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ActionmessagesProfileTray')
      }
    }
     
  }

  if(childActionName.update_action_messages){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update action_messages `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ActionmessagesProfileTray')
        
      }
    }
  }

  if(childActionName.delete_action_messages){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../action_messages/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteActionmessages(deleteToken).then(data=>{
  
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
       deleteUrlParam('action_messages_delete');
        
    }
  
  });

}