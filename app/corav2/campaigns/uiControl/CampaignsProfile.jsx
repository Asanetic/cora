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
import { inteprateCampaignsFormAction, campaignsProfileData , popDeleteDialog, InteprateCampaignsEvent } from '../dataControl/CampaignsRequestHandler';

//state management
import { useCampaignsState } from '../dataControl/CampaignsStateManager';

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

export default function CampaignsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="CampaignsMainProfilePage",
    parentProfileItemId = "CampaignsProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Campaigns states
  const [stateItem, stateItemSetters] = useCampaignsState(settersOverrides);
  const campaignsNode = stateItem.campaignsNode
  
  // -- basic states --//
  const paramCampaignsUptoken  = stateItem.campaignsUptoken
  const campaignsActionStatus = stateItem.campaignsActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setCampaignsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postCampaignsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateCampaignsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postCampaignsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("CampaignsProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    campaignsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="CampaignsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postCampaignsFormData} encType="multipart/form-data" id="campaigns_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {campaignsNode?.primkey ? (  <span> Campaign / {campaignsNode?.post_title || ""}</span> ) :(<span> New campaign </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramCampaignsUptoken && (
                  <DeleteButton
                  src="CampaignsMainProfilePage"
                  tableName="campaigns"
                  uptoken={paramCampaignsUptoken}
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
                
                
                
                {paramCampaignsUptoken && (
                  <>
                  
                </>
              )}
              
              {paramCampaignsUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="CampaignsMainProfilePage"
                tableName="campaigns"
                uptoken={paramCampaignsUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="CampaignsMainProfilePage"
                tableName="campaigns"
                link="./profile"
                label="New campaign "
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
              <div className="col-md-12 m-2"><b>Post Image</b></div>
              <MosyImageViewer
              media={`/api/mediaroom?media=${btoa((campaignsNode?.post_image || ""))}`}
              mediaRoot={""}
              defaultLogo={logo.src}
              imageClass="product_image"
              />
              
              <MosyFileUploadButton
              tblName="campaigns"
              attribute="post_image"
              />
              <input type="hidden" name="media_campaigns_post_image" value={campaignsNode?.post_image || ""}/>
            </div>
            
            
          </div>
          {/*    Image section isle      */}
          
          {/*  //-------------    main content starts here  ------------------------------ */}
          
          
          
          <div className="col-md-12 row justify-content-center m-0  p-0">
            {/*    Input cells section isle      */}
            <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
              <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center">Post Details</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  <MosySmartField
                  module="campaigns"
                  field="post_title"
                  label="Post Title"
                  value={campaignsNode?.post_title || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="title"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                  
                  <MosySmartField
                  module="campaigns"
                  field="post_content"
                  label="Post Content"
                  value={campaignsNode?.post_content || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                </div>
                
              </div>
              
              <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center">Post Settings</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  <LiveSearchDropdown
                  apiEndpoint="/api/corav2/landing_pages/landingpages"
                  tblName="landing_pages"
                  parentTable="campaigns"
                  inputName="txt__landing_pages_site_title_landing_page"
                  hiddenInputName="txt_landing_page"
                  valueField="record_id"
                  displayField="site_title"
                  label="Landing Page"
                  defaultValue={{ record_id: campaignsNode?.landing_page || "", site_title: campaignsNode?._landing_pages_site_title_landing_page || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-4 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  <LiveSearchDropdown
                  apiEndpoint="/api/corav2/audience/audience"
                  tblName="audience"
                  parentTable="campaigns"
                  inputName="txt__audience_pagename_target_market"
                  hiddenInputName="txt_target_market"
                  valueField="record_id"
                  displayField="pagename"
                  label="Target Market"
                  defaultValue={{ record_id: campaignsNode?.target_market || "", pagename: campaignsNode?._audience_pagename_target_market || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-4 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">Campaign Type</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/corav2/campaigns/campaigns"
                    idField="primkey"
                    labelField="campaign_type"
                    inputName="txt_campaign_type"
                    label="Campaign Type"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={campaignsNode?.campaign_type || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label >Post Status</label>
                    
                    <select name="txt_post_status" id="txt_post_status" className="form-control">
                      <option  value={campaignsNode?.post_status || ""}>{campaignsNode?.post_status || "Select Post Status"}</option>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Draft</option>
                      
                    </select>
                  </div>
                  
                  
                  <MosySmartField
                  module="campaigns"
                  field="ab_testing"
                  label="Ab Testing"
                  value={campaignsNode?.ab_testing || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="campaigns"
                  field="date_posted"
                  label="Date Posted"
                  value={campaignsNode?.date_posted || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="datetime-local"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="CampaignsMainProfilePage"
                  tblName="campaigns"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="campaigns_uptoken" name="campaigns_uptoken" value={paramCampaignsUptoken}/>
              <input type="hidden" id="campaigns_mosy_action" name="campaigns_mosy_action" value={campaignsActionStatus}/>
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

