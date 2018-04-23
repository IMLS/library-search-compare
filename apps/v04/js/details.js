// var algoliasearch = require('algoliasearch');
// var algoliasearch = require('algoliasearch/reactnative');
// var algoliasearch = require('algoliasearch/lite');
// or just use algoliasearch if you are using a <script> tag
// if you are using AMD module loader, algoliasearch will not be defined in window,
// but in the AMD modules of the page

var client = algoliasearch('CDUMM9WVUG', '3cc392a5d139bd9131e42a5abb75d4ee');
var index = client.initIndex('imls_v02');
//var fields = ["print_materials", "ebooks", "audio_materials", "video_materials", "total_databases", "print_serials"]
var clusters = [
  { name: "service", fields: [
    {field: "fscs_id", name: "FSCS_ID"},
    {field: "hours", name: "Hours"},
    {field: "visits", name: "Visits"},
    {field: "references", name: "References"},
    {field: "users", name: "Users"},
    {field: "total_circulation", name: "Circulation"},
    {field: "loans_to", name: "Loans"},
    {field: "total_programs", name: "Programs"},
    {field: "computers", name: "Computers"}
  ]},
  { name: "staff", fields: [
    {field: "fscs_id", name: "FSCS_ID"},
    {field: "mls_librarian_staff", name: "MLS Librarians"},
    {field: "librarian_staff", name: "Librarian Staff"},
    {field: "other_staff", name: "Other Staff"}
  ]},
  { name: "finance", fields: [
    {field: "fscs_id", name: "FSCS_ID"},
    {field: "total_revenue", name: "Revenue"},
    {field: "total_staff_expenditures", name: "Staff Expenditures"},
    {field: "total_collection_expenditures", name: "Collection Expenditures"},
    {field: "capital_expenditures", name: "Capital Expenditures"}
  ]},
  { name: "collection", fields: [
    {field: "fscs_id", name: "FSCS_ID"},
    {field: "print_materials", name: "Printed Materials"},
    {field: "ebooks", name: "eBooks"},
    {field: "audio_materials", name: "Audio Materials"},
    {field: "video_materials", name: "Video Materials"},
    {field: "total_databases", name: "Databases"},
    {field: "print_serials", name: "Print Serials"}
  ]}
]

var base_values = {};

// Add toLocaleFixed to Number prototype
Number.prototype.toLocaleFixed = function(n) {
    return this.toLocaleString(undefined, {
      minimumFractionDigits: n,
      maximumFractionDigits: n
    });
};

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

    // Event handler for similar libraries buttons
    var similar_links = document.querySelector('#similar-links');
    similar_links.onclick = function(el) {
      getSimilarLibraries(el, fscs_id);
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
    } else {
      var cn = "collection";
      var clusterName = cluster_type.split("_")[1];
      var field_names = _.map(_.find(clusters, {"name": clusterName}).fields, "field");
      var display_names = _.map(_.find(clusters, {"name": clusterName}).fields, "name");
      var baseLibrary = _.find(content.hits, {"fscs_id": fscs_id} );

      createCalculationsTable(baseLibrary, content, field_names, display_names);
      calculateMean(content, field_names);
      calculatePercentileRank( content, field_names );
      displaySimilarLibraries( baseLibrary, content, cluster_type, field_names, display_names );
      var similarRows = document.querySelectorAll('.similar-row');
      similarRows.forEach(function( el ) {
        el.style.display = 'block';
      });
    }
  });
}

// create table for mean and quartile rank calculations
function createCalculationsTable(baseLibrary, content, field_names, display_names) {
  base_values = {};
  document.getElementById("comparison-headers").innerHTML = "";
  var blankTh = document.createElement("th");
  document.getElementById("comparison-headers").appendChild(blankTh);
  // display field titles on data grid
  display_names.forEach(function(f) {
    if ( f !== "FSCS_ID" ) {
      var th = document.createElement("th");
      var th_text = document.createTextNode(f);
      th.appendChild(th_text);
      document.getElementById("comparison-headers").appendChild(th);
    }
  });

  // display library data on data grid
  var elements = document.getElementById("comparison-data").getElementsByTagName("td");
  removeElements( elements );
  field_names.forEach(function(f) {
    if ( f !== "fscs_id" ) {
      var td = document.createElement("td");
      var td_text = document.createTextNode(baseLibrary[f].toLocaleString("en-US"));
      td.appendChild(td_text);
      document.getElementById("comparison-data").appendChild(td);
      // add to base_values object
      base_values[f] = res[f];
    }
  });

  // create empty mean and percentile rank td cells
  var elements = document.getElementById("comparison-mean").getElementsByTagName("td");
  removeElements( elements );
  var elements = document.getElementById("comparison-percentile").getElementsByTagName("td");
  removeElements( elements );
  field_names.forEach(function(f) {
    if ( f !== "fscs_id" ) {
      var mean_td = document.createElement("td");
      mean_td.setAttribute("id","mean-" + f);
      document.getElementById('comparison-mean').appendChild(mean_td);
      var percentile_td = document.createElement("td");
      percentile_td.setAttribute("id","percentile-" + f);
      document.getElementById('comparison-percentile').appendChild(percentile_td);
    }
  });
}

function removeElements( elements ){
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}

// calculate mean
function calculateMean( content, field_names ) {
  field_names.forEach(function(f) { 
    if ( f !== "fscs_id" ) {
      var values = [];
      total = 0;
      for ( var h in content.hits ) {
        res = content.hits[h];
        values.push( res[f] );
        total = total + res[f];
      }
      var mean = (total/values.length).toLocaleFixed(1);
      // display mean
      displayMean( f, mean );
    }
  });
}

function displayMean( f, mean ) {
  var el = "mean-" + f;
  document.getElementById(el).innerHTML = mean;
}

// calculate percentile rank
function calculatePercentileRank( content, field_names ) {
  field_names.forEach(function(f) {
    if ( f !== "fscs_id" ) {
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
    }
  });
}

function displayPercentileRank( f, percentile_rank ) {
  switch ( true ) {
    case (percentile_rank < 25):
      quartileRank = "Bottom";
      break;
    case (percentile_rank < 50):
      quartileRank = "Lower Mid";
      break;
    case (percentile_rank < 75):
      quartileRank = "Upper Mid";
      break;
    case (percentile_rank < 100):
      quartileRank = "Top";
      break;
    default:
      quartileRank = "unknown";
      break;
  }
  document.getElementById("percentile-" + f).innerHTML = quartileRank;
}

function displaySimilarLibraries( baseLibrary, content, cluster_type, field_names, display_names ) {
  var similarName = _.capitalize(cluster_type.split("_")[1]);
  var similarNumber = content.hits.length;
  var tableHeadings = ["Name"];
  var tableRows = []
  var tableData = {};

  document.getElementById( "similar-name" ).innerHTML = similarName;
  document.getElementById( "similar-number" ).innerHTML = similarNumber;

  for (var h in content.hits) {
    res = content.hits[h];
    var tableRow = [ '<a href="details.html?fscs_id=' + res["fscs_id"] + '">' + res["library_name"] + '</a>' ];
    field_names.forEach(function(f) {
      tableRow.push(res[f].toLocaleString("en-US"));
    });
    tableRows.push(tableRow);
  }
  display_names.forEach(function(f) {
    tableHeadings.push(f);
  });

  tableData["headings"] = tableHeadings;
  tableData["data"] = tableRows;

  if (typeof similarTable !== 'undefined') {
    similarTable.destroy();
  }

  similarTable = new DataTable("#similar-table", {
    perPage: 50,
    data: tableData,
    searchable: false,
    perPageSelect: false,
    columns: [
      {
        select: 0,
        sortable: false
      },
      {
        select: 1,
        render: function( data, cell, row) {
          if ( data === baseLibrary["fscs_id"]) {
            console.log(row);
            row.className = "base-library";
          }
          return data;
        }
      }
    ]
  });

  similarTable.on('datatable.sort', function(column, direction) {
  });

  similarTable.on('similarTable.init', function() {
  });
}

