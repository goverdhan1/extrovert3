'use strict';
angular.module('headcountLandingPage').directive("hcmLandingLinechart", ['$compile', 'HeadcountLandingLinechartMetricsService',
    'HeadcountLandingLinechartPreviousYearMetricsService', 'HeadcountLandingcustomeFicalPeriodService', 'HeadcountLandingCustomDateSelectService',
    'hcmGetUserFiltersService', '$timeout', 'toaster', 'ExportData', 'HeadcountManagementFilterData', 'HeadcountManagementPartialPeriodDataService',
    'HeadcountFormattingNumbersService',
    function ($compile, HeadcountLandingLinechartMetricsService, HeadcountLandingLinechartPreviousYearMetricsService, HeadcountLandingcustomeFicalPeriodService,
    HeadcountLandingCustomDateSelectService, hcmGetUserFiltersService, $timeout, toaster, ExportData, HeadcountManagementFilterData, HeadcountManagementPartialPeriodDataService,
    HeadcountFormattingNumbersService) {
        return {
            restrict: 'E',
            templateUrl: 'App/hcm-landingpage/views/hcm-landing-linechart.html',
            scope: {
                lineChartGridHandler: '=',
                selectedFilter: '@',
                selectedType: '@',
                chartType: '@',
                renderChart: '&',
                updateChart: '=',
                callback: '&scrollWidthCallback',
                isPartialPeriodMessageShow: '='
            },
            controller: function ($scope) {
                var partialPeriodData;
                $scope.filterCount = 0;
                $scope.selectedItemChanged = false;
                // Display the chart on filter change
                $scope.updateChart.onSelectedFilterChange = function (filterName, selectedType, getCachedData) {
                    if ($scope.loading) {
                        console.error('Filter change firing too soon. Data for previous selection is still being retrieved');
                        return;
                    }
                    $scope.loading = true;
                    initializeData();
                    var getFunction = getCachedData ? 'getCached' : 'get';
                    var service;
                    if (filterName != "") {
                        // Call the metrics service based on the selected view type
                        switch (selectedType) {
                            case "CUSTOM-FYP":
                                service = HeadcountLandingcustomeFicalPeriodService;
                                break;
                            case "CUSTOM-CD":
                                service = HeadcountLandingCustomDateSelectService;
                                break;
                            case "STANDARD":
                                service = HeadcountLandingLinechartMetricsService;
                                break;
                            default:
                                service = HeadcountLandingLinechartMetricsService;
                                break;
                        }
                        if (selectedType === 'CUSTOM-CD') {
                            HeadcountManagementPartialPeriodDataService[getFunction]({ filterName: filterName }, function (response) {
                                if (response && response.results && response.results[0]) {
                                    partialPeriodData = response.results[0];
                                    showPartialPeriodMessage(false);
                                    if (partialPeriodData.START_DT_FLG === 'Y' || partialPeriodData.END_DT_FLG === 'Y') {
                                        showPartialPeriodMessage(true);


                                    }
                                } else {
                                    showPartialPeriodMessage(false);
                                }
                            }, function (err) {
                                showPartialPeriodMessage(false);
                                partialPeriodData = undefined;
                                var errMessage = "Get period message service returned an error";
                                console.error(errMessage, err);
                                toaster.pop('error', errMessage);
                            });
                        } else {
                            showPartialPeriodMessage(false);
                            partialPeriodData = undefined;
                        };


                        service[getFunction]({ filterName: filterName }, function (data) {

                            $scope.loading = false;
                            $scope.metricsData = data.results;
                            ExportData.filterName = filterName;
                            ExportData.selectedData = $scope.metricsData;
                            if ($scope.metricsData.length > 0) {
                                $scope.filterCount++;
                                // TODO: Implement the default chart if metrics values are less than 3
                                /*if ($scope.filterCount == 1) {
                                    if ($scope.metricsData.length > 3) {
                                        $scope.updateChart.chartType = "linechart";
                                        $scope.updateChart.lineChart = true;
                                        $scope.updateChart.barChart = false;
                                    } else {
                                        $scope.updateChart.chartType = "barchart";
                                        $scope.updateChart.lineChart = false;
                                        $scope.updateChart.barChart = true;
                                    }
                                }*/

                                $scope.reportType = ($scope.metricsData[0].CHART_SCALE).substr(0, ($scope.metricsData[0].CHART_SCALE).indexOf('-'));
                                $scope.isYOYGraph = $scope.reportType === "YOY R13" || $scope.reportType === "YOY YTD";
                                $scope.reportTypeTitle = $scope.reportType === "YOY R13" || $scope.reportType === "YOY YTD" ? ($scope.reportType === "YOY R13" ? "YoY R13" : "YoY YTD") : $scope.reportType;


                                // For YOYR13 and YOYYTD, call the metrics service for previous year metrics data of the selected filter 
                                if ($scope.isYOYGraph) {
                                    $scope.loading = true;
                                    HeadcountLandingLinechartPreviousYearMetricsService[getFunction]({ filterName: filterName
                                    }, function (data) {
                                        $scope.loading = false;
                                        var data1 = $scope.metricsData;
                                        $scope.metricsData = ($scope.metricsData).concat(data.results);
                                        $scope.displayLineChart($scope.metricsData, data1, data.results);
                                    }, function (err) {
                                        $scope.loading = false;
                                        // Tracking errors
                                        var errMessage = "No data found for the selected filter";
                                        console.error(errMessage, err);
                                        toaster.pop('error', errMessage);
                                    });
                                } else {
                                    $scope.displayLineChart($scope.metricsData, $scope.metricsData);
                                }
                                $scope.selectedItemChanged = false;
                            }

                        }, function (err) {
                            $scope.loading = false;
                            //TODO: draw an empty graph
                            // Tracking errors
                            var errMessage = "No data found for the selected filter";
                            console.error(errMessage, err);
                            toaster.pop('error', errMessage);
                        });
                    }
                }

                function initializeData() {
                    $scope.metricsData = [];
                    $scope.reportType = "";
                    if ($scope.lineChartGridHandler.onRangeChange) {
                        $scope.lineChartGridHandler.onRangeChange([]);
                    }
                }

                $scope.displayLineChart = function (data, data1, data2) {
                    if ($scope.chartType == "barchart") {
                        for (var i = 0; i < data.length; i++) {
                            data[i].CHECKID = i + 1;
                        }
                    }

                    $scope.data = data;
                    $scope.margin = { 'top': 20, 'right': 100, 'bottom': 30, 'left': 50 };
                    $scope.chart = [];
                    $scope.chart.height = 180;


                    var customLength = $scope.data.length;

                    if ($scope.data[0].CHART_SCALE == "FP") {
                        if (window.innerWidth < 1025 && customLength < 8) {
                            $scope.chart.width = $("#chart").width();
                            angular.element("#chart").css('overflow-x', 'hidden');
                        }
                        else
                        if (customLength < 8) {
                            $scope.chart.width = 500;
                            angular.element("#chart").css('overflow-x', 'hidden');
                        }
                        else {
                            $scope.chart.width = customLength * 70;
                            angular.element("#chart").css('overflow-x', 'auto');
                        }
                    }
                    else if ($scope.data[0].CHART_SCALE == "FY") {
                        if (window.innerWidth < 1025 && customLength < 8) {
                            $scope.chart.width = angular.element("#chart").width();
                            angular.element("#chart").css('overflow-x', 'hidden');
                        }
                        else if (customLength < 8) {
                            $scope.chart.width = 500;
                            angular.element("#chart").css('overflow-x', 'hidden');
                        }
                        else {

                            $scope.chart.width = customLength * 70;
                            angular.element("#chart").css('overflow-x', 'auto');
                        }
                    }
                    else if ($scope.data[0].CHART_SCALE == "FQ") {
                        if (window.innerWidth < 1025 && customLength < 8) {
                            $scope.chart.width = angular.element("#chart").width();;
                            angular.element("#chart").css('overflow-x', 'hidden');
                        }
                        else if (customLength < 8) {
                            $scope.chart.width = 500;
                            angular.element("#chart").css('overflow-x', 'hidden');
                        }
                        else {

                            $scope.chart.width = customLength * 70;
                            angular.element("#chart").css('overflow-x', 'auto');
                        }
                    }
                    else if ($scope.data[0].CHART_SCALE == "DY") {
                        if (window.innerWidth < 1024 && customLength < 8) {
                            $scope.chart.width = angular.element("#chart").width();
                            angular.element("#chart").css('overflow-x', 'hidden');
                        }
                        else if (customLength < 8) {
                            $scope.chart.width = angular.element("#chart").width();
                            angular.element("#chart").css('overflow-x', 'hidden');
                        }
                        else {
                            $scope.chart.width = customLength * 70;
                            angular.element("#chart").css('overflow-x', 'auto');
                        }
                    }
                    else {
                        $scope.chart.width = angular.element("#chart").width();
                        angular.element("#chart").css('overflow-x', 'hidden');
                    }


                    if ($scope.data.length > 0) {
                        $scope.chart.chartScale = ($scope.data[0].CHART_SCALE).substr(($scope.data[0].CHART_SCALE).indexOf("-") + 1);
                        $scope.isYOYFYGraph = $scope.isYOYGraph && $scope.chart.chartScale === 'FY';
                    }

                    // Define xDomain min and max values
                    $scope.chart.xMinDomainValue = 0.5;
                    $scope.chart.xMaxDomainValue = $scope.getMaxXDomainValue($scope.chart.xMinDomainValue, data1, data2, $scope.isYOYFYGraph);

                    // Define yDomain min and max values
                    $scope.chart.yMinDomainValue = 0;
                    $scope.chart.yMaxDomainValue = d3.max($scope.data, function (d) { if (d.ENDING_HC === 0) { return d.ENDING_HC + 100; } else { return d.ENDING_HC; } });

                    // Define x and y scales
                    if ($scope.chartType == "linechart") {
                        $scope.chart.xScale = d3.scale.linear()
                            .domain([$scope.chart.xMinDomainValue, $scope.chart.xMaxDomainValue])
                            .range([0, $scope.chart.width]);
                    } else if ($scope.chartType == "barchart") {
                        var rangeWidth, padding;
                        if ($scope.isYOYGraph) {
                            $scope.data1 = $scope.data.slice(0, ($scope.data.length) / 2);
                            var data = [];
                            var period = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13]];
                            var year = [];

                            for (var i = 0; i < ($scope.data.length / 2) ; i++) {
                                data[i] = {};
                                data[i].CURR_ENDING_HC = data2[i].ENDING_HC; //$scope.data1[i].ENDING_HC;
                                data[i].PREV_ENDING_HC = $scope.data1[i].ENDING_HC //data2[i].ENDING_HC;
                                data[i].TIME_SCALE = $scope.data1[i].TIME_SCALE;
                                year.push([data2[i].TIME_SCALE, $scope.data1[i].TIME_SCALE]);
                            }

                            var headcounts = d3.keys(data[0]).filter(function (key) { return (key !== "TIME_SCALE") });

                            data.forEach(function (d, i) {
                                d.HEADCOUNT = headcounts.map(function (name) { return { name: name, value: +d[name], p: i } });
                            });

                            var color = d3.scale.ordinal()
                                .range(["#81bc00", "#345391"]);

                            if ($scope.data.length == 2) {
                                rangeWidth = 0.9;
                            } else {
                                rangeWidth = 0.1;
                            }

                            if ($scope.reporttype == "YOY R13") {
                                padding = 0.1;
                            } else {
                                padding = 0;
                            }

                            $scope.chart.xScale = d3.scale.ordinal().rangeRoundBands([0, $scope.chart.width], rangeWidth, 0)
                                .domain(data.map(function (d) { return d.TIME_SCALE; }));
                            $scope.chart.xScale1 = d3.scale.ordinal().rangeRoundBands([0, $scope.chart.xScale.rangeBand()], padding, rangeWidth)
                                .domain(headcounts);
                        } else {
                            if ($scope.data.length == 1) {
                                rangeWidth = 0.7;
                            } else if ($scope.data.length == 2) {
                                rangeWidth = 0.5;
                            } else if ($scope.data.length == 3) {
                                rangeWidth = 0.3;
                            } else {
                                rangeWidth = 0.1;
                            }
                            if ($scope.data[0].CHART_SCALE == "DY") {
                                if ($scope.data.length < 8) {
                                    $scope.chart.xScale = d3.scale.ordinal()
                             .rangeRoundBands([0, $scope.chart.width], rangeWidth)
                             .domain($scope.data.map(function (d) { if ($scope.data[0].CHART_SCALE == "DY") { return d.CHECKID; } else { return d.CHECKID; } }));
                                }
                                else {
                                    $scope.chart.xScale = d3.scale.ordinal()
                                 .rangeRoundBands([0, $scope.chart.width], rangeWidth, 0)
                                 .domain($scope.data.map(function (d) { if ($scope.data[0].CHART_SCALE == "DY") { return d.CHECKID; } else { return d.CHECKID; } }));
                                }
                            }
                            else {
                                $scope.chart.xScale = d3.scale.ordinal()
                           .rangeRoundBands([0, $scope.chart.width], rangeWidth)
                           .domain($scope.data.map(function (d) {
                               if ($scope.data[0].CHART_SCALE == "DY") { return d.CHECKID; } else {
                                   return d.CHECKID;
                               }
                           }));
                            }


                        }
                    }

                    $scope.chart.yScale = d3.scale.linear()
                        .domain([$scope.chart.yMinDomainValue, $scope.chart.yMaxDomainValue])
                        .range([$scope.chart.height, 0]);

                    // Define x and y axis
                    $scope.chart.xAxis = d3.svg.axis().scale($scope.chart.xScale).orient('bottom');
                    $scope.chart.yAxis = d3.svg.axis().scale($scope.chart.yScale).orient('left');

                    $scope.chart.getFirstTickValue = 2 * ($scope.chart.yAxis.scale().ticks($scope.chart.yAxis.ticks()[0]))[1];
                    $scope.chart.yScale.domain([$scope.chart.yMinDomainValue, $scope.chart.yMaxDomainValue + $scope.chart.getFirstTickValue]);

                    // Set ticks on xAxis
                    $scope.chart.xAxis.ticks($scope.chart.xMaxDomainValue - $scope.chart.xMinDomainValue);
                    ExportData.yScale = $scope.chart.yScale;
                    function checkForPartialPeriodYear(perion) {
                        if (!partialPeriodData) {
                            return false;
                        } else {
                            perion = perion.slice(-2);
                            var startTimeScale = partialPeriodData.START_TIME_SCALE.slice(-2);
                            var endTimeScale = partialPeriodData.END_TIME_SCALE.slice(-2);
                            var partialStart = startTimeScale === perion && partialPeriodData.START_DT_FLG === 'Y';
                            var partialEnd = endTimeScale === perion && partialPeriodData.END_DT_FLG === 'Y';
                            if (partialStart || partialEnd) {
                                return true;
                            }
                        }
                    };

                    // Set tick format on xAxis
                    if ($scope.chart.chartScale == 'FY') {
                        if ($scope.isYOYGraph) {
                            var tickFormatData1 = data1,
                                tickFormatData2 = data2,
                                tickFormatData;
                            debugger
                            if ($scope.reportType == "YOY R13" && data1.length > 1 && data2.length > 1) {
                                tickFormatData1.shift();
                                tickFormatData = (tickFormatData1).concat(tickFormatData2);
                            }
                            tickFormatData = (tickFormatData2).concat(tickFormatData1);
                        }

                        $scope.chart.xAxis.tickFormat(function (d, i) {
                            if ($scope.reportType == "YOY R13" && $scope.chartType === "linechart") {
                                return tickFormatData[i].TIME_SCALE.substr(5, 5);
                            } else if ($scope.reportType == "YOY YTD" && $scope.chartType === "linechart") {
                                return (tickFormatData[i]).TIME_SCALE;
                            } else if ($scope.isYOYGraph && $scope.chart.chartScale == 'FY' && $scope.chartType == "barchart") {
                                return "";
                            } else if ($scope.isYOYGraph && $scope.chart.chartScale == 'FY' && $scope.chartType == "linechart") {
                                return tickFormatData[i].TIME_SCALE;
                            } else {
                                if ($scope.reportType === "R13") {
                                    return (data[i]).TIME_SCALE.substr(5, 5);
                                } else {
                                    var tick = (data[i]).TIME_SCALE;
                                    if (checkForPartialPeriodYear(data[i].TIME_SCALE)) {
                                        tick += '*';
                                    };
                                    return tick;
                                }
                            }
                        });

                    } else {
                        if ($scope.data[0].CHART_SCALE == "FP") {
                            $scope.chart.xAxis.tickFormat(function (d, i) {
                                var tick = data[i].TIME_SCALE.substr(5, 5);
                                return checkPartialPeriod(tick, i, $scope.data.length - 1);
                            });
                        }
                        else if ($scope.data[0].CHART_SCALE == "FQ") {
                            $scope.chart.xAxis.tickFormat(function (d, i) {
                                var tick = (data[i].TIME_SCALE).substr(5, 5);
                                return checkPartialPeriod(tick, i, $scope.data.length - 1);
                            });
                        }
                        else if ($scope.data[0].CHART_SCALE == "DY") {
                            $scope.chart.xAxis.tickFormat(function (d, i) {
                                var tick = d3.time.format('%m-%d-%Y')(new Date(data[i].TIME_SCALE));
                                return tick;
                            });
                        } else {
                            $scope.chart.xAxis.tickFormat(function (d, i) {
                                var tick = (data[i].TIME_SCALE).substr(5, 5);
                                return checkPartialPeriod(tick, i, $scope.data.length - 1);
                            });
                        }
                    }

                    function checkPartialPeriod(tick, number, lastNumber) {
                        if (!partialPeriodData || tick.slice(-1) === '*') {
                            return tick;
                        };
                        if (partialPeriodData.END_DT_FLG === "Y" && number === lastNumber) {
                            tick += '*';
                        } else if (partialPeriodData.START_DT_FLG === "Y" && number === 0) {
                            tick += '*';
                        };
                        return tick;
                    };

                    // Define SVG
                    d3.select("#chart")
                    $("#chart").html("");
                    $("#chart").empty();
                    $scope.chart.svg = d3.select("#chart").append("svg")
                        .attr("class", "chart")
                        .attr("width", $scope.chart.width + 50)
                        .attr("height", $scope.chart.height +65)
                        .attr("id", 'svgChart')
                        .append("g");

                    //$scope.chart.svg.selectAll(".hline").data(d3.range(5)).enter()
                    //    .append("line")
                    //    .attr("y1", function (d) {
                    //        return d * (($scope.chart.height + 1) / 5);
                    //    })
                    //    .attr("y2", function (d) {
                    //        return d * (($scope.chart.height + 1) / 5);
                    //    })
                    //    .attr("x1", function (d) {
                    //        return 0;
                    //    })
                    //    .attr("x2", function (d) {
                    //        return $scope.chart.width;
                    //    })
                    //    .style("stroke", "#ddd");
                        

                    if ($scope.chartType == "barchart") {
                        var textPadding;
                        if ($scope.selectedType === "STANDARD" && !$scope.chart.chartScale === "FY") {
                            textPadding = "10px";
                        } else if ($scope.selectedType === "STANDARD" && $scope.chart.chartScale === "FY" && !$scope.reportType === "R13") {
                            textPadding = "20px";
                        } else if ($scope.selectedType === "STANDARD" && $scope.chart.chartScale === "FY" && $scope.reportType === "R13") {
                            textPadding = "10px";
                        } else if ($scope.selectedType === "STANDARD" && $scope.chart.chartScale === "FY" && $scope.reportType === "YOY R13") {
                            textPadding = "110px";
                        } else if ($scope.selectedType === "STANDARD" && $scope.chart.chartScale === "FP") {
                            textPadding = "8px";
                        } else if ($scope.selectedType === "CUSTOM-FYP" && ($scope.chart.chartScale === "FP")) {
                            textPadding = "10px";
                        } else if ($scope.selectedType === "CUSTOM-FYP" && ($scope.chart.chartScale === "FQ")) {
                            textPadding = "10px";
                        } else if ($scope.selectedType === "CUSTOM-FYP" && ($scope.chart.chartScale === "DY")) {
                            textPadding = "42px";
                        } else if ($scope.selectedType === "CUSTOM-CD" && ($scope.chart.chartScale === "FY")) {
                            textPadding = "20px";
                        } else if ($scope.selectedType === "CUSTOM-CD" && ($scope.chart.chartScale === "FQ")) {
                            textPadding = "10px";
                        }else if ($scope.selectedType === "CUSTOM-CD" && ($scope.chart.chartScale === "FP")) {
                            textPadding = "10px";
                        } else if ($scope.selectedType === "CUSTOM-CD") {
                            textPadding = "32px";
                        } else {
                            textPadding = "10px";
                        }
                        $scope.chart.svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + $scope.chart.height + ")")
                            .call($scope.chart.xAxis)
                            .selectAll("text")
                            .style("text-anchor", "end")
                            .attr("dx", textPadding);

                        // Define the div for the tooltip
                        var div = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);

                        if ($scope.isYOYGraph) {
                            var state = $scope.chart.svg.selectAll(".state")
                                .data(data)
                            .enter().append("g")
                                .attr("class", "g")
                                .attr("transform", function (d) {
                                    return "translate(" + $scope.chart.xScale(d.TIME_SCALE) + ",0)";
                                });

                            state.selectAll("rect")
                                .data(function (d) { return d.HEADCOUNT; })
                                .enter().append("rect")
                                .attr("class", "bar")
                                .attr("width", $scope.chart.xScale1.rangeBand())
                                .attr("x", function (d) {
                                    return $scope.chart.xScale1(d.name);
                                })
                                .attr("y", function (d) { return $scope.chart.yScale(d.value); })
                                .attr("height", function (d) { return $scope.chart.height - $scope.chart.yScale(d.value); })
                                .style("fill", function (d) { return color(d.name); })
                                .on("mouseover", function (d, i) {
                                    var htmlContent;
                                    if ($scope.chart.chartScale == "FY") {
                                        if (i == 0) {
                                            htmlContent = "Fiscal Year:" + "<span class='chartscaleFY'>" + checkPartialTimeScale(data2[0]) + "</span><br/>" + "Headcount:" + "<span class='hcountFY'>" + addCommasToNumber(d.value) + "</span>"
                                        } else {
                                            htmlContent = "Fiscal Year:" + "<span class='chartscaleFY'>" + checkPartialTimeScale($scope.data1[0]) + "</span><br/>" + "Headcount:" + "<span class='hcountFY'>" + addCommasToNumber(d.value) + "</span>"
                                        }
                                    } else {

                                        htmlContent = "Fiscal Period/year:" + "<span class='chartscaleFP'>" + checkForPartialPeriodYear(year[d.p][i]) ? year[d.p][i] + '*' : year[d.p][i] + "</span><br/>" + "Headcount:" + "<span class='hcount'>" + addCommasToNumber(d.value) + "</span>"
                                    }

                                    div.transition()
                                        .duration(200)
                                        .style("opacity", 1);
                                    div.html(htmlContent)
                                        .style("left", (d3.event.pageX - 90) + "px")
                                        .style("top", (d3.event.pageY - 55) + "px");
                                })
                                .on("mouseout", function (d) {
                                    div.transition()
                                        .duration(500)
                                        .style("opacity", 0);
                                });

                            if ($scope.chart.chartScale == "FY") {
                                state.selectAll("text")
                                  .data(function (d) { return d.HEADCOUNT; })
                                .enter().append("text")
                                  .attr("x", function (d, i) {
                                      if ($scope.reportType == "YOY R13") {
                                          if (i == 0) {
                                              return $scope.chart.xScale1(d.name) + 40;
                                          } else {
                                              return $scope.chart.xScale1(d.name) + 40;
                                          }

                                      } else {
                                          return ($scope.chart.xScale1(d.name) + $scope.chart.xScale1.rangeBand() / 2) - 20;
                                      }
                                  })
                                  .attr("y", function (d, i) { return $scope.chart.height + 18; })
                                  .text(function (d, i) {
                                      if ($scope.reportType == "YOY R13") {
                                          if (i === 0) {
                                              return data2[0].TIME_SCALE.substr(5,5);
                                          } else {
                                              return $scope.data1[0].TIME_SCALE.substr(5,5);
                                          }
                                      }
                                      else if ($scope.reportType == "YOY YTD") {
                                          return tickFormatData[i].TIME_SCALE;
                                      }

                                      else {
                                          return $scope.data[i].TIME_SCALE;
                                      }
                                  });
                            }
                        } else {
                            $scope.chart.svg.selectAll("bar")
                                .data($scope.data)
                                .enter().append("rect")
                                .attr("class", "bar")
                                .style("fill", "#345391")
                                .attr("x", function (d) { if ($scope.data[0].CHART_SCALE == "DY") { return $scope.chart.xScale(d.CHECKID); } else { return $scope.chart.xScale(d.CHECKID); } })
                                .attr("width", $scope.chart.xScale.rangeBand())
                                .attr("y", function (d) { return $scope.chart.yScale(d.ENDING_HC); })
                                .attr("height", function (d) { return $scope.chart.height - $scope.chart.yScale(d.ENDING_HC); })
                                .on("mouseover", function (d) {
                                    var htmlContent;
                                    var timeScale = checkPartialTimeScale(d);
                                    if ($scope.chart.chartScale == "FY") {
                                        if ($scope.reportType === "R13") {
                                            htmlContent = "Fiscal Year:" + "<span class='chartscaleFY'>" + timeScale + "</span><br/>" + "Headcount:" + "<span class='hcountFY'>" + addCommasToNumber(d.ENDING_HC) + "</span>"
                                        } else if ($scope.reportType === "YOY R13") {
                                            htmlContent = "Fiscal Year:" + "<span class='chartscaleFY'>" + timeScale + "</span><br/>" + "Headcount:" + "<span class='hcountFY'>" + addCommasToNumber(d.ENDING_HC) + "</span>"
                                        } else {
                                            htmlContent = "Fiscal Year:" + "<span class='chartscaleFY'>" + timeScale + "</span><br/>" + "Headcount:" + "<span class='hcountFY'>" + addCommasToNumber(d.ENDING_HC) + "</span>"
                                        }
                                    } else if ($scope.data[0].CHART_SCALE == "FQ") {
                                        htmlContent = "Fiscal Quarter/year:" + "<span class='chartscaleFP'>" + timeScale + "</span><br/>" + "Headcount:" + "<span class='hcount'>" + " " + addCommasToNumber(d.ENDING_HC) + "</span>"
                                    } else if ($scope.data[0].CHART_SCALE == "DY") {
                                        div.attr('class', 'tooltip day-tooltip');
                                        htmlContent = "Day:" + "<span class='chartscaleDY'>" + timeScale + "</span><br/>" + "Headcount:" + "<span class='hcount'>" + addCommasToNumber(d.ENDING_HC) + "</span>"
                                    } else {
                                        htmlContent = "Fiscal Period/year:" + "<span class='chartscaleFP'>" + timeScale  + "</span><br/>" + "Headcount:" + "<span class='hcount'>" + addCommasToNumber(d.ENDING_HC) + "</span>"
                                    }
                                    div.transition()
                                        .duration(200)
                                        .style("opacity", 1);
                                    div.html(htmlContent)
                                        .style("left", (d3.event.pageX - 90) + "px")
                                        .style("top", (d3.event.pageY - 55) + "px");
                                })
                                .on("mouseout", function (d) {
                                    div.transition()
                                        .duration(500)
                                        .style("opacity", 0);
                                });

                        }

                    } else if ($scope.chartType == "linechart") {
                        // Draw xAxis
                        $scope.chart.svg.append('g')
                            .attr("class", "axis")
                            .attr("transform", "translate(0," + $scope.chart.height + ")")
                            .call($scope.chart.xAxis);

                        if ($scope.isYOYGraph) {
                            $scope.chart.svg.selectAll(".tick text")
                                .attr("y", "16");
                        }
                    }

                    // Define line
                    $scope.chart.line = d3.svg.line()
                        .x(function (d, i) { return $scope.chart.xScale(i + 1); })
                        .y(function (d) { return $scope.chart.yScale(d.ENDING_HC); })
                        .defined(function (d) { return !isNaN(d.ENDING_HC) });

                    // Draw path line
                    $scope.chart.drawPathLine = function (data, className) {
                        $scope.chart.svg.append("path")
                            .attr("class", className)
                            .datum(data)
                            .attr("d", $scope.chart.line);
                    }

                    // Add scatterplot
                    $scope.chart.addScatterPlot = function (data, dyValue, className) {
                        // Define the div for the tooltip
                        var div = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);

                        $scope.chart.svg.selectAll("dot")
                            .data(data)
                            .enter().append("circle")
                            .attr("r", function (d) { if (!isNaN(d.ENDING_HC)) { return 1; } })
                            .attr("cx", function (d, i) { return $scope.chart.xScale(i + 1); })
                            .attr("cy", function (d) { if (!isNaN(d.ENDING_HC)) { return $scope.chart.yScale(d.ENDING_HC); } })
                            .attr("class", className);

                        $scope.chart.svg.selectAll(className)
                          .data(data)
                          .enter().append("text")
                          .attr("class", "label")
                          .attr("x", function (d, i) { return $scope.chart.xScale(i + 1); })
                          .attr("y", function (d) { if (!isNaN(d.ENDING_HC)) { return $scope.chart.yScale(d.ENDING_HC); } })
                          .attr("dx", "-8")
                          .attr("dy", dyValue)
                          .text(function (d) { return addCommasToNumber(d.ENDING_HC); })
                            .on("mouseover", function (d) {
                                var htmlContent;
                                var timeScale = checkPartialTimeScale(d);
                                if ($scope.chart.chartScale == "FY") {
                                    if ($scope.reportType === "R13") {
                                        htmlContent = "Fiscal Year:" + "<span class='chartscaleFY'>" + timeScale + "</span><br/>" + "Headcount:" + "<span class='hcountFY'>" + addCommasToNumber(d.ENDING_HC) + "</span>"
                                    } else if ($scope.reportType === "YOY R13") {
                                        htmlContent = "Fiscal Year:" + "<span class='chartscaleFY'>" + timeScale + "</span><br/>" + "Headcount:" + "<span class='hcountFY'>" + addCommasToNumber(d.ENDING_HC) + "</span>"
                                    } else {
                                        htmlContent = "Fiscal Year:" + "<span class='chartscaleFY'>" + timeScale + "</span><br/>" + "Headcount:" + "<span class='hcountFY'>" + addCommasToNumber(d.ENDING_HC) + "</span>"
                                    }
                                } else if ($scope.data[0].CHART_SCALE == "FQ") {
                                    htmlContent = "Fiscal Quarter/year:" + "<span class='chartscaleFP'>" + timeScale + "</span><br/>" + "Headcount:" + "<span class='hcount'>" + " " + addCommasToNumber(d.ENDING_HC) + "</span>"
                                } else if ($scope.data[0].CHART_SCALE == "DY") {
                                    htmlContent = "Day:" + "<span class='chartscaleDY'>" + timeScale + "</span><br/>" + "Headcount:" + "<span class='hcount'>" + addCommasToNumber(d.ENDING_HC) + "</span>"
                                } else {
                                    htmlContent = "Fiscal Period/year:" + "<span class='chartscaleFP'>" + timeScale + "</span><br/>" + "Headcount:" + "<span class='hcount'>" + addCommasToNumber(d.ENDING_HC) + "</span>"
                                }
                                div.transition()
                                    .duration(200)
                                    .style("opacity", 1);
                                div.html(htmlContent)
                                    .style("left", (d3.event.pageX - 90) + "px")
                                    .style("top", (d3.event.pageY - 55) + "px");
                            })
                            .on("mouseout", function (d) {
                                div.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            });
                    }

                    if ($scope.isYOYGraph) {
                        $scope.data1 = $scope.data.slice(0, ($scope.data.length) / 2);
                        if ($scope.reportType === "YOY R13" && $scope.chart.chartScale == "FP") {
                            $scope.data1FY1 = ($scope.data1[0].TIME_SCALE).substr(0, 4);
                            $scope.data1FY2 = ($scope.data1[$scope.data1.length - 1].TIME_SCALE).substr(0, 4);
                            $scope.data2FY1 = (data2[0].TIME_SCALE).substr(0, 4);
                            $scope.data2FY2 = (data2[data2.length - 1].TIME_SCALE).substr(0, 4);
                        } else if ($scope.reportType === "YOY R13" && $scope.chart.chartScale == "FY") {
                            $scope.data1FY1 = ($scope.data1[0].TIME_SCALE).substr(31, 4);
                            $scope.data1FY2 = ($scope.data1[$scope.data1.length - 1].TIME_SCALE).substr(31, 4);
                            $scope.data2FY1 = (data2[0].TIME_SCALE).substr(31, 4);
                            $scope.data2FY2 = (data2[data2.length - 1].TIME_SCALE).substr(31, 4);
                        } else {
                            $scope.data1FY1 = ($scope.data1[0].TIME_SCALE).substr(0, 4);
                            $scope.data1FY2 = ($scope.data1[$scope.data1.length - 1].TIME_SCALE).substr(0, 4);
                            $scope.data2FY1 = (data2[0].TIME_SCALE).substr(0, 4);
                            $scope.data2FY2 = (data2[data2.length - 1].TIME_SCALE).substr(0, 4);
                        }

                        if ($scope.data1FY1 === $scope.data1FY2) {
                            $scope.FY1 = $scope.data1FY1;
                        } else {
                            $scope.FY1 = $scope.data1FY1 + "-" + $scope.data1FY2;
                        }

                        if ($scope.data2FY1 === $scope.data2FY2) {
                            $scope.FY2 = $scope.data2FY1;
                        } else {
                            $scope.FY2 = $scope.data2FY1 + "-" + $scope.data2FY2;
                        }
                    }


                    // Display data in a grid that is selected by brush on line chart
                    $scope.tabulateBrushedData = function () {
                        var brushData = [];
                        if ($scope.isYOYGraph) {
                            if ($scope.chartType == "linechart") {
                                // Data for YOYR13 and YOYYTD line charts
                                    var brushData1 = $scope.data1;
                                    var brushData2 = data2;                                
                                for (i = 0; i < brushData1.length; i++) {
                                    brushData.push(brushData2[i]);
                                    if (!brushData1[i] == "") {
                                        brushData.push(brushData1[i]);
                                    }
                                }
                                if ($scope.chart.chartScale == "FY") {
                                    var brushData = brushData2.concat(brushData1);
                                }
                            }
                            if ($scope.chartType == "barchart") {    
                                var brushData1 = $scope.data1;
                                var brushData2 = data2;                               
                                for (i = 0; i < brushData1.length; i++) {
                                    if (brushData1.length > 13) {
                                            brushData.push(brushData2[i]);
                                            if (!brushData1[i] == "") {
                                                brushData.push(brushData1[i]);
                                            }
                                    }
                                    else {
                                        brushData.push(brushData2[i]);
                                        if (!brushData1[i] == "") {
                                            brushData.push(brushData1[i]);
                                        }
                                    }
                                }
                            }

                            for (i = 0; i < brushData.length; i++) {
                                for (var key in brushData[i]) {
                                    if ($scope.chart.chartScale == "FY") {
                                        $scope.timeScale = brushData[i].TIME_SCALE;
                                        if ($scope.reportType === "YOY R13") {
                                            brushData[i].FY = $scope.timeScale;
                                        } else {
                                            brushData[i].FY = $scope.timeScale;
                                        }

                                        brushData[i].PERIOD = "";
                                        brushData[i].FY_PERIOD = brushData[i].FY;
                                    } else {
                                        $scope.timeScale = brushData[i].TIME_SCALE;
                                        brushData[i].FY = $scope.timeScale;
                                        brushData[i].PERIOD = $scope.timeScale;
                                        brushData[i].FY_PERIOD = brushData[i].PERIOD;
                                    }
                                }
                            }

                        } else {
                            if ($scope.isPartialPeriodMessageShow.graph) {
                                data = processDateLabels(data);
                            }
                        }
                        
                        if ($scope.lineChartGridHandler.onRangeChange) {
                            if ($scope.isYOYGraph) {
                                $scope.lineChartGridHandler.onRangeChange(brushData);
                            }
                            else{
                            $scope.lineChartGridHandler.onRangeChange($scope.metricsData);
                        }
                    }
                    }

                    function processDateLabels(data, brushData) {
                        for (i = 0; i < data.length; i++) {
                            var timeScale = data[i].TIME_SCALE;
                            $scope.FY = timeScale;
                            data[i].FY = timeScale;
                            data[i].FY_PERIOD = timeScale;
                            data[i].PERIOD = "";
                            $scope.isPartialPeriodMessageShow.partialValues = "";
                            data[i].isPartialTimeScale = false;

                            switch ($scope.chart.chartScale) {
                                case "FY":
                                    if (checkForPartialPeriodYear(timeScale)) {
                                        data[i].isPartialTimeScale = true;
                                        $scope.isPartialPeriodMessageShow.partialValues = "Fiscal Year";
                                        break;
                                    }
                                case "FP":
                                    data[i].isPartialTimeScale = checkForPartialPeriod(data[i].TIME_SCALE);
                                    $scope.isPartialPeriodMessageShow.partialValues = "Period";
                                    break;

                                case "FQ":
                                    data[i].isPartialTimeScale = checkForPartialPeriod(data[i].TIME_SCALE);
                                    $scope.isPartialPeriodMessageShow.partialValues = "Quarter";
                                    break;

                                default:
                                    break;
                            }
                        };

                        return data;
                    };

                    function checkForPartialPeriod(perion) {
                        if (!partialPeriodData) {
                            return false;
                        } else {
                            if (partialPeriodData.CHART_SCALE === "FQ") {
                                var scale = "Q";

                            } else if ("FP") {
                                var scale = "P";
                            }
                            var startTimeScaleYear = partialPeriodData.START_TIME_SCALE.slice(2, 4);
                            if (partialPeriodData.START_TIME_SCALE.slice(-2, -1) === "0") {
                                var startTimeScaleQuartal = partialPeriodData.START_TIME_SCALE.slice(-1);
                            } else {
                                var startTimeScaleQuartal = partialPeriodData.START_TIME_SCALE.slice(-2);
                            }
                            var startTimeScale = "FY" + startTimeScaleYear + ", " + scale + startTimeScaleQuartal;
                            var endTimeScaleYear = partialPeriodData.END_TIME_SCALE.slice(2, 4);

                            if (partialPeriodData.END_TIME_SCALE.slice(-2, -1) === "0") {
                                var endTimeScaleQuartal = partialPeriodData.END_TIME_SCALE.slice(-1);
                            } else {
                                var endTimeScaleQuartal = partialPeriodData.END_TIME_SCALE.slice(-2);
                            }
                            var endTimeScale = "FY" + endTimeScaleYear + ", " + scale +endTimeScaleQuartal;
                            var partialStart = startTimeScale === perion && partialPeriodData.START_DT_FLG === 'Y';
                            var partialEnd = endTimeScale === perion && partialPeriodData.END_DT_FLG === 'Y';
                            if (partialStart || partialEnd) {
                                return true;
                            }
                        }
                    };                    

                    // Define brush for line chart
                    $scope.brush = d3.svg.brush()
                          .x($scope.chart.xScale)
                          .on("brush", $scope.drawBrush)
                          .on("brushend", $scope.tabulateBrushedData);

                    // Add legend
                    $scope.chart.addLegend = function () {
                        $scope.chart.legend = $scope.chart.svg.append("g")
                          .attr("class", "legend")
                          .attr("x", 20)
                          .attr("y", 55)
                          .attr("height", 100)
                          .attr("width", $scope.chart.width)
                          .attr("transform", "translate(0," + ($scope.chart.height - 5 ) + ")");


                        // Append rect to legend
                        $scope.chart.appendRectToLegend = function (x, y, width, height, className) {
                            $scope.chart.legend.append("rect")
                              .attr("x", x)
                              .attr("y", y)
                              .attr("width", width)
                              .attr("height", height)
                              .attr("class", className)
                        }

                        // Append text to legend
                        $scope.chart.appendTextToLegend = function (x, y, className, text) {
                            $scope.chart.legend.append("text")
                              .attr("x", x)
                              .attr("y", y)
                              .attr("class", className)
                              .text(text);
                        }

                        switch ($scope.reportType) {
                            case "R13":
                                $scope.chart.appendRectToLegend(0, 45, $scope.chart.width, 1, "rectR13");
                                $scope.chart.appendTextToLegend(($scope.chart.width / 2) + -15, 58, "rectR13", ($scope.data[0].TIME_SCALE).substr(0, 4));
                                break;
                            case "YOY R13":
                                if ($scope.chart.chartScale === "FP") {
                                    $scope.chart.appendRectToLegend(0, 45, 8, 8, "rect2YOY");
                                    $scope.chart.appendTextToLegend(10, 52, "textYOY", $scope.FY2);
                                    $scope.chart.appendRectToLegend(125, 45, 8, 8, "rect1YOY");
                                    $scope.chart.appendTextToLegend(135, 52, "textYOY", $scope.FY1);
                                } else {
                                    $scope.chart.appendRectToLegend(0, 45, 8, 8, "rect2YOY");
                                    $scope.chart.appendTextToLegend(10, 52, "textYOY", $scope.data[1].TIME_SCALE);
                                    $scope.chart.appendRectToLegend(110, 45, 8, 8, "rect1YOY");
                                    $scope.chart.appendTextToLegend(120, 52, "textYOY", $scope.data[0].TIME_SCALE);
                                }
                                break;
                            case "YOY YTD":
                                $scope.chart.appendRectToLegend(0, 45, 8, 8, "rect2YOY");
                                $scope.chart.appendTextToLegend(10, 52, "textYOY", $scope.FY2);
                                $scope.chart.appendRectToLegend(125, 45, 8, 8, "rect1YOY");
                                $scope.chart.appendTextToLegend(135, 52, "textYOY", $scope.FY1);
                                break;
                            case "YTD":
                                if ($scope.chart.chartScale == "FP") {
                                    $scope.chart.appendRectToLegend(0, 45, $scope.chart.width, 1, "rectYTD");
                                    $scope.chart.appendTextToLegend(($scope.chart.width / 2) - 17, 58, "textYTD", ($scope.data[0].TIME_SCALE).substr(0, 4));
                                };
                                break;
                            case "PTD":
                                if ($scope.chart.chartScale == "FP") {
                                    $scope.chart.appendRectToLegend(0, 45, $scope.chart.width, 1, "rectYTD");
                                    $scope.chart.appendTextToLegend(($scope.chart.width / 2) + -17, 58, "textYTD", ($scope.data[0].TIME_SCALE).substr(0, 4));
                                    }
                                break;
                            default:
                                $scope.chart.appendRectToLegend();
                        }
                    }

                    if ($scope.isYOYGraph) {
                        if ($scope.chartType == 'linechart') {
                            if ($scope.isYOYFYGraph) {
                                var emptyObject = {};
                                $scope.data1.unshift(emptyObject);
                            }
                            $scope.chart.drawPathLine($scope.data1, "line1");
                            $scope.chart.addScatterPlot($scope.data1, -16, "label1");
                            $scope.chart.drawPathLine(data2, "line2");
                            if (data2.length == 1) {
                                $scope.chart.addScatterPlot(data2, -10, "label2");
                            } else {
                                $scope.chart.addScatterPlot(data2, 13, "label2");
                            }
                        }

// Comments code can be removed once done the all scenerios integration and testing.

                        //if ($scope.data1.length > 13 && $scope.chartType == 'linechart') {
                        //    $scope.drawBrush(($scope.data1.length - 13) + 0.5, ($scope.data1.length + 0.5));
                        //} else if ($scope.data1.length > 13 && $scope.chartType == 'barchart') {
                        //    $scope.chart.yScale.domain($scope.chart.xScale.range()).range($scope.chart.xScale.domain());
                        //    $scope.drawBrush($scope.chart.yScale.invert($scope.data1[$scope.data1.length - $scope.data1.length].TIME_SCALE), $scope.chart.yScale.invert(($scope.data1[$scope.data1.length - 1].TIME_SCALE)));
                        //}
                        $scope.tabulateBrushedData($scope.data1);
                    } else {
                        if ($scope.chartType == 'linechart') {
                            $scope.chart.drawPathLine($scope.data, "line1");
                            $scope.chart.addScatterPlot($scope.data, -6, "label1");
                        }
                        //if ($scope.data.length > 5 && $scope.chartType == 'linechart') {
                        //    $scope.drawBrush((($scope.data.length - $scope.data.length) + 0.5), ($scope.data.length + 0.5));
                        //} else if ($scope.data.length > 3 && $scope.chartType == 'barchart') {
                        //    $scope.chart.yScale.domain($scope.chart.xScale.range()).range($scope.chart.xScale.domain());
                        //    if ($scope.data[0].CHART_SCALE == "DY") {
                        //        $scope.drawBrush($scope.chart.yScale.invert($scope.data[$scope.data.length - $scope.data.length].CHECKID), $scope.chart.yScale.invert(($scope.data[$scope.data.length - 1].CHECKID)));
                        //    } else {
                        //        $scope.drawBrush($scope.chart.yScale.invert($scope.data[$scope.data.length - $scope.data.length].CHECKID), $scope.chart.yScale.invert(($scope.data[$scope.data.length - 1].CHECKID)));
                        //    }
                        //}
                        $scope.tabulateBrushedData($scope.data);
                    }

                    $scope.chart.addLegend();
                };

                $scope.getMaxXDomainValue = function (minXDomainValue, data1, data2, isYOYFYGraph) {
                    if (!data2 || !data2.length || !isYOYFYGraph) {
                        return minXDomainValue + data1.length;
                    }
                    var timeScales = $scope.getTimeScales(data1) //create a new array with just the time scales
                        .concat($scope.getTimeScales(data2)) //merge the two arrays
                        .sort(function (first, second) {
                            return first - second;
                        })
                        .filter(function (item, pos, array) {//retain only unique results
                            return !pos || item != array[pos - 1];
                        });
                    return minXDomainValue + timeScales.length;
                };

                $scope.getTimeScales = function (dataArray) {
                    return dataArray.map(function (item) { return parseInt(item.TIME_SCALE); });
                };

                function addCommasToNumber(number) {
                    return HeadcountFormattingNumbersService.addCommasToNumber(number);
                };

                function showPartialPeriodMessage(show) {
                    if (show === true) {
                        angular.element("#chart").css('margin-bottom', '10px');
                    } else {
                        angular.element("#chart").css('margin-bottom', '0px');
                    }
                    $scope.isPartialPeriodMessageShow.graph = show;
                    $scope.isPartialPeriodMessageShow.grid = show;


                };

                function checkPartialTimeScale(period) {
                    if (typeof period.isPartialTimeScale !== 'undefined' && period.isPartialTimeScale) {
                        return period.TIME_SCALE + '*';
                    }

                    return period.TIME_SCALE;
                };
            },
            link: function (scope, element, attrs) {

                attrs.$observe("selectedFilter", function (filterName) {
                    if (filterName != "") {

                        var chartType;
                        scope.filsterList = HeadcountManagementFilterData.filterList;
                        for (var i = 0; i < scope.filsterList.length; i++) {
                            if (scope.filsterList[i].FILTER_NAME == scope.selectedFilter) {
                                scope.selectedType = scope.filsterList[i].SELECTION_TYPE;
                                chartType = scope.filsterList[i].CHART_TYPE;
                                attrs.$set('selectedType', scope.selectedType);
                                $compile(element)(scope);
                                break;
                            }
                        }
                        element.find("svg").remove();
                        scope.selectedItemChanged = true;
                        scope.renderChart({ filterName: scope.selectedFilter, selectedType: scope.selectedType });

                        if (scope.$parent.setChartType) {
                            scope.$parent.setChartType(chartType);
                        };

                        element.on('load', function () {
                            scope.callback();
                        })
                    }
                });
                attrs.$observe("chartType", function () {
                    if (scope.renderChart && scope.selectedFilter != "" &&
                        !scope.selectedItemChanged && !scope.$parent.multiSave) {

                        scope.filsterList = HeadcountManagementFilterData.filterList;
                        for (var i = 0; i < scope.filsterList.length; i++) {
                            if (scope.filsterList[i].FILTER_NAME == scope.selectedFilter) {
                                scope.selectedType = scope.filsterList[i].SELECTION_TYPE;
                                attrs.$set('selectedType', scope.selectedType);
                                $compile(element)(scope);
                                break;
                            }
                        }
                        element.find("svg").remove();
                        scope.renderChart({ filterName: scope.selectedFilter, selectedType: scope.selectedType});
                    }
                });

            },
            replace: true
        }
    }]);