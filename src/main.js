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

    $div = $("<div>").addClass(element);
    $div.css('display', 'flex');
    $div.css('align-items', 'flex-end');
    $div.css('justify-content', 'space-between');
    options.height ? $div.css('height', options.height + 'px') : $div.css('height', $defaultHeight);

    $barScale = (options.height || $defaultHeight) / data.reduce( (acc, element) => {
      return Math.max(acc, element);
    }, 0);

    $.each(data, function(index, barValue){
      $bar = $("<div>").addClass('bar').attr("data-value", barValue);
      $bar.css('height', (barValue * $barScale) + 'px');
      $bar.css('background-color', options.barColor);
      console.log(barValue.length);
      $bar.css('min-width', (options.barWidth / data.length) + '%');

      $bar.css('height', ($bar.attr("data-value") * $barScale) + 'px');
      $div.append($bar);
    });


    $("body").append($div);
  }

  drawBarChart(
    [7, 4, 15, 12, 19, 24, 7, 45, 7, 8, 16, 7],
    {
      height: 200,
      barColor: 'darkorange',
      barWidth: 95
    },
    'first-chart');

});


