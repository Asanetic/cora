
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultActionmessagesStateDefaults = {

  //state management for list page
  actionmessagesListData : [],
  actionmessagesListPageCount : 1,
  actionmessagesLoading: true,  
  parentUseEffectKey : 'loadActionmessagesList',
  localEventSignature: 'loadActionmessagesList',
  actionmessagesQuerySearchStr: '',

  
  //for profile page
  action_messagesNode : {},
  actionmessagesActionStatus : 'add_action_messages',
  paramactionmessagesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  actionmessagesUptoken:'',
  actionmessagesNode : {},
  activeScrollId : 'ActionmessagesProfileTray',
  
  //dataScript
  actionmessagesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useActionmessagesState(overrides = {}) {
  const combinedDefaults = { ...defaultActionmessagesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

