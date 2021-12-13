//document ready event
$.fn.plugin = function() {
  return {
    BarChart: function(data, options, element) {

    // set defaults
      $defaultHeight = 600;

    // convert data array to objects if not already
      function structureInputData(data) {
        if (typeof data[0] === 'number') {
          $.each(data, function(index, barValue){
            $structuredData.push({value: barValue});
          });
        } else {
          $structuredData = data;
        }
      }

      function createTitle() {
        $titleBlock.css('background-color', options.titleColor[1] || 'hsla(0, 0%, 0%, 0)');
        $title = $('<h1>')
      .css('text-align', 'center')
      .css('color', options.titleColor[0])
      .css('font-size', options.titleSize + 'px')
      .text(options.chartTitle)
      ;


        $titleBlock.append($title);
      // create
      }

      function createComponentBlock() {
        $componentBlock
        .css('display', 'grid')
        .css('grid-template-columns', '10% 90%')
      ;
      }

      function createBars(){
        $barScale = (options.height || $defaultHeight) / $structuredData.reduce((acc, barObj) => Math.max(acc, barObj.value), 0);

        $barsDiv.css('display', 'flex');
        $barsDiv.css('align-items', 'flex-end');
        $barsDiv.css('justify-content', 'space-between');
        options.height ? $barsDiv.css('height', options.height + 'px') : $barsDiv.css('height', $defaultHeight);
      // compute scale for chart by dividing chart height by maximum data value

      // create a bar for each element in the array
        $.each($structuredData, function(index, dataObj) {
        // create bar
          $bar = $('<div>')
          .addClass('bar')
          .attr('data-value', dataObj.value)
          .css('height', (dataObj.value * $barScale) + 'px')
          .css('display', 'flex')
          .css('justify-content', 'center')
          ;
        // set bar options (except label position)
          $bar
          .css('background-color', options.barColor)
          .css('min-width', (options.barWidth / $structuredData.length) + '%')
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
          $barLabelDiv = $('<div>').addClass('bar-label');
          $barLabelDiv.css('display', 'flex')
          .css('justify-content', 'center')
          // .css('align-items', 'center')
          ;
        // set label container options (position)
        // create label in label container
          $barLabelValue = $('<p>')
          .addClass('bar-label-value')
          .text(dataObj.value)
          .css('margin', '0')
          .css('font-weight', '700')
          .css('user-select', 'none')
          ;
          // pad labels depending on flex-align
          switch(options.labelPosition) {
          case 'top':
            $barLabelValue.css('margin-top', '3px');
            break;
          case 'bottom':
            $barLabelValue.css('margin-bottom', '3px');
            break;
          }

          // idea: make size dependent on digit count

          // set label options
          $barLabelValue
          .css('color', options.labelColor)
          .css('font-size', options.labelSize + 'px')
        ;

          $barLabelDiv.append($barLabelValue);
          $bar.append($barLabelDiv);

          $barsDiv.append($bar);
        });
      }

      function createXAxis() {
      // style x axis container
        $xAxisDiv
      .css('display', 'flex')
      .css('justify-content', 'space-between')
      ;

      // create a name label for each bar on the x-axis
        $.each($structuredData, function (index, dataObj) {
          $xLabelValue = $('<p>')
          .css('width', (options.barWidth / $structuredData.length) + '%')
          .css('text-align', 'center')
          .css('color', (options.xAxisColor || 'black'))
          .css('font-size', options.xAxisSize + 'px')
          .css('transform', 'rotate(' + options.xAxisRotation + 'deg)')
          .text(dataObj.name)
        ;

        //add bar labels to
          $xAxisDiv.append($xLabelValue);
        });
      }

      function createYAxis() {
        $yAxisDiv
        .css('display', 'flex')
        .css('flex-direction', 'column')
        .css('justify-content', 'flex-end')
        .css('border-right', '1px solid white')
        .css('margin-right', '3px')
      ;

        $barScale = (options.height || $defaultHeight) / $structuredData.reduce((acc, barObj) => Math.max(acc, barObj.value), 0);
        $divisions = Math.trunc((options.height || $defaultHeight) / (options.yAxisStep * $barScale));

        function createYAxisDivisions(count) {
          for (let i = 0; i < count; i++) {
            $yAxisTic = $('<div>');
            $yAxisTic
            .css('box-sizing', 'border-box')
            .css('border-top', '1px solid white')
            .css('height', `${options.yAxisStep * $barScale}px`)
          ;
            if (i === 0) {
              $yAxisTic.css('border-bottom', '1px solid white');
            }

            $yAxisScale = $('<p>');
            $yAxisScale
            .css('margin', '0 0 0 0')
            .css('text-align', 'center')
            .css('color', options.xAxisColor)
            .css('font-size', `${options.xAxisSize}px`);
            $yAxisScale.text(options.yAxisStep * (i + 1));
            $yAxisTic.append($yAxisScale);
            $yAxisDiv.prepend($yAxisTic);

          }
        }
        createYAxisDivisions($divisions);
      }

      $structuredData = [];
      structureInputData(data);


    // create major display elements
      $chartContainer = $('<div>').addClass('api-output ' + element);

      $titleBlock = $('<div>').addClass('title');
      $componentBlock = $('<div>').addClass('components');

      $yAxisDiv = $('<div>').addClass('y-axis');
      $barsDiv = $('<div>').addClass('bars');
      $cornerDiv = $('<div>');
      $xAxisDiv = $('<div>').addClass('x-axis');


      createTitle();
      createComponentBlock();
      createYAxis();
      createBars();
      createXAxis();


    // add items to chartContainer

      $chartContainer.append($titleBlock);
      $chartContainer.append($componentBlock);

      $componentBlock.append($yAxisDiv);
      $componentBlock.append($barsDiv);
      $componentBlock.append($cornerDiv);
      $componentBlock.append($xAxisDiv);

    // options for body element
      $('body')
      .append($chartContainer)
      .css('font-family', 'monospace')
      .css('background-color', 'grey');

    }
  };
};

// initialize plugin
const draw = $().plugin();

// example calling of function
draw.BarChart(
    // plain array
    //[7, 18, 3, 12, 19, 24, 7, 45, 7, 8, 16, 7],
    // objects
  [
      {name: 'Jan', value: 100},
      {name: 'Feb', value: 18},
      {name: 'Mar', value: 76},
      {name: 'Apr', value: 112},
      {name: 'May', value: 19},
      {name: 'Jun', value: 24},
      {name: 'Jul', value: 67},
      {name: 'Aug', value: 45},
      {name: 'Sep', value: 126},
      {name: 'Oct', value: 82},
      {name: 'Nov', value: 151},
      {name: 'Dec', value: 79}
  ],
  {
    height: 200,
    barColor: 'darkorange',
    barWidth: 85,
    labelColor: 'white',
    labelSize: 8,
    labelPosition: 'top',
    chartTitle: 'Data from Sources',
    titleSize: 16,
    titleColor: ['darkorange'],
    xAxisColor: 'white',
    xAxisSize: 8,
    xAxisRotation: 315,
    yAxisStep: 50
  },
    'monthly-change');




