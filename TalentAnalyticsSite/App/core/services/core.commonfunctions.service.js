'use strict';

angular.module('core').factory('CoreFunctions', ['CoreConstants', function(CoreConstants) {
    return {
        getFormattedString: function (format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) { 
                return typeof args[number] != 'undefined'
                    ? args[number] 
                    : match
                ;
            });
        },

        getMyInformationLink: function (employeeUserId) {
            if (employeeUserId) {
                employeeUserId = employeeUserId.toLowerCase();
            }
            return this.getFormattedString("{0}profile/{1}", CoreConstants.myInformation, employeeUserId);
        },

        getDPNProfileLink: function (employeeUserId) {
            if (employeeUserId) {
                employeeUserId = employeeUserId.toLowerCase();
            }
            return this.getFormattedString("{0}profile/{1}", CoreConstants.baseDPNProfile, employeeUserId);
        },

        getBonusLink: function (employeeId, flag) {
            return this.getFormattedString(CoreConstants.employeeBonusDetailsLink, employeeId, flag);
        }
    };
}]);