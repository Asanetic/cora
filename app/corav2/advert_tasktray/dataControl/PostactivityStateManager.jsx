
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultPostactivityStateDefaults = {

  //state management for list page
  postactivityListData : [],
  postactivityListPageCount : 1,
  postactivityLoading: true,  
  parentUseEffectKey : 'loadPostactivityList',
  localEventSignature: 'loadPostactivityList',
  postactivityQuerySearchStr: '',

  
  //for profile page
  advert_tasktrayNode : {},
  postactivityActionStatus : 'add_advert_tasktray',
  parampostactivityUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  postactivityUptoken:'',
  postactivityNode : {},
  activeScrollId : 'PostactivityProfileTray',
  
  //dataScript
  postactivityCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function usePostactivityState(overrides = {}) {
  const combinedDefaults = { ...defaultPostactivityStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

