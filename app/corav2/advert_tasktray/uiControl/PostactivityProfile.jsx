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
import { intepratePostactivityFormAction, postactivityProfileData , popDeleteDialog, IntepratePostactivityEvent } from '../dataControl/PostactivityRequestHandler';

//state management
import { usePostactivityState } from '../dataControl/PostactivityStateManager';

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
import { runCampaign  } from '../../corav2_custom_functions';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'


//activity log map
import { IntepratePostingactivityEvent } from '../../posting_activity/dataControl/PostingactivityRequestHandler';

import PostingactivityList from '../../posting_activity/uiControl/PostingactivityList'


// export profile

export default function PostactivityProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="PostactivityMainProfilePage",
    parentProfileItemId = "PostactivityProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Postactivity states
  const [stateItem, stateItemSetters] = usePostactivityState(settersOverrides);
  const advert_tasktrayNode = stateItem.postactivityNode
  
  // -- basic states --//
  const paramPostactivityUptoken  = stateItem.postactivityUptoken
  const postactivityActionStatus = stateItem.postactivityActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setPostactivityNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postPostactivityFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    intepratePostactivityFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postPostactivityFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("PostactivityProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    postactivityProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="PostactivityProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postPostactivityFormData} encType="multipart/form-data" id="advert_tasktray_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {advert_tasktrayNode?.primkey ? (  <span>Post activity profile / {advert_tasktrayNode?.task_name || ""}</span> ) :(<span> Run post</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramPostactivityUptoken && (
                  <DeleteButton
                  src="PostactivityMainProfilePage"
                  tableName="advert_tasktray"
                  uptoken={paramPostactivityUptoken}
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
                
                
                
                {paramPostactivityUptoken && (
                  <>
                  
                  <MosyActionButton
                  label=" Run campaigns"
                  icon="bolt"
                  onClick={()=>{runCampaign(advert_tasktrayNode?.record_id)}}
                  />
                  
                </>
              )}
              
              {paramPostactivityUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="PostactivityMainProfilePage"
                tableName="advert_tasktray"
                uptoken={paramPostactivityUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="PostactivityMainProfilePage"
                tableName="advert_tasktray"
                link="./profile"
                label="Run post"
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
              <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center">Task Details</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  <MosySmartField
                  module="advert_tasktray"
                  field="task_name"
                  label="Task Name"
                  value={advert_tasktrayNode?.task_name || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  <LiveSearchDropdown
                  apiEndpoint="/api/corav2/campaigns/campaigns"
                  tblName="campaigns"
                  parentTable="advert_tasktray"
                  inputName="txt__campaigns_post_title_active_campaign"
                  hiddenInputName="txt_active_campaign"
                  valueField="record_id"
                  displayField="post_title"
                  label="Active Campaign"
                  defaultValue={{ record_id: advert_tasktrayNode?.active_campaign || "", post_title: advert_tasktrayNode?._campaigns_post_title_active_campaign || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-4 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  <LiveSearchDropdown
                  apiEndpoint="/api/corav2/audience/audience"
                  tblName="audience"
                  parentTable="advert_tasktray"
                  inputName="txt__audience_demographic_platform_target"
                  hiddenInputName="txt_platform_target"
                  valueField="demographic"
                  displayField="demographic"
                  label="Platform Target"
                  defaultValue={{ demographic: advert_tasktrayNode?.platform_target || "", demographic: advert_tasktrayNode?._audience_demographic_platform_target || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-4 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  <LiveSearchDropdown
                  apiEndpoint="/api/corav2/audience/audience"
                  tblName="audience"
                  parentTable="advert_tasktray"
                  inputName="txt__audience_pagename_active_market"
                  hiddenInputName="txt_active_market"
                  valueField="record_id"
                  displayField="pagename"
                  label="Active Market"
                  defaultValue={{ record_id: advert_tasktrayNode?.active_market || "", pagename: advert_tasktrayNode?._audience_pagename_active_market || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-4 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  <LiveSearchDropdown
                  apiEndpoint="/api/corav2/advert_agents/advertagents"
                  tblName="advert_agents"
                  parentTable="advert_tasktray"
                  inputName="txt__advert_agents_agent_name_agent_name"
                  hiddenInputName="txt_agent_name"
                  valueField="record_id"
                  displayField="agent_name"
                  label="Agent Name"
                  defaultValue={{ record_id: advert_tasktrayNode?.agent_name || "", agent_name: advert_tasktrayNode?._advert_agents_agent_name_agent_name || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-4 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label >Task Status</label>
                    
                    <select name="txt_task_status" id="txt_task_status" className="form-control">
                      <option  value={advert_tasktrayNode?.task_status || ""}>{advert_tasktrayNode?.task_status || "Select Task Status"}</option>
                      <option>Active</option>
                      <option>Complete</option>
                      <option>Draft</option>
                      
                    </select>
                  </div>
                  
                </div>
                
              </div>
              
              <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center"></div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  {advert_tasktrayNode?.primkey && (
                    <div className="form-group col-md-4 hive_data_cell  ">
                      <label >Audience</label>
                      <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_audience" name="div_audience" placeholder="Audience">{advert_tasktrayNode?.audience || ""}</div>
                    </div>)}
                    
                    {advert_tasktrayNode?.primkey && (
                      <div className="form-group col-md-4 hive_data_cell  ">
                        <label >Posts</label>
                        <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_posts" name="div_posts" placeholder="Posts">{advert_tasktrayNode?.posts || ""}</div>
                      </div>)}
                      
                      <div className="form-group col-md-4 hive_data_cell ">
                        <label >Headless</label>
                        
                        <select name="txt_headless" id="txt_headless" className="form-control">
                          <option  value={advert_tasktrayNode?.headless || ""}>{advert_tasktrayNode?.headless || "Select Headless"}</option>
                          <option>false</option>
                          <option>true</option>
                          
                        </select>
                      </div>
                      
                      
                      <MosySmartField
                      module="advert_tasktray"
                      field="task_date"
                      label="Task Date"
                      value={advert_tasktrayNode?.task_date || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="datetime-local"
                      cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                      />
                      
                      
                      <div className="form-group col-md-4 hive_data_cell ">
                        <label className="d-none">Weekday</label>
                        
                        <SmartDropdown
                        apiEndpoint="/api/corav2/advert_tasktray/postactivity"
                        idField="primkey"
                        labelField="weekday"
                        inputName="txt_weekday"
                        label="Weekday"
                        onSelect={(val) => console.log('Selected:', val)}
                        defaultValue={advert_tasktrayNode?.weekday || ""}
                        />
                      </div>
                      
                      
                      <MosySmartField
                      module="advert_tasktray"
                      field="remark"
                      label="Remark"
                      value={advert_tasktrayNode?.remark || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="textarea"
                      cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                      />
                      
                    </div>
                    
                    <div className="col-md-12 text-center">
                      <SubmitButtons
                      src="PostactivityMainProfilePage"
                      tblName="advert_tasktray"
                      extraClass="optional-custom-class"
                      
                      />
                    </div>
                  </div></div>
                  {/*    Input cells section isle      */}
                </div>
                
                <section className="hive_control">
                  <input type="hidden" id="advert_tasktray_uptoken" name="advert_tasktray_uptoken" value={paramPostactivityUptoken}/>
                  <input type="hidden" id="advert_tasktray_mosy_action" name="advert_tasktray_mosy_action" value={postactivityActionStatus}/>
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
            {advert_tasktrayNode?.primkey && (
              <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
                <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Post activity`} </h5>
                
                <PostingactivityList
                key={`${customQueryStr}-${localEventSignature}`}
                dataIn={{
                  parentStateSetters : stateItemSetters,
                  parentUseEffectKey : localEventSignature,
                  showNavigationIsle:false,
                  customQueryStr : btoa(`where  task_id ='${advert_tasktrayNode?.record_id}' `),
                  customProfilePath:""
                  
                }}
                
                dataOut={{
                  setChildDataOut: IntepratePostingactivityEvent,
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
  
