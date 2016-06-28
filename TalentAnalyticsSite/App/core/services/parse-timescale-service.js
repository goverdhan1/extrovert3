'use strict';

angular.module('core').factory('ParseTimescaleService', function () {

    return {
        getPeriod: getPeriod,
        getQuarter: getQuarter,
        getYear: getYear
    };

    function getPeriod(timescale) {
        return timescale.replace(/\D/g, '').substr(6, 8);
    }
    function getQuarter(timescale) {
        return timescale.replace(/\D/g, '').substr(3, 5);
    }
    function getYear(timescale) {
        return timescale.replace(/\D/g, '').substr(6, 8);
    }

});