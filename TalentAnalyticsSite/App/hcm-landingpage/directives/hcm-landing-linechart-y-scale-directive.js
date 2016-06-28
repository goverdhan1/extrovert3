'use strict';
angular.module('headcountLandingPage').directive("hcmLandingLinechartYScale", ['$compile', 'ExportData', function ($compile, ExportData) {
    return {
        restrict: 'E',
        template: '<div id="chart-y-scale" class="chart-y-scale"></div>',
        replace: true,
        scope: {},
        controller: function ($scope) {
            var height = 210,
                width = 530,
                widthWithPad = width + 40;

            function parseTick(tick) {
                var million = 1000000;
                var thousand = 1000;
                if (tick >= million) {
                    return (tick / million) + "M";
                } else if (tick >= thousand) {
                    return (tick / thousand) + "K";
                } else {
                    return tick;
                }
            }

            

            $scope.$watch(function () {
                return ExportData.yScale;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    var yAxis = d3.svg.axis().scale(newValue)
                        .orient('left')
                        .innerTickSize(width)
                        .outerTickSize(5)
                        .tickPadding(10)
                        .tickFormat(parseTick)
                        .ticks(5);
                    $("#chart-y-scale").html("");
                    $("#chart-y-scale").empty();

                    var svg = d3.select("#chart-y-scale").append("svg")
                        .attr("class", "chart")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("id", 'svgChartYScale')
                        .append("g");

                    svg.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + widthWithPad + " , 0)")
                        .call(yAxis);

                    d3.select('#svgChartYScale .domain')
                        .attr("transform", "translate(-" + width + " , 0)");

                    d3.selectAll('#svgChartYScale .y.axis .tick line')
                        .attr("x2", function () {
                            var val = d3.select(this).attr("x2");
                            return val - 5;
                        });
                }
            });
        },
        link: function (scope, element, attrs) { }
    }
}]);