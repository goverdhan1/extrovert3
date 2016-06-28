'use strict';

angular.module('core').filter('taCurrency', ['INRCurrencyFilter', 'currencyFilter', function (INRCurrencyFilter, currencyFilter) {

    return function (amount, currency) {

        if (!amount || amount.length <= 0) {
            return null;
        }

        switch(currency){
            case 'INR':
                return INRCurrencyFilter(amount, currency + ' ');
            default:
                return currencyFilter(parseInt(amount), currency + ' ', 0);
        }

    };
}]);