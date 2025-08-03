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
export async function insertVisitorslog() {
 //console.log(`Form visitors_log insert sent `)

  return await mosyPostFormData({
    formId: 'visitors_log_profile_form',
    url: '/api/corav2/visitors_log/visitorslog',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateVisitorslog() {

  //console.log(`Form visitors_log update sent `)

  return await mosyPostFormData({
    formId: 'visitors_log_profile_form',
    url: '/api/corav2/visitors_log/visitorslog',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateVisitorslogFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('visitors_log_mosy_action');
 
 //console.log(`Form visitors_log submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_visitors_log') {

      actionMessage ='Record added succesfully!';

      result = await insertVisitorslog();
    }

    if (actionType === 'update_visitors_log') {

      actionMessage ='Record updated succesfully!';

      result = await updateVisitorslog();
    }

    if (result?.status === 'success') {
      
      const visitors_logUptoken = btoa(result.visitors_log_uptoken || '');

      //set id key
      setters.setVisitorslogUptoken(visitors_logUptoken);
      
      //update url with new visitors_logUptoken
      mosyUpdateUrlParam('visitors_log_uptoken', visitors_logUptoken)

      setters.setVisitorslogActionStatus('update_visitors_log')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: visitors_logUptoken,
        actionName : actionType,
        actionType : 'visitors_log_form_submission'
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


export async function initVisitorslogProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Visitors Log' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/corav2/visitors_log/visitorslog',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initVisitorslogProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('visitors_log Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching visitors_log data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteVisitorslog(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/corav2/visitors_log/delete',
        params: { 
          _visitors_log_delete_record: (token), 
          },
      });

      console.log('Token DeleteVisitorslog '+token)
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


export async function getVisitorslogListData(qstr = "") {
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
  const pageNo = mosyUrlParam('qvisitors_log_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/corav2/visitors_log/visitorslog',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qvisitors_log_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getVisitorslogListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('visitors_log Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching visitors_log data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadVisitorslogListData(customQueryStr, setters) {

    const gftVisitorslog = MosyFilterEngine('visitors_log', true);
    let finalFilterStr = btoa(gftVisitorslog);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setVisitorslogLoading(true);
    
    const visitorslogListData = await getVisitorslogListData(finalFilterStr);
    
    setters.setVisitorslogLoading(false)
    setters.setVisitorslogListData(visitorslogListData?.data)

    setters.setVisitorslogListPageCount(visitorslogListData?.page_count)


    return visitorslogListData

}
  
  
export async function visitorslogProfileData(customQueryStr, setters, router, customProfileData={}) {

    const visitorslogTokenId = mosyUrlParam('visitors_log_uptoken');
    
    const deleteParam = mosyUrlParam('visitors_log_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedVisitorslogToken = '0';
    if (visitorslogTokenId) {
      
      decodedVisitorslogToken = atob(visitorslogTokenId); // Decode the record_id
      setters.setVisitorslogUptoken(visitorslogTokenId);
      setters.setVisitorslogActionStatus('update_visitors_log');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawVisitorslogQueryStr =`where primkey ='${decodedVisitorslogToken}'`
    if(customQueryStr!='')
    {
      // if no visitors_log_uptoken set , use customQueryStr
      if (!visitorslogTokenId) {
       rawVisitorslogQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initVisitorslogProfileData(rawVisitorslogQueryStr)

    if(deleteParam){
      popDeleteDialog(visitorslogTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setVisitorslogNode(finalProfileData)
    
    
}
  
  

export function InteprateVisitorslogEvent(data) {
     
  //console.log('🎯 Visitorslog Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_visitors_log){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setVisitorslogCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('VisitorslogProfileTray')

    
    mosyUpdateUrlParam('visitors_log_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_visitors_log){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add visitors_log `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('VisitorslogProfileTray')
      }
    }
     
  }

  if(childActionName.update_visitors_log){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update visitors_log `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('VisitorslogProfileTray')
        
      }
    }
  }

  if(childActionName.delete_visitors_log){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../visitors_log/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteVisitorslog(deleteToken).then(data=>{
  
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
       deleteUrlParam('visitors_log_delete');
        
    }
  
  });

}