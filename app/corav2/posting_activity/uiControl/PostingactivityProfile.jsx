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
import { intepratePostingactivityFormAction, postingactivityProfileData , popDeleteDialog, IntepratePostingactivityEvent } from '../dataControl/PostingactivityRequestHandler';

//state management
import { usePostingactivityState } from '../dataControl/PostingactivityStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  DeleteButton ,
  MosyImageViewer,
  MosyFileUploadButton
} from '../../UiControl/componentControl';

//corav2 custom functions
//import {  } from '../../corav2_custom_functions';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'


// export profile

export default function PostingactivityProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="PostingactivityMainProfilePage",
    parentProfileItemId = "PostingactivityProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Postingactivity states
  const [stateItem, stateItemSetters] = usePostingactivityState(settersOverrides);
  const posting_activityNode = stateItem.postingactivityNode
  
  // -- basic states --//
  const paramPostingactivityUptoken  = stateItem.postingactivityUptoken
  const postingactivityActionStatus = stateItem.postingactivityActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setPostingactivityNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postPostingactivityFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    intepratePostingactivityFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postPostingactivityFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("PostingactivityProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    postingactivityProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="PostingactivityProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postPostingactivityFormData} encType="multipart/form-data" id="posting_activity_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {posting_activityNode?.primkey ? (  <span>Posting Activity Profile</span>) : (<span>Add Posting Activity</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramPostingactivityUptoken && (
                  <DeleteButton
                  src="PostingactivityMainProfilePage"
                  tableName="posting_activity"
                  uptoken={paramPostingactivityUptoken}
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
                
                
                
                {paramPostingactivityUptoken && (
                  <>
                  
                </>
              )}
              
              {paramPostingactivityUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="PostingactivityMainProfilePage"
                tableName="posting_activity"
                uptoken={paramPostingactivityUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="PostingactivityMainProfilePage"
                tableName="posting_activity"
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
          
          <div className="col-md-6 mr-lg-5">
            
            <div className="col-md-12 p-0 text-center mb-3">
              <div className="col-md-12 m-2"><b>Screen Shot</b></div>
              <MosyImageViewer
              media={`/api/mediaroom?media=${btoa((posting_activityNode?.screen_shot || ""))}`}
              mediaRoot={""}
              defaultLogo={logo.src}
              imageClass="rounded_avatar"
              />
              
              <MosyFileUploadButton
              tblName="posting_activity"
              attribute="screen_shot"
              />
              <input type="hidden" name="media_posting_activity_screen_shot" value={posting_activityNode?.screen_shot || ""}/>
            </div>
            
            
          </div>
          {/*    Image section isle      */}
          
          {/*  //-------------    main content starts here  ------------------------------ */}
          
          
          
          <div className="col-md-12 row justify-content-center m-0  p-0">
            {/*    Input cells section isle      */}
            <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
              <div className="col-md-12 row justify-content-center p-0 m-0">
                <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                  
                  <MosySmartField
                  module="posting_activity"
                  field="posted_status"
                  label="Posted Status"
                  value={posting_activityNode?.posted_status || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                  />
                  
                  <LiveSearchDropdown
                  apiEndpoint="/api/corav2/audience/audience"
                  tblName="audience"
                  parentTable="posting_activity"
                  inputName="txt__audience_pagename_market_name"
                  hiddenInputName="txt_market_name"
                  valueField="record_id"
                  displayField="pagename"
                  label="Market Name"
                  defaultValue={{ record_id: posting_activityNode?.market_name || "", pagename: posting_activityNode?._audience_pagename_market_name || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-6 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  <LiveSearchDropdown
                  apiEndpoint="/api/corav2/campaigns/campaigns"
                  tblName="campaigns"
                  parentTable="posting_activity"
                  inputName="txt__campaigns_post_title_campaign_id"
                  hiddenInputName="txt_campaign_id"
                  valueField="record_id"
                  displayField="post_title"
                  label="Campaign Id"
                  defaultValue={{ record_id: posting_activityNode?.campaign_id || "", post_title: posting_activityNode?._campaigns_post_title_campaign_id || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-6 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  
                  <MosySmartField
                  module="posting_activity"
                  field="url"
                  label="Url"
                  value={posting_activityNode?.url || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="posting_activity"
                  field="task_id"
                  label="Task Id"
                  value={posting_activityNode?.task_id || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="posting_activity"
                  field="dateposted"
                  label="Dateposted"
                  value={posting_activityNode?.dateposted || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="posting_activity"
                  field="landing_page"
                  label="Landing Page"
                  value={posting_activityNode?.landing_page || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                  />
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="PostingactivityMainProfilePage"
                  tblName="posting_activity"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="posting_activity_uptoken" name="posting_activity_uptoken" value={paramPostingactivityUptoken}/>
              <input type="hidden" id="posting_activity_mosy_action" name="posting_activity_mosy_action" value={postingactivityActionStatus}/>
            </section>
            
            
          </div>
          
        </form>
        
        
        <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
          {/*<hive_mini_list/>*/}
          
          
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

