var sampleData = [{
    "x": 1,
    "y": 2
}, {
    "x": 2,
    "y": 4
}, {
    "x": 3,
    "y": 3
}, {
    "x": 4,
    "y": 2
}, {
    "x": 5,
    "y": 1
}];
drawChart();
function drawChart() {

    var graphWidth = 400, graphHeight = 350;
    var numberOfXUnits = 5, numberOfYUnits = 5;
    var xAxisLabels = ['2011', '2012', '2013', '2014', '2015'];
    var graphBottomMargin = 50, graphLeftMargin = 30, graphTopMargin = 10;
    var graphContainer = Raphael('svgVisualize', graphWidth, graphHeight);

    var xAxis = graphContainer.path('M' + graphLeftMargin + ' ' + (graphHeight - graphBottomMargin) + ' L' + (graphWidth - graphLeftMargin) + ' ' + (graphHeight - graphBottomMargin));
    xAxis.attr('stroke', '#ccc');

    var bottomBorder = graphContainer.path('M' + graphLeftMargin + ' ' + (graphHeight - graphTopMargin) + ' L' + (graphWidth - graphLeftMargin) + ' ' + (graphHeight - graphTopMargin));
    bottomBorder.attr('stroke', '#ccc');

    var leftBorder = graphContainer.path('M' + graphLeftMargin + ' ' + (graphHeight - graphTopMargin) + ' L' + graphLeftMargin + ' ' + graphTopMargin);
    leftBorder.attr('stroke', '#ccc');

    var rightBorder = graphContainer.path('M' + (graphWidth - graphLeftMargin) + ' ' + (graphHeight - graphTopMargin) + ' L' + (graphWidth - graphLeftMargin) + ' ' + graphTopMargin);
    rightBorder.attr('stroke', '#ccc');

    var yAxisLength = graphHeight - (graphBottomMargin + graphTopMargin);
    var yUnitWidth = yAxisLength / numberOfYUnits;

    var xAxisLength = graphWidth - (2 * graphLeftMargin);
    var xUnitWidth = xAxisLength / numberOfXUnits;

    for (var i = 1; i <= numberOfYUnits; i++) {
        graphContainer.path('M' + graphLeftMargin + ' ' + (graphHeight - graphBottomMargin - (i * yUnitWidth)) + ' L' + (graphWidth - graphLeftMargin) + ' ' + (graphHeight - graphBottomMargin - (i * yUnitWidth))).attr({ 'stroke': '#ccc', 'stroke-dasharray': '- ' });
    }

    for (i = 0; i < numberOfXUnits; i++) {
        graphContainer.text(graphLeftMargin + (i * xUnitWidth) + (xUnitWidth / 2), graphHeight - graphBottomMargin + 20, xAxisLabels[i]).attr({
            'font-size': 12,
        });

        var xPosition = graphLeftMargin + (sampleData[i].x * xUnitWidth) - (xUnitWidth / 2);
        var yPosition = (sampleData[i].y * yUnitWidth) + graphTopMargin;

        graphContainer.circle(xPosition, yPosition, 0.25 * xUnitWidth).attr({ 'stroke': '#8AC007', 'stroke-width': 2 });
        graphContainer.text(xPosition, yPosition, sampleData[i].y.toString()).attr({ 'stroke': '#8AC007', 'font-size': 16 });
    }

}