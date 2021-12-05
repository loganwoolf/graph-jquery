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

    $chart = $("<div>").addClass('chart');
    $chart.css('display', 'flex');
    $chart.css('align-items', 'flex-end');
    $chart.css('justify-content', 'space-between');
    options.height ? $chart.css('height', options.height + 'px') : $chart.css('height', $defaultHeight);
    // compute scale for chart
    $barScale = (options.height || $defaultHeight) / data.reduce( (acc, element) => {
      return Math.max(acc, element);
    }, 0);

    // create a bar for each element in the array
    $.each(data, function(index, barValue){
      // create bar
      $bar = $("<div>")
        .addClass('bar')
        .attr("data-value", barValue)
        .css('height', (barValue * $barScale) + 'px')
        .css('display', 'flex')
        .css('justify-content', 'center')
        ;
      // set bar options (except label position)
      $bar
        .css('background-color', options.barColor)
        .css('min-width', (options.barWidth / data.length) + '%')
        ;
      //set label container position within bar
      switch(options.labelPosition) {
      case 'top':
        $bar.css('align-items', 'flex-start');
        break;
      case 'center':
        $bar.css('align-items', 'center');
        break;
      case 'bottom':
        $bar.css('align-items', 'flex-end');
        break;
      }
      // create label container in bar
      $labelContainer = $("<div>")
        .addClass('label')
        .css('display', 'flex')
        .css('justify-content', 'center')
        // .css('align-items', 'center')
        ;
      // set label container options (position)
      // create label in label container
      $label = $("<p>")
        .addClass('value-label')
        .text(barValue)
        .css('margin', '0')
        .css('font-weight', '700')
        .css('user-select', 'none')
        ;
        // pad labels depending on flex-align
      switch(options.labelPosition) {
      case 'top':
        $label.css('margin-top', '3px');
        break;
      case 'bottom':
        $label.css('margin-bottom', '3px');
        break;
      }

        // idea: make size dependent on digit count

        // set label options
      $label
        .css('color', options.labelColor)
        .css('font-size', options.labelSize + 'px')
      ;

      $labelContainer.append($label);
      $bar.append($labelContainer);

      $chart.append($bar);
    });

    // create title for chart
    $titleBlock = $('<div>')
      .css('background-color', options.titleColor[1] || 'hsla(0, 0%, 0%, 0)')
      ;
      $title = $('<h1>')
      .css('color', options.titleColor[0])
      .css('font-size', options.titleSize + 'px')
      .text(options.chartTitle)
      ;


    $titleBlock.append($title);
    // create

    // add items to chartContainer
    $chartContainer = $("<div>").addClass(element);
    $chartContainer.append($titleBlock);
    $chartContainer.append($chart);

    // options for body element
    $("body")
      .append($chartContainer)
      .css('font-family', 'monospace')
      .css('background-color', 'grey');

  }

  drawBarChart(
    [7, 18, 3, 12, 19, 24, 7, 45, 7, 8, 16, 7],
    {
      height: 200,
      barColor: 'darkorange',
      barWidth: 85,
      labelColor: 'white',
      labelSize: 8,
      labelPosition: 'top',
      chartTitle: 'Data from Sources',
      titleSize: 16,
      titleColor: ['darkorange']
    },
    'first-chart');

});


