
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultAdverttasktrayStateDefaults = {

  //state management for list page
  adverttasktrayListData : [],
  adverttasktrayListPageCount : 1,
  adverttasktrayLoading: true,  
  parentUseEffectKey : 'loadAdverttasktrayList',
  localEventSignature: 'loadAdverttasktrayList',
  adverttasktrayQuerySearchStr: '',

  
  //for profile page
  advert_tasktrayNode : {},
  adverttasktrayActionStatus : 'add_advert_tasktray',
  paramadverttasktrayUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  adverttasktrayUptoken:'',
  adverttasktrayNode : {},
  activeScrollId : 'AdverttasktrayProfileTray',
  
  //dataScript
  adverttasktrayCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useAdverttasktrayState(overrides = {}) {
  const combinedDefaults = { ...defaultAdverttasktrayStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

