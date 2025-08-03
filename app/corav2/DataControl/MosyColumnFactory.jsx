const MosyColumnFactory = {

   //-- ad_audience cols--//
  ad_audience: ["aud_pagename", "aud_pageid", "aud_pagetoken", "aud_pageurl", "aud_sitename", "aud_industry", "aud_profiledescr", "aud_imageurl", "aud_count", "site_id"],

   //-- ad_images cols--//
  ad_images: ["image_url", "image_type", "site_id", "PhotoCaption", "show_img", "cartegory_name", "cust_themeid"],

   //-- advert_admins cols--//
  advert_admins: ["admin_name", "admin_email", "admin_tel", "admin_pass", "business_tel", "bussiness_email", "business_name", "site_address", "logourl", "bgimgurl", "site_id", "sms_url"],

   //-- advert_agents cols--//
  advert_agents: ["agent_name", "platform", "agent_lastseen", "current_task", "config_info"],

   //-- advert_tasktray cols--//
  advert_tasktray: ["task_name", "agent_name", "active_campaign", "platform_target", "task_status", "task_date", "weekday", "active_market", "remark", "headless"],

   //-- audience cols--//
  audience: ["pagename", "pageurl", "parent_site", "demographic", "remark"],

   //-- campaigns cols--//
  campaigns: ["post_title", "post_content", "landing_page", "target_market", "post_image", "campaign_type", "post_status", "ab_testing", "date_posted"],

   //-- custom_web_themes cols--//
  custom_web_themes: ["webtemp_id", "webtemp_skinclr", "webtemp_btnclr", "webtemp_gentxtclr", "webtemp_btntxtclr", "webtemp_url", "webtemp_bgimg", "site_id", "webtemp_contbg", "webtemp_conttxtclr", "webtemp_type", "web_keywords", "web_slogan", "offer_type", "button_name", "pagedescr", "filename", "theme_about", "onflycss", "redirurl", "pagetel", "pageemail"],

   //-- landing_pages cols--//
  landing_pages: ["site_title", "url", "description", "page_photo"],

   //-- page_manifest_ cols--//
  page_manifest_: ["page_group", "site_id", "page_url", "hive_site_id", "hive_site_name", "project_id", "project_name"],

   //-- pay_outs cols--//
  pay_outs: ["user_id", "payout_date", "amount", "pay_month", "pay_year", "trx_no", "comment", "site_id"],

   //-- payroll cols--//
  payroll: ["user_id", "receipt_id", "request_date", "amount", "description", "site_id"],

   //-- photos cols--//
  photos: ["photo_source", "photo", "caption", "account_no", "photo_type", "item_id", "keyword", "site_id"],

   //-- posting_activity cols--//
  posting_activity: ["url", "market_name", "campaign_id", "task_id", "dateposted", "posted_status", "landing_page", "screen_shot"],

   //-- product_services cols--//
  product_services: ["prod_name", "prod_descr", "prod_price", "site_id", "prod_type", "cust_themeid", "prodimg"],

   //-- sqlpro_themes cols--//
  sqlpro_themes: ["webtemp_id", "webtemp_skinclr", "webtemp_btnclr", "webtemp_gentxtclr", "webtemp_btntxtclr", "webtemp_url", "webtemp_bgimg", "site_id", "webtemp_contbg", "webtemp_conttxtclr", "webtemp_type", "owner"],

   //-- system_role_bundles cols--//
  system_role_bundles: ["bundle_id", "bundle_name", "remark", "hive_site_id", "hive_site_name"],

   //-- system_users cols--//
  system_users: ["name", "email", "tel", "login_password", "ref_id", "regdate", "user_no", "user_pic", "user_gender", "last_seen", "about", "hive_site_id", "hive_site_name", "auth_token", "token_status", "token_expiring_in", "project_id", "project_name"],

   //-- user_bundle_role_functions cols--//
  user_bundle_role_functions: ["bundle_id", "bundle_name", "role_id", "role_name", "remark", "hive_site_id", "hive_site_name"],

   //-- user_manifest_ cols--//
  user_manifest_: ["user_id", "user_name", "role_id", "site_id", "role_name", "hive_site_id", "hive_site_name", "project_id", "project_name"],

   //-- visitors_log cols--//
  visitors_log: ["visitdate", "asset", "visitor_code", "pagevisited", "taskid", "market_id", "camp_id", "sourcename", "device", "sourceurl", "visitedurl", "script_data", "url_data"],

   //-- web_themes cols--//
  web_themes: ["webtemp_id", "webtemp_skinclr", "webtemp_btnclr", "webtemp_gentxtclr", "webtemp_btntxtclr", "webtemp_url", "webtemp_bgimg", "site_id", "webtemp_contbg", "webtemp_conttxtclr", "webtemp_type", "filename"],


};
export default MosyColumnFactory;