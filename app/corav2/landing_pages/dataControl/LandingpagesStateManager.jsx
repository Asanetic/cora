
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultLandingpagesStateDefaults = {

  //state management for list page
  landingpagesListData : [],
  landingpagesListPageCount : 1,
  landingpagesLoading: true,  
  parentUseEffectKey : 'loadLandingpagesList',
  localEventSignature: 'loadLandingpagesList',
  landingpagesQuerySearchStr: '',

  
  //for profile page
  landing_pagesNode : {},
  landingpagesActionStatus : 'add_landing_pages',
  paramlandingpagesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  landingpagesUptoken:'',
  landingpagesNode : {},
  activeScrollId : 'LandingpagesProfileTray',
  
  //dataScript
  landingpagesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useLandingpagesState(overrides = {}) {
  const combinedDefaults = { ...defaultLandingpagesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

