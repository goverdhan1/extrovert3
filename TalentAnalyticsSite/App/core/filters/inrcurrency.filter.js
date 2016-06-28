'use strict';

angular.module('core').filter('INRCurrency', function () {

    return function (amount, symbol, showDecimals) {

        if (!amount || amount.length <= 0) {
            return null;
        }

        var symbolToUse = symbol || '₹';

        var afterPoint = '';
        if (showDecimals && amount.indexOf('.') > 0) {
            afterPoint = amount.substring(amount.indexOf('.'), amount.length);
        }

        amount = Math.floor(amount);
        amount = amount.toString();
        var lastThree = amount.substring(amount.length - 3);
        var otherNumbers = amount.substring(0, amount.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var formattedAmount = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;


        return symbolToUse + formattedAmount;

    };
});