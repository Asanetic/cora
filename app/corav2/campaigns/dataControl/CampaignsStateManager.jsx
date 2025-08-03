
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultCampaignsStateDefaults = {

  //state management for list page
  campaignsListData : [],
  campaignsListPageCount : 1,
  campaignsLoading: true,  
  parentUseEffectKey : 'loadCampaignsList',
  localEventSignature: 'loadCampaignsList',
  campaignsQuerySearchStr: '',

  
  //for profile page
  campaignsNode : {},
  campaignsActionStatus : 'add_campaigns',
  paramcampaignsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  campaignsUptoken:'',
  campaignsNode : {},
  activeScrollId : 'CampaignsProfileTray',
  
  //dataScript
  campaignsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useCampaignsState(overrides = {}) {
  const combinedDefaults = { ...defaultCampaignsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

