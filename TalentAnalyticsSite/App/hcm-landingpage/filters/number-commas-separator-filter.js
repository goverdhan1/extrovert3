'use strict';

angular.module('headcountLandingPage').filter('NumberCommasSeparatorFilter', ['HeadcountFormattingNumbersService', function (HeadcountFormattingNumbersService) {
    return function (number) {
        return HeadcountFormattingNumbersService.addCommasToNumber(number);
    };
}]);
