'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateAudienceFormAction, audienceProfileData , popDeleteDialog, InteprateAudienceEvent } from '../dataControl/AudienceRequestHandler';

//state management
import { useAudienceState } from '../dataControl/AudienceStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  DeleteButton ,
} from '../../UiControl/componentControl';

//corav2 custom functions
//import {  } from '../../corav2_custom_functions';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'

import  AudienceList from './AudienceList';

// export profile

export default function AudienceProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="AudienceMainProfilePage",
    parentProfileItemId = "AudienceProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Audience states
  const [stateItem, stateItemSetters] = useAudienceState(settersOverrides);
  const audienceNode = stateItem.audienceNode
  
  // -- basic states --//
  const paramAudienceUptoken  = stateItem.audienceUptoken
  const audienceActionStatus = stateItem.audienceActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setAudienceNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postAudienceFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateAudienceFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postAudienceFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("AudienceProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    audienceProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="AudienceProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postAudienceFormData} encType="multipart/form-data" id="audience_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {audienceNode?.primkey ? (  <span>Audience Profile</span>) : (<span>Add Audience</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramAudienceUptoken && (
                  <DeleteButton
                  src="AudienceMainProfilePage"
                  tableName="audience"
                  uptoken={paramAudienceUptoken}
                  stateItemSetters={stateItemSetters}
                  parentStateSetters={parentStateSetters}
                  
                  onDelete={popDeleteDialog}
                  />
                )}
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <><div className="row justify-content-end m-0 p-0 col-md-12  p-3 bg-white hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                {showNavigationIsle && ( <Link href="./list" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>)}
                
              </div>
              <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                
                
                
                {paramAudienceUptoken && (
                  <>
                  
                </>
              )}
              
              {paramAudienceUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="AudienceMainProfilePage"
                tableName="audience"
                uptoken={paramAudienceUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="AudienceMainProfilePage"
                tableName="audience"
                link="./profile"
                label=" Add new"
                icon="plus-circle" />
              </>
            )}
            
          </div>
        </div></>
        <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
        {/*    Navigation isle      */}
        <div className="row justify-content-center m-0 p-0 col-md-12" id="">
          {/*    Image section isle      */}
          
          {/*    Image section isle      */}
          
          {/*  //-------------    main content starts here  ------------------------------ */}
          
          
          
          <div className="col-md-12 row justify-content-center m-0  p-0">
            {/*    Input cells section isle      */}
            <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
              <div className="col-md-12 row justify-content-center p-0 m-0">
                <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                  
                  <MosySmartField
                  module="audience"
                  field="pagename"
                  label="Pagename"
                  value={audienceNode?.pagename || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="audience"
                  field="pageurl"
                  label="Pageurl"
                  value={audienceNode?.pageurl || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                  />
                  
                  
                  <div className="form-group col-md-3 hive_data_cell ">
                    <label className="d-none">Parent Site</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/corav2/audience/audience"
                    idField="primkey"
                    labelField="parent_site"
                    inputName="txt_parent_site"
                    label="Parent Site"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={audienceNode?.parent_site || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-3 hive_data_cell ">
                    <label className="d-none">Demographic</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/corav2/audience/audience"
                    idField="primkey"
                    labelField="demographic"
                    inputName="txt_demographic"
                    label="Demographic"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={audienceNode?.demographic || ""}
                    />
                  </div>
                  
                  
                  <MosySmartField
                  module="audience"
                  field="remark"
                  label="Remark"
                  value={audienceNode?.remark || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="AudienceMainProfilePage"
                  tblName="audience"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="audience_uptoken" name="audience_uptoken" value={paramAudienceUptoken}/>
              <input type="hidden" id="audience_mosy_action" name="audience_mosy_action" value={audienceActionStatus}/>
            </section>
            
            
          </div>
          
        </form>
        
        
        <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
          {/*<hive_mini_list/>*/}
          
          
          
          <style jsx global>{`
          .data_list_section {
            display: none;
          }
          .bottom_tbl_handler{
            padding-bottom:70px!important;
          }
          `}
        </style>
        {audienceNode?.primkey && (
          <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`App plans`} </h5>
            
            <div className="col-md-12 p-2 text-right ">
              <a href={`../audience/list?audience_mosyfilter`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
            </div>
            
            <AudienceList
            key={`${customQueryStr}-${localEventSignature}`}
            dataIn={{
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              customQueryStr : '',
              customProfilePath:""
              
            }}
            
            dataOut={{
              setChildDataOut: InteprateAudienceEvent,
              setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
            }}
            />
          </section>
        )}
      </div>
    </div>
  </div>
  
  
  {/* snack notifications -- */}
  {snackMessage &&(
    <MosySnackWidget
    content={snackMessage}
    duration={5000}
    type="custom"
    onDone={() => {
      stateItemSetters.setSnackMessage("");
      stateItem.snackOnDone(); // Run whats inside onDone
      deleteUrlParam("snack_alert")
    }}
    
    />)}
    {/* snack notifications -- */}
    
    
    {/* ================== End Feature Section========================== ------*/}
  </div>
  
);

}

