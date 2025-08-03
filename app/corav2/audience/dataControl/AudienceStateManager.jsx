
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultAudienceStateDefaults = {

  //state management for list page
  audienceListData : [],
  audienceListPageCount : 1,
  audienceLoading: true,  
  parentUseEffectKey : 'loadAudienceList',
  localEventSignature: 'loadAudienceList',
  audienceQuerySearchStr: '',

  
  //for profile page
  audienceNode : {},
  audienceActionStatus : 'add_audience',
  paramaudienceUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  audienceUptoken:'',
  audienceNode : {},
  activeScrollId : 'AudienceProfileTray',
  
  //dataScript
  audienceCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useAudienceState(overrides = {}) {
  const combinedDefaults = { ...defaultAudienceStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

