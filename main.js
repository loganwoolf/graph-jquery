$.fn.plugin = function() {
  return {
    barChart: function(data, options = {}, element = 'new-chart') {

      function computeMaxValue(values) {
        let maxValue = 0;
        for (let datum of values) {
          if (typeof datum.value === 'number' && datum.value > maxValue) {
            maxValue = datum.value;
          } else if (typeof datum.value === 'object') {
            let subMax = datum.value.reduce((acc, stackObj) => stackObj.value + acc, 0);
            if (subMax > maxValue) {
              maxValue = subMax;
            }
          }
        }
        return maxValue;
      }

      function setDefaultOptions() {
        !options.height ? options.height = 350 : undefined;
        !options.barColor ? options.barColor = 'darkorange' : undefined;
        !options.barWidth ? options.barWidth = 85 : undefined;
        !options.labelColor ? options.labelColor = 'white' : undefined;
        !options.labelSize ? options.labelSize = 10 : undefined;
        !options.labelPosition ? options.labelPosition = 'top' : undefined;
        !options.chartTitle ? options.chartTitle = 'Bar Graph of Data' : undefined;
        !options.titleSize ? options.titleSize = 32 : undefined;
        !options.titleColor ? options.titleColor = ['white', 'darkorange'] : undefined;
        !options.axisColor ? options.axisColor = 'white' : undefined;
        !options.xAxisRotation ? options.xAxisRotation = 315 : undefined;
        !options.yAxisStep ? options.yAxisStep = Math.round(computeMaxValue($structuredData) / 5) : undefined;
        !options.backgroundColor ? options.backgroundColor = 'grey' : undefined;
      }

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
        $titleBlock.css('background-color', options.titleColor[1]);
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

      function createBarLabel(dataObj, key) {
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
        .text(dataObj[key])
        .css('margin', '0')
        .css('font-weight', '700')
        .css('user-select', 'none')
        ;

        // pad labels depending on flex-align
        $barLabelValue
          .css('margin-top', '3px')
          .css('margin-bottom', '3px');

        // idea: make size dependent on digit count

        // set label options
        $barLabelValue
        .css('color', options.labelColor)
        .css('font-size', options.labelSize + 'px')
        ;

        $barLabelDiv.append($barLabelValue);
      }

      function createSingleBar(dataObj) {
        // create bar
        $bar = $('<div>')
        .addClass('bar')
        .attr('data-name', dataObj.name)
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
        createBarLabel(dataObj, 'value');
        $bar.append($barLabelDiv);

        $barsDiv.append($bar);
      }

      function createStackedBar(dataObj) {
        // compute total of stacked bars for label
        const sumTotal = dataObj.value.reduce((acc, element) => acc + element.value, 0);

        $stackContainer = $('<div>')
        .addClass('stack-bar')
        .attr('data-name', dataObj.name)
        .attr('data-value', sumTotal)
        .css('display', 'flex')
        .css('flex-direction', 'column')
        .css('min-width', options.barWidth / $structuredData.length + '%')
        ;


        //create an element for each item in stack
        $.each(dataObj.value, function(index, stackObj) {
          $stackElement = $('<div>')
            .addClass('stack-element')
            .attr('data-name', stackObj.name)
            .attr('data-value', stackObj.value)
            .css('display', 'flex')
            .css('flex-direction', 'column')
            .css('height', (stackObj.value * $barScale) + 'px')
            .css('width', '100%')
            .css('background-color', options.barColor)
            .css('overflow', 'hidden')
          ;

          switch(options.labelPosition) {
          case 'top':
            $stackElement.css('justify-content', 'flex-start');
            break;
          case 'center':
            $stackElement.css('justify-content', 'center');
            break;
          case 'bottom':
            $stackElement.css('justify-content', 'flex-end');
            break;
          }

          //create labels for sub-name and sub-value
          createBarLabel(stackObj, 'name');
          $stackElement.append($barLabelDiv);
          createBarLabel(stackObj, 'value');
          $stackElement.append($barLabelDiv);

          $stackContainer.prepend($stackElement);
        });

        // pass sumTotal value into bar label function to create label for total
        createBarLabel({value: sumTotal}, 'value');

        //apply sumTotal label based on position option
        options.labelPosition === 'top'
          ? $stackContainer.children().first().prepend($barLabelDiv)
          : $stackContainer.children().last().append($barLabelDiv);

        $barsDiv.append($stackContainer);
      }

      function createBars() {

        $barScale = (options.height) / computeMaxValue($structuredData);

        $barsDiv.css('display', 'flex');
        $barsDiv.css('align-items', 'flex-end');
        $barsDiv.css('justify-content', 'space-between');
        options.height ? $barsDiv.css('height', options.height + 'px') : $barsDiv.css('height', $defaultHeight);
      // compute scale for chart by dividing chart height by maximum data value

      // create a bar for each element in the array
        $.each($structuredData, function(index, dataObj) {
          if (typeof dataObj.value === 'number') {
            createSingleBar(dataObj);
          } else if (typeof dataObj.value === 'object') {
            createStackedBar(dataObj);
          }
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
          .css('color', options.axisColor)
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
          .css('border-right', `1px solid ${options.axisColor}`)
          .css('margin-right', '3px')
        ;

        $barScale = (options.height) / computeMaxValue($structuredData);
        $divisions = Math.trunc((options.height) / (options.yAxisStep * $barScale));

        function createYAxisDivisions(count) {
          for (let i = 0; i < count; i++) {
            $yAxisTic = $('<div>');
            $yAxisTic
              .css('box-sizing', 'border-box')
              .css('border-top', `1px solid ${options.axisColor}`)
              .css('height', `${options.yAxisStep * $barScale}px`)
            ;
            if (i === 0) {
              $yAxisTic.css('border-bottom', `1px solid ${options.axisColor}`);
            }

            $yAxisScale = $('<p>');
            $yAxisScale
              .css('margin', '0 0 0 0')
              .css('text-align', 'center')
              .css('color', options.axisColor)
              .css('font-size', `${options.xAxisSize}px`)
            ;
            $yAxisScale.text(options.yAxisStep * (i + 1));
            $yAxisTic.append($yAxisScale);
            $yAxisDiv.prepend($yAxisTic);

          }
        }
        createYAxisDivisions($divisions);
      }

      function styleChartContainer() {
        $chartContainer
          .css('max-width', '720px')
          .css('margin', '0 auto')
          ;
      }

      // convert data array to objects if not already
      $structuredData = [];
      structureInputData(data);

      // set defaults on missing options
      setDefaultOptions();

      // create major display elements
      $chartContainer = $('<div>').addClass('api-output ' + element);

      $titleBlock = $('<div>').addClass('title');
      $componentBlock = $('<div>').addClass('components');

      $yAxisDiv = $('<div>').addClass('y-axis');
      $barsDiv = $('<div>').addClass('bars');
      $cornerDiv = $('<div>');
      $xAxisDiv = $('<div>').addClass('x-axis');

      // run component functions
      styleChartContainer();
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
      .css('background-color', options.backgroundColor);
    }
  };
};

// initialize plugin
const draw = $().plugin();




