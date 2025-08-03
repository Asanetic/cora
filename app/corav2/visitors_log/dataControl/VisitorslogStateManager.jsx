
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultVisitorslogStateDefaults = {

  //state management for list page
  visitorslogListData : [],
  visitorslogListPageCount : 1,
  visitorslogLoading: true,  
  parentUseEffectKey : 'loadVisitorslogList',
  localEventSignature: 'loadVisitorslogList',
  visitorslogQuerySearchStr: '',

  
  //for profile page
  visitors_logNode : {},
  visitorslogActionStatus : 'add_visitors_log',
  paramvisitorslogUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  visitorslogUptoken:'',
  visitorslogNode : {},
  activeScrollId : 'VisitorslogProfileTray',
  
  //dataScript
  visitorslogCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useVisitorslogState(overrides = {}) {
  const combinedDefaults = { ...defaultVisitorslogStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

