//document ready event
$(function(){

  function drawBarChart(data, options, element) {
    /*

    data is an array of values to be plotted sequentially
    if nested arrays are detected, a stacked bar will be plotted

    options object includes ...
     width: total width in px of returned chart
     height: same as above

     bars:
     barColor: color of bars
     barLabelColor: color of labels
     barLabelPosition: inside the bar at the top, centre, or bottom
     barWidth: width of bars as % of space available for each

    element is the class given to the div element to be created and appended to <body> that will contain the chart

    */
    $defaultHeight = 600;

    $chart = $("<div>").addClass('chart').addClass(element);
    $chart.css('display', 'flex');
    $chart.css('align-items', 'flex-end');
    $chart.css('justify-content', 'space-between');
    options.height ? $chart.css('height', options.height + 'px') : $chart.css('height', $defaultHeight);
    // compute scale for chart
    $barScale = (options.height || $defaultHeight) / data.reduce( (acc, element) => {
      return Math.max(acc, element);
    }, 0);

    $.each(data, function(index, barValue){
      // create bar
      $bar = $("<div>").addClass('bar').attr("data-value", barValue);
      $bar.css('height', (barValue * $barScale) + 'px');
      // create label in bar

      // set options
      $bar.css('background-color', options.barColor);
      $bar.css('min-width', (options.barWidth / data.length) + '%');

      $chart.append($bar);
    });


    $("body").append($chart);
  }

  drawBarChart(
    [7, 4, 15, 12, 19, 24, 7, 45, 7, 8, 16, 7],
    {
      height: 200,
      barColor: 'darkorange',
      barWidth: 85
    },
    'first-chart');

});


