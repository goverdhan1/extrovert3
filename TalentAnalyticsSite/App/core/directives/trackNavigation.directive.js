//'use strict';

//angular.module('core').directive('trackNavigation', ['UserDetails', 'CoreConstants', function (UserDetails, CoreConstants) {
//    return {
//        restrict: 'A',
//        scope: {
//            trackNavigation: '@'
//        },
//        link: function (scope, elem, attr) {
//            elem.on('click', function () {
//                var pageName, page;
//                if (scope.trackNavigation && scope.trackNavigation.length > 0) {                        
//                    var newValArr = scope.trackNavigation.split('|');
//                    if (newValArr.length === 2) {
//                        pageName = newValArr[0];
//                        page = newValArr[1];
//                    }
//                }
//                if (!pageName || !page) {
//                    console.error('track navigation values missing');
//                    return;
//                }
//                if (pageName != '') {
//                    var s = s_gi(s_account);
//                    var origLinkTrackVars = s.linkTrackVars;
//                    var origLinkTrackEvents = s.linkTrackEvents;
//                    s.linkTrackVars = 'events,channel,prop14,eVar14,eVar75,prop75,eVar75,prop60,eVar60,prop61,eVar61,prop62,eVar62,prop63,eVar63';
//                    s.linkTrackEvents = 'event31';
//                    s.events = 'event31';
//                    switch (page) {
//                        case 'home':
//                            s.prop60 = s.eVar60 = pageName;
//                            break;
//                        case 'home_page_links':
//                            s.prop61 = s.eVar61 = pageName;
//                            break;
//                        case 'summary':
//                            s.prop62 = s.eVar62 = pageName;
//                            break;
//                        case 'detailed_view':
//                            s.prop63 = s.eVar63 = pageName;
//                            break;
//                    }
//                    s.tl(this, 'o', 'Button Click');
//                    s.linkTrackVars = origLinkTrackVars;
//                    s.linkTrackEvents = origLinkTrackEvents;
//                    s.events = '';
//                    switch (page) {
//                        case 'home':
//                            s.prop60 = s.eVar60 = '';
//                            break;
//                        case 'home_page_links':
//                            s.prop61 = s.eVar61 = '';
//                            break;
//                        case 'summary':
//                            s.prop62 = s.eVar62 = '';
//                            break;
//                        case 'detailed_view':
//                            s.prop63 = s.eVar63 = '';
//                            break;
//                    }
//                }
//            });
//        }
//    };
//}]);