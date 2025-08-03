'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';



//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam, mosyFormatDateOnly , mosyFormatDateTime} from '../../../MosyUtils/hiveUtils';

import { mosyFilterUrl } from '../../DataControl/MosyFilterEngine';

//list components
import {
  MosySmartDropdownActions,
  AddNewButton,
  MosyActionButton,
  MosyGridRowOptions,
  MosyPaginationUi,
  DeleteButton,
  MosyImageViewer
} from '../../UiControl/componentControl';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadVisitorslogListData, popDeleteDialog, InteprateVisitorslogEvent  } from '../dataControl/VisitorslogRequestHandler';

//state management
import { useVisitorslogState } from '../dataControl/VisitorslogStateManager';

//corav2 custom functions
//import {  } from '../../corav2_custom_functions';

//def logo
//import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//export list
export default function VisitorslogList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../visitors_log/profile",
    showDataControlSections = true,
    parentUseEffectKey = "",
    parentStateSetters=null,
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Visitorslog states
  const [stateItem, stateItemSetters] = useVisitorslogState(settersOverrides);
  
  const localEventSignature = stateItem.localEventSignature
  const snackMessage = stateItem.snackMessage
  const snackOnDone = stateItem.snackOnDone
  
  //use route navigation system if need be
  const router = useRouter();
  
  useEffect(() => {
    
    const snackUrlAlert = mosyUrlParam("snack_alert")
    if(snackUrlAlert)
    {
      stateItemSetters.setSnackMessage(snackUrlAlert)
    }
    
    loadVisitorslogListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"visitors_log", keyword:stateItem.visitorslogQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Visitors Log </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_visitors_log" name="txt_visitors_log" className="custom-search-input form-control" placeholder="Search in Visitors Log "
          onChange={(e) => stateItemSetters.setVisitorslogQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qvisitors_log_btn" name="qvisitors_log_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="VisitorslogList" link={customProfilePath} label=" Add new" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="visitors_log_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Visitdate</b></th>
              <th scope="col"><b>Asset</b></th>
              <th scope="col"><b>Visitor Code</b></th>
              <th scope="col"><b>Pagevisited</b></th>
              <th scope="col"><b>Taskid</b></th>
              <th scope="col"><b>Market Id</b></th>
              <th scope="col"><b>Camp Id</b></th>
              <th scope="col"><b>Sourcename</b></th>
              <th scope="col"><b>Device</b></th>
              <th scope="col"><b>Sourceurl</b></th>
              <th scope="col"><b>Visitedurl</b></th>
              <th scope="col"><b>Script Data</b></th>
              <th scope="col"><b>Url Data</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.visitorslogLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="14" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Visitors Log ...</h5>
                </td>
              </tr>
            ) : stateItem.visitorslogListData?.length > 0 ? (
              stateItem.visitorslogListData.map((listvisitors_log_result, index) => (
                <Fragment key={`_row_${listvisitors_log_result.primkey}`}>
                  <tr key={listvisitors_log_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listvisitors_log_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="visitors_log"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listvisitors_log_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listvisitors_log_result.visitdate}>{magicTrimText(listvisitors_log_result.visitdate, 70)}</span></td>
                    <td scope="col"><span title={listvisitors_log_result.asset}>{magicTrimText(listvisitors_log_result.asset, 70)}</span></td>
                    <td scope="col"><span title={listvisitors_log_result.visitor_code}>{magicTrimText(listvisitors_log_result.visitor_code, 70)}</span></td>
                    <td scope="col"><span title={listvisitors_log_result.pagevisited}>{magicTrimText(listvisitors_log_result.pagevisited, 70)}</span></td>
                    <td scope="col"><span title={listvisitors_log_result.taskid}>{magicTrimText(listvisitors_log_result.taskid, 70)}</span></td>
                    <td scope="col"><span title={listvisitors_log_result.market_id}>{magicTrimText(listvisitors_log_result.market_id, 70)}</span></td>
                    <td scope="col"><span title={listvisitors_log_result.camp_id}>{magicTrimText(listvisitors_log_result.camp_id, 70)}</span></td>
                    <td scope="col"><span title={listvisitors_log_result.sourcename}>{magicTrimText(listvisitors_log_result.sourcename, 70)}</span></td>
                    <td scope="col"><span title={listvisitors_log_result.device}>{magicTrimText(listvisitors_log_result.device, 70)}</span></td>
                    <td scope="col"><span title={listvisitors_log_result.sourceurl}>{magicTrimText(listvisitors_log_result.sourceurl, 70)}</span></td>
                    <td scope="col"><span title={listvisitors_log_result.visitedurl}>{magicTrimText(listvisitors_log_result.visitedurl, 70)}</span></td>
                    <td scope="col"><span>
                      <ReactMarkdown>
                        
                        {magicTrimText(listvisitors_log_result.script_data, 70)}
                        
                      </ReactMarkdown>
                    </span></td>
                    <td scope="col"><span>
                      <ReactMarkdown>
                        
                        {magicTrimText(listvisitors_log_result.url_data, 70)}
                        
                      </ReactMarkdown>
                    </span></td>
                    
                  </tr>
                  
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="14" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no visitors log records found</h6>
                  
                  <AddNewButton src="VisitorslogList"  link={customProfilePath} label=" Add new" icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        src="VisitorslogList"
        tblName="visitors_log"
        totalPages={stateItem.visitorslogListPageCount}
        stateItemSetters={stateItemSetters}
        />
      </div>
      
      
    </form>
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
    </div>
  );
  
}

