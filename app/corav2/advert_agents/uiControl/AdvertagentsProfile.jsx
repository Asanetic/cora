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
import { inteprateAdvertagentsFormAction, advertagentsProfileData , popDeleteDialog, InteprateAdvertagentsEvent } from '../dataControl/AdvertagentsRequestHandler';

//state management
import { useAdvertagentsState } from '../dataControl/AdvertagentsStateManager';

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
///import { run_campaigns } from '../../corav2_custom_functions';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'


// export profile

export default function AdvertagentsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="AdvertagentsMainProfilePage",
    parentProfileItemId = "AdvertagentsProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Advertagents states
  const [stateItem, stateItemSetters] = useAdvertagentsState(settersOverrides);
  const advert_agentsNode = stateItem.advertagentsNode
  
  // -- basic states --//
  const paramAdvertagentsUptoken  = stateItem.advertagentsUptoken
  const advertagentsActionStatus = stateItem.advertagentsActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setAdvertagentsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postAdvertagentsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateAdvertagentsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postAdvertagentsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("AdvertagentsProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    advertagentsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="AdvertagentsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postAdvertagentsFormData} encType="multipart/form-data" id="advert_agents_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {advert_agentsNode?.primkey ? (  <span> Social media agent profile </span> ) :(<span> New bot </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramAdvertagentsUptoken && (
                  <DeleteButton
                  src="AdvertagentsMainProfilePage"
                  tableName="advert_agents"
                  uptoken={paramAdvertagentsUptoken}
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
                
                
                
                {paramAdvertagentsUptoken && (
                  <>
                  
                </>
              )}
              
              {paramAdvertagentsUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="AdvertagentsMainProfilePage"
                tableName="advert_agents"
                uptoken={paramAdvertagentsUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="AdvertagentsMainProfilePage"
                tableName="advert_agents"
                link="./profile"
                label="New bot "
                icon="user-plus" />
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
                  module="advert_agents"
                  field="agent_name"
                  label="Agent Name"
                  value={advert_agentsNode?.agent_name || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                  />
                  
                  
                  <div className="form-group col-md-7 hive_data_cell ">
                    <label className="d-none">Platform</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/corav2/advert_agents/advertagents"
                    idField="primkey"
                    labelField="platform"
                    inputName="txt_platform"
                    label="Platform"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={advert_agentsNode?.platform || ""}
                    />
                  </div>
                  
                  
                  <MosySmartField
                  module="advert_agents"
                  field="agent_lastseen"
                  label="Agent Lastseen"
                  value={advert_agentsNode?.agent_lastseen || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="advert_agents"
                  field="current_task"
                  label="Current Task"
                  value={advert_agentsNode?.current_task || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="advert_agents"
                  field="config_info"
                  label="Config Info"
                  value={advert_agentsNode?.config_info || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-7 hive_data_cell"}}
                  />
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="AdvertagentsMainProfilePage"
                  tblName="advert_agents"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="advert_agents_uptoken" name="advert_agents_uptoken" value={paramAdvertagentsUptoken}/>
              <input type="hidden" id="advert_agents_mosy_action" name="advert_agents_mosy_action" value={advertagentsActionStatus}/>
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

