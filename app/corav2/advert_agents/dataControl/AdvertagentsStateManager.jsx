
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultAdvertagentsStateDefaults = {

  //state management for list page
  advertagentsListData : [],
  advertagentsListPageCount : 1,
  advertagentsLoading: true,  
  parentUseEffectKey : 'loadAdvertagentsList',
  localEventSignature: 'loadAdvertagentsList',
  advertagentsQuerySearchStr: '',

  
  //for profile page
  advert_agentsNode : {},
  advertagentsActionStatus : 'add_advert_agents',
  paramadvertagentsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  advertagentsUptoken:'',
  advertagentsNode : {},
  activeScrollId : 'AdvertagentsProfileTray',
  
  //dataScript
  advertagentsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useAdvertagentsState(overrides = {}) {
  const combinedDefaults = { ...defaultAdvertagentsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

