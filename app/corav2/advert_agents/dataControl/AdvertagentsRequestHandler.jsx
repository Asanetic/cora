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
export async function insertAdvertagents() {
 //console.log(`Form advert_agents insert sent `)

  return await mosyPostFormData({
    formId: 'advert_agents_profile_form',
    url: '/api/corav2/advert_agents/advertagents',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateAdvertagents() {

  //console.log(`Form advert_agents update sent `)

  return await mosyPostFormData({
    formId: 'advert_agents_profile_form',
    url: '/api/corav2/advert_agents/advertagents',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateAdvertagentsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('advert_agents_mosy_action');
 
 //console.log(`Form advert_agents submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_advert_agents') {

      actionMessage ='Record added succesfully!';

      result = await insertAdvertagents();
    }

    if (actionType === 'update_advert_agents') {

      actionMessage ='Record updated succesfully!';

      result = await updateAdvertagents();
    }

    if (result?.status === 'success') {
      
      const advert_agentsUptoken = btoa(result.advert_agents_uptoken || '');

      //set id key
      setters.setAdvertagentsUptoken(advert_agentsUptoken);
      
      //update url with new advert_agentsUptoken
      mosyUpdateUrlParam('advert_agents_uptoken', advert_agentsUptoken)

      setters.setAdvertagentsActionStatus('update_advert_agents')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: advert_agentsUptoken,
        actionName : actionType,
        actionType : 'advert_agents_form_submission'
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


export async function initAdvertagentsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Advert Agents' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/corav2/advert_agents/advertagents',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initAdvertagentsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('advert_agents Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching advert_agents data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteAdvertagents(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/corav2/advert_agents/delete',
        params: { 
          _advert_agents_delete_record: (token), 
          },
      });

      console.log('Token DeleteAdvertagents '+token)
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


export async function getAdvertagentsListData(qstr = "") {
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
  const pageNo = mosyUrlParam('qadvert_agents_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/corav2/advert_agents/advertagents',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qadvert_agents_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getAdvertagentsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('advert_agents Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching advert_agents data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadAdvertagentsListData(customQueryStr, setters) {

    const gftAdvertagents = MosyFilterEngine('advert_agents', true);
    let finalFilterStr = btoa(gftAdvertagents);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setAdvertagentsLoading(true);
    
    const advertagentsListData = await getAdvertagentsListData(finalFilterStr);
    
    setters.setAdvertagentsLoading(false)
    setters.setAdvertagentsListData(advertagentsListData?.data)

    setters.setAdvertagentsListPageCount(advertagentsListData?.page_count)


    return advertagentsListData

}
  
  
export async function advertagentsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const advertagentsTokenId = mosyUrlParam('advert_agents_uptoken');
    
    const deleteParam = mosyUrlParam('advert_agents_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedAdvertagentsToken = '0';
    if (advertagentsTokenId) {
      
      decodedAdvertagentsToken = atob(advertagentsTokenId); // Decode the record_id
      setters.setAdvertagentsUptoken(advertagentsTokenId);
      setters.setAdvertagentsActionStatus('update_advert_agents');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawAdvertagentsQueryStr =`where primkey ='${decodedAdvertagentsToken}'`
    if(customQueryStr!='')
    {
      // if no advert_agents_uptoken set , use customQueryStr
      if (!advertagentsTokenId) {
       rawAdvertagentsQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initAdvertagentsProfileData(rawAdvertagentsQueryStr)

    if(deleteParam){
      popDeleteDialog(advertagentsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setAdvertagentsNode(finalProfileData)
    
    
}
  
  

export function InteprateAdvertagentsEvent(data) {
     
  //console.log('🎯 Advertagents Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_advert_agents){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setAdvertagentsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('AdvertagentsProfileTray')

    
    mosyUpdateUrlParam('advert_agents_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_advert_agents){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add advert_agents `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('AdvertagentsProfileTray')
      }
    }
     
  }

  if(childActionName.update_advert_agents){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update advert_agents `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('AdvertagentsProfileTray')
        
      }
    }
  }

  if(childActionName.delete_advert_agents){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../advert_agents/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteAdvertagents(deleteToken).then(data=>{
  
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
       deleteUrlParam('advert_agents_delete');
        
    }
  
  });

}