'use strict';

angular.module('headcountLandingPage').factory('HeadcountFormattingNumbersService', function () {
    function addCommasToNumber(number) {
        if (isNaN(number)) {
            return number;
        }
        return (number + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }

    return {
        addCommasToNumber: addCommasToNumber,        
    };
});
