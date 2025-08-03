
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultPostingactivityStateDefaults = {

  //state management for list page
  postingactivityListData : [],
  postingactivityListPageCount : 1,
  postingactivityLoading: true,  
  parentUseEffectKey : 'loadPostingactivityList',
  localEventSignature: 'loadPostingactivityList',
  postingactivityQuerySearchStr: '',

  
  //for profile page
  posting_activityNode : {},
  postingactivityActionStatus : 'add_posting_activity',
  parampostingactivityUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  postingactivityUptoken:'',
  postingactivityNode : {},
  activeScrollId : 'PostingactivityProfileTray',
  
  //dataScript
  postingactivityCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function usePostingactivityState(overrides = {}) {
  const combinedDefaults = { ...defaultPostingactivityStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

