google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var last_key = Object.keys(radioactive_decays)[Object.keys(radioactive_decays).length - 1];
  result = Object.keys(radioactive_substances).map(function(key) {
    return [key, radioactive_substances[key]];
  });

  var all_nuklides = Array();

  var data = new google.visualization.DataTable();
  data.addColumn('number', 'Time');
  $.each(radioactive_decay, function(key, value){
    data.addColumn('number', key);
    all_nuklides.push(key);
  });
  $.each(radioactive_decays, function(time, decays_object){
    
    var new_row = Array();
    new_row.push(parseInt(time/60/60/24/365));
    
    $.each(all_nuklides, function(key, nuklid){
      if(decays_object[nuklid] == undefined){
        new_row.push(0);
      }else{
        new_row.push(decays_object[nuklid]);
      }
    });
    data.addRow(new_row);
  });

  var options = {
    title: 'Decays',
    hAxis: {title: 'Time in years'},
    vAxis: {title: 'Decays', scaleType: 'log', minValue: 0},
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}