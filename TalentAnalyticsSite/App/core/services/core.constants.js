'use strict';

angular.module('core').constant('CoreConstants',
   {
       AccessEmailURL : g_AccessEmailURL,
       ResetPassword : g_ResetPassword,
       ResetPin : g_ResetPin,
       ReportVoilation : g_ReportVoilation,
       myInformation: g_myInformation,
       DeloitteNet: g_DeloitteNet,

       baseHANAUrl: g_baseHANAUrl,

       baseHeadcountUrl: g_baseHANAUrl + 'app-talent-hcm/',

       baseDPNProfile: g_BaseDPNProfile,

       SOBSTalentLink: g_SOBSTalentLink.replace(/&amp;/g, '&'),

       dpnNetUrlProfileLink: '{0}_layouts/15/Deloitte.peoplenetwork.api/index.aspx#p[id]=i:0ǵ.t|adfs {1}|{2}&p[idType]=adfs&ps=profile&t=profile',

       baseProfileImageUrl: g_BaseProfileImageUrl,

       profileImageLink: '{0}O/Photos/Profile/{1}_MThumb_S',

       employeeBonusDetailsLink: g_BonusUrl.replace(/&amp;/g, '&'),

       deloitteNet: 'https://deloittenet.deloitte.com/',

       deloitteNetLogoutPage: 'https://app.deloittenet.deloitte.com/anonymous/logout.aspx',

       analyticsAccountKey: g_AnalyticsAccountKey,

       baseResourceConfiguration: {
           'get': {
               method: 'GET',
               withCredentials: true
           },
           'query': {
               method: 'GET',
               withCredentials: true
           }
       }
   }
);