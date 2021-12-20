// example calling of function

draw.barChart(
  // plain array
  // [7, 18, 3, 12, 19, 24, 7, 45, 7, 8, 16, 7],
  // objects


  [
    {name: 'Jan', value: 75},
    {name: 'Feb', value: 18},
    // eslint-disable-next-line indent
    {name: 'Mar', value: [
        {name: 'Week 1', value: 30},
        {name: 'Week 2', value: 30},
        {name: 'Week 3', value: 30},
        {name: 'Week 4', value: 30}
      // eslint-disable-next-line indent
      ]
    // eslint-disable-next-line indent
    },
    {name: 'Apr', value: 112},
    {name: 'May', value: 19},
    {name: 'Jun', value: 24},
    {name: 'Jul', value: 67},
    {name: 'Aug', value: 45},
    {name: 'Sep', value: 126},
    {name: 'Oct', value: 82},
    {name: 'Nov', value: 132},
    {name: 'Dec', value: 79}
  ]
,
  {
    height: 350,
    barColor: 'darkorange',
    barWidth: 75,
    labelColor: 'white',
    labelSize: 8,
    labelPosition: 'bottom',
    chartTitle: 'Data from Sources',
    titleSize: 28,
    titleColor: ['white', 'darkorange'],
    axisColor: 'white',
    xAxisSize: 10,
    xAxisRotation: 315,
    yAxisStep: 25,
    backgroundColor: 'grey'
  }
,
'monthly-change'

);



draw.barChart([4, 5, 6, 7, 8, 9]);
