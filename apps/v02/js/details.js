// var algoliasearch = require('algoliasearch');
// var algoliasearch = require('algoliasearch/reactnative');
// var algoliasearch = require('algoliasearch/lite');
// or just use algoliasearch if you are using a <script> tag
// if you are using AMD module loader, algoliasearch will not be defined in window,
// but in the AMD modules of the page

var client = algoliasearch('CDUMM9WVUG', '3cc392a5d139bd9131e42a5abb75d4ee');
var index = client.initIndex('imls_v02');
//var fields = ["print_materials", "ebooks", "audio_materials", "video_materials", "total_databases", "print_serials"]
var fields = [
  {field: "print_materials", name: "Printed Materials"},
  {field: "ebooks", name: "eBooks"},
  {field: "audio_materials", name: "Audio Materials"},
  {field: "video_materials", name: "Video Materials"},
  {field: "total_databases", name: "Databases"},
  {field: "print_serials", name: "Print Serials"}
]
var field_names = _.map(fields, 'field');
var display_names = _.map(fields, 'name');

var base_values = {};

// parse url params
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var fscs_id = getParameterByName('fscs_id');

// only query string
var query = 'fscs_id ' + fscs_id;
index.search({ 
    query: query,
    exactOnSingleWordQuery: 'attribute', 
    typoTolerance: false
  }, function searchDone(err, content) {
  if (err) {
    console.error(err);
    return;
  }

  // display details  
  for (var h in content.hits) {
    res = content.hits[h];
    document.getElementById("name").innerHTML = res.library_name;
    document.getElementById("address").innerHTML = res.mailing_address;
    var city = res.mailing_city + ', ' + res.state
    document.getElementById("city").innerHTML = city;
    var county = 'County: ' + res.county + ' Population: ' + res.county_population;
    document.getElementById("county").innerHTML = county;
    var fscs_id = 'fscs_id: ' + res.fscs_id;
    document.getElementById("fscs-id").innerHTML = fscs_id;

    // display library name
    var libraryNames = document.querySelectorAll('.library-name');
    libraryNames.forEach(function( el ) {
      el.innerHTML = res.library_name;
    });

    // display field titles on data grid
    display_names.forEach(function(f) {
      var th = document.createElement("th");
      var th_text = document.createTextNode(f);
      th.appendChild(th_text);
      document.getElementById("comparison-headers").appendChild(th);
    });

    // display library data on data grid
    field_names.forEach(function(f) {
      var td = document.createElement("td");
      var td_text = document.createTextNode(res[f]);
      td.appendChild(td_text);
      document.getElementById("comparison-data").appendChild(td);
      // add to base_values object
      base_values[f] = res[f];
    });

    // create empty mean td cells
    field_names.forEach(function(f) {
      var mean_td = document.createElement("td");
      mean_td.setAttribute("id","mean-" + f);
      document.getElementById('comparison-mean').appendChild(mean_td);
      var percentile_td = document.createElement("td");
      percentile_td.setAttribute("id","percentile-" + f);
      document.getElementById('comparison-percentile').appendChild(percentile_td);
    });
    // var clusters = ' Clusters: <a href="#" id=service" data-type="service", data-value="' + res.cluster_service + '">Service: ' + res.cluster_service + '</a> Staff: ' + res.cluster_staff + ' Finance: ' + res.cluster_finance + ' Collection: ' + res.cluster_collection;
    // document.getElementById("clusters").innerHTML = clusters;

    var service = document.querySelector('#service-link');
    service.setAttribute("data-cluster",res.cluster_service);

    var staff = document.querySelector('#staff-link');
    staff.setAttribute("data-cluster",res.cluster_staff);

    var finance = document.querySelector('#finance-link');
    finance.setAttribute("data-cluster",res.cluster_finance);

    var collection = document.querySelector('#collection-link');
    collection.setAttribute("data-cluster",res.cluster_collection);

    document.getElementById("json").innerHTML = JSON.stringify(content.hits[0], undefined, 2);

    // Event handler for cluster link
    var similar_links = document.querySelector('#similar-links');
    similar_links.onclick = function(el) {
      getSimilarLibraries(el);
    }
  }
});

// Get and display cluster data
function getSimilarLibraries(el) {
  var cluster_type = el.target.getAttribute("data-type");
  var cluster_value = el.target.getAttribute("data-cluster");
  index.search({ 
      filters: cluster_type + ' = ' + cluster_value,
      hitsPerPage: 1000
    }, function searchDone(err, content) {
    if (err) {
      console.error(err);
      return;
    }

    // Show list of similar libraries  
    /*
    document.getElementById("similar-libraries").innerHTML = "";
    for (var h in content.hits) {
      res = content.hits[h]
      var cluster_data = res[cluster_type];
      var cluster_div = document.createElement("div");
      var cluster_item = document.createTextNode(res.fscs_id + ' ' + res.library_name + ': ' + res.hours + ' || ' + res.visits + ' || ' + cluster_data);
      cluster_div.appendChild(cluster_item)
      document.getElementById("similar-libraries").appendChild(cluster_div);
    }
    */

      calculateMean(content);
      calculatePercentileRank( content );
      displaySimilarLibraries( content );
      var similarRows = document.querySelectorAll('.similar-row');
      similarRows.forEach(function( el ) {
        el.style.display = 'block';
      });
  });
}

// calculate mean
function calculateMean( content ) {
  field_names.forEach(function(f) { 
    var values = [];
    total = 0;
    for ( var h in content.hits ) {
      res = content.hits[h];
      values.push( res[f] );
      total = total + res[f];
    }
    var mean = (total/values.length).toFixed(2);
    // display mean
    displayMean( f, mean );
  });
}

function displayMean( f, mean ) {
  var el = "mean-" + f;
  document.getElementById(el).innerHTML = mean;
}

// calculate percentile rank
function calculatePercentileRank( content ) {
  field_names.forEach(function(f) {
    var values = [];
    for ( var h in content.hits ) {
      res = content.hits[h];
      values.push( res[f] );
    }
    values = _.sortBy( values );
    var position = _.sortedIndex( values, base_values[f] );
    var matches = _.filter( values, function(n) { return n == base_values[f] });
    var percentile_rank = Math.round((( position + (0.5 *  matches.length))/values.length) * 100);
    // display percentile rank
    displayPercentileRank( f, percentile_rank );
  });
}

function displayPercentileRank( f, percentile_rank ) {
  document.getElementById("percentile-" + f).innerHTML = percentile_rank;
}

function displaySimilarLibraries( content ) {
  var tableHeadings = ["Name"];
  var tableRows = []
  var tableData = {};

  for (var h in content.hits) {
    res = content.hits[h];
    var tableRow = [res["library_name"] + " (" + res["fscs_id"] + ")"];
    field_names.forEach(function(f) {
      tableRow.push(res[f]);
    });
    tableRows.push(tableRow);
  }
  display_names.forEach(function(f) {
    tableHeadings.push(f);
  });

  tableData["headings"] = tableHeadings;
  tableData["data"] = tableRows;

  var similarTable = new DataTable("#similar-table", {
  perPage: 50,
  data: tableData,
  searchable: false,
  perPageSelect: false
  });

  similarTable.on('similarTable.init', function() {
  console.log('init');
  });
}
