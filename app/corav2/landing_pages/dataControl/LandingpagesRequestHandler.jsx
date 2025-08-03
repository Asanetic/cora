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
export async function insertLandingpages() {
 //console.log(`Form landing_pages insert sent `)

  return await mosyPostFormData({
    formId: 'landing_pages_profile_form',
    url: '/api/corav2/landing_pages/landingpages',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateLandingpages() {

  //console.log(`Form landing_pages update sent `)

  return await mosyPostFormData({
    formId: 'landing_pages_profile_form',
    url: '/api/corav2/landing_pages/landingpages',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateLandingpagesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('landing_pages_mosy_action');
 
 //console.log(`Form landing_pages submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_landing_pages') {

      actionMessage ='Record added succesfully!';

      result = await insertLandingpages();
    }

    if (actionType === 'update_landing_pages') {

      actionMessage ='Record updated succesfully!';

      result = await updateLandingpages();
    }

    if (result?.status === 'success') {
      
      const landing_pagesUptoken = btoa(result.landing_pages_uptoken || '');

      //set id key
      setters.setLandingpagesUptoken(landing_pagesUptoken);
      
      //update url with new landing_pagesUptoken
      mosyUpdateUrlParam('landing_pages_uptoken', landing_pagesUptoken)

      setters.setLandingpagesActionStatus('update_landing_pages')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: landing_pagesUptoken,
        actionName : actionType,
        actionType : 'landing_pages_form_submission'
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


export async function initLandingpagesProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Landing Pages' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/corav2/landing_pages/landingpages',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initLandingpagesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('landing_pages Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching landing_pages data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteLandingpages(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/corav2/landing_pages/delete',
        params: { 
          _landing_pages_delete_record: (token), 
          },
      });

      console.log('Token DeleteLandingpages '+token)
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


export async function getLandingpagesListData(qstr = "") {
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
  const pageNo = mosyUrlParam('qlanding_pages_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/corav2/landing_pages/landingpages',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qlanding_pages_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getLandingpagesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('landing_pages Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching landing_pages data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadLandingpagesListData(customQueryStr, setters) {

    const gftLandingpages = MosyFilterEngine('landing_pages', true);
    let finalFilterStr = btoa(gftLandingpages);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setLandingpagesLoading(true);
    
    const landingpagesListData = await getLandingpagesListData(finalFilterStr);
    
    setters.setLandingpagesLoading(false)
    setters.setLandingpagesListData(landingpagesListData?.data)

    setters.setLandingpagesListPageCount(landingpagesListData?.page_count)


    return landingpagesListData

}
  
  
export async function landingpagesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const landingpagesTokenId = mosyUrlParam('landing_pages_uptoken');
    
    const deleteParam = mosyUrlParam('landing_pages_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedLandingpagesToken = '0';
    if (landingpagesTokenId) {
      
      decodedLandingpagesToken = atob(landingpagesTokenId); // Decode the record_id
      setters.setLandingpagesUptoken(landingpagesTokenId);
      setters.setLandingpagesActionStatus('update_landing_pages');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawLandingpagesQueryStr =`where primkey ='${decodedLandingpagesToken}'`
    if(customQueryStr!='')
    {
      // if no landing_pages_uptoken set , use customQueryStr
      if (!landingpagesTokenId) {
       rawLandingpagesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initLandingpagesProfileData(rawLandingpagesQueryStr)

    if(deleteParam){
      popDeleteDialog(landingpagesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setLandingpagesNode(finalProfileData)
    
    
}
  
  

export function InteprateLandingpagesEvent(data) {
     
  //console.log('🎯 Landingpages Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_landing_pages){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLandingpagesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('LandingpagesProfileTray')

    
    mosyUpdateUrlParam('landing_pages_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_landing_pages){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add landing_pages `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('LandingpagesProfileTray')
      }
    }
     
  }

  if(childActionName.update_landing_pages){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update landing_pages `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('LandingpagesProfileTray')
        
      }
    }
  }

  if(childActionName.delete_landing_pages){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../landing_pages/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteLandingpages(deleteToken).then(data=>{
  
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
       deleteUrlParam('landing_pages_delete');
        
    }
  
  });

}