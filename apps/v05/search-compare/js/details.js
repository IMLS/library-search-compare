// var algoliasearch = require('algoliasearch');
// var algoliasearch = require('algoliasearch/reactnative');
// var algoliasearch = require('algoliasearch/lite');
// or just use algoliasearch if you are using a <script> tag
// if you are using AMD module loader, algoliasearch will not be defined in window,
// but in the AMD modules of the page

var client = algoliasearch('CDUMM9WVUG', '3cc392a5d139bd9131e42a5abb75d4ee');
var index = client.initIndex('imls_v04');
//var fields = ["print_materials", "ebooks", "audio_materials", "video_materials", "total_databases", "print_serials"]
var clusters = [
  { name: "service", fields: [
    {field: "fscs_id", name: "FSCS_ID"},
    {field: "hours", name: "Hours"},
    {field: "visits", name: "Visits"},
    {field: "references", name: "References"},
    {field: "users", name: "Users"},
    {field: "total_circulation", name: "Circulation"},
    {field: "loans_to", name: "Interlibrary Loans To"},
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

/**
 * Simulate a click event.
 * @public
 * @param {Element} elem  the element to simulate a click on
 */
var simulateClick = function (elem) {
	// Create our event (with options)
  if ( document.createEvent ) {
    var evt = document.createEvent( "MouseEvent" );
    evt.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
    elem.dispatchEvent( evt );
  } else {
    var evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
  }
	// If cancelled, don't dispatch our event
	var canceled = !elem.dispatchEvent(evt);
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

var fscs_id_param = getParameterByName('fscs_id');
var similar_param = getParameterByName('similar');

// Event handler for share this page button
var share_btn = document.querySelector('#share-btn');
share_btn.onclick = function( evt ) {
  sharePage( evt );
}

/*function sharePage( evt ) {
  var page_url = window.location.href;
  var dummy = document.createElement( 'input' );
  document.body.appendChild( dummy );
  dummy.value = page_url;
  dummy.select();
  document.execCommand( "copy" );
  document.body.removeChild( dummy );
}*/
function sharePage( evt ) {
  var page_url = window.location.href;
  var myLink = document.getElementById( 'shareMe' );
  var myDiv = document.getElementById( 'shareDiv' );
  var closed = myDiv.className.indexOf( 'closed' ) !== -1;
  if( closed ) {
    myDiv.className = myDiv.className.replace( 'closed', 'open' );
  }
  myLink.value = page_url;
  myLink.select();
  document.execCommand( "copy" );
  hideIt();
}

function hideIt() {
  setTimeout( function(){
    var myDiv = document.getElementById( 'shareDiv' );
    var open = myDiv.className.indexOf( 'open' ) !== -1;
    if( open ) {
      myDiv.className = myDiv.className.replace( 'open', 'closed' );
    }
  }, 5000 );
  return false;
}

// only query string
var query = 'fscs_id ' + fscs_id_param;
index.search({ 
    query: query,
    exactOnSingleWordQuery: 'attribute', 
    typoTolerance: false
  }, function searchDone(err, content) {
  if (err) {
    console.error(err);
    return;
  } else {

    // display details  
    for ( var h in content.hits ) {
      res = content.hits[h];
      document.getElementById("name").innerHTML = res.library_name;
      document.getElementById("address").innerHTML = res.mailing_address;
      var city = res.mailing_city + ', ' + res.state
      document.getElementById("city").innerHTML = city;
      var serviceAreaPopulation = 'Service Area Population: ' + res.service_area_population.toLocaleFixed(0);
      document.getElementById("service-area-population").innerHTML = serviceAreaPopulation;
      var locale = 'Locale: ' + res.locale_string;
      document.getElementById("locale").innerHTML = locale;

      var centralLibraries = 'Central Libraries: ' + res.central_libraries;
      document.getElementById("central-libraries").innerHTML = centralLibraries;
      var branchLibraries = 'Branch Libraries: ' + res.branch_libraries;
      document.getElementById("branch-libraries").innerHTML = branchLibraries;
      var bookmobiles = 'Bookmobiles: ' + res.bookmobiles;
      document.getElementById("bookmobiles").innerHTML = bookmobiles;
      // var county = 'County: ' + res.county + ' Population: ' + res.county_population;
      // document.getElementById("county").innerHTML = county;
      var fscs_id = res.fscs_id;
      document.getElementById("fscs-id").innerHTML = fscs_id;

      // display library name
      var libraryNames = document.querySelectorAll('.library-name');
      _.forEach (libraryNames, function( el ) {
        el.innerHTML = res.library_name;
      });

      _.forEach ( clusters, function( cluster ) {
        _.forEach( cluster.fields, function ( field ) {
          if ( field.field !== "fscs_id" ) {
            if ( cluster.name !== "staff" ) {
              document.getElementById( field.field ).innerHTML = "<strong>" + field.name + ":</strong> <span>" + (typeof res[ field.field ] == "number" ? res[ field.field ].toLocaleFixed(0) : res[ field.field ]) + "</span>";
            } else {
              document.getElementById( field.field ).innerHTML = "<strong>" + field.name + ":</strong> <span>" + res[ field.field ] + "</span>";
            }
          }
        });
      });

      // Add total staff to Staff Data section
      document.getElementById("total_staff").innerHTML = "<strong>Total Staff:</strong><span>" + res[ 'total_staff' ] + "</span>";

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

      // document.getElementById("json").innerHTML = JSON.stringify(content.hits[0], undefined, 2);

      // Event handler for similar libraries buttons
      var similar_links = document.querySelector('#similar-links');
      similar_links.onclick = function(el) {
        getSimilarLibraries( el );
      }


      if (similar_param !== null ) {
        var el_id = similar_param + '-link';
        var click_el = document.getElementById( el_id );
        simulateClick( click_el );
      }

    }
  }
});

// Get and display cluster data
function getSimilarLibraries(el) {
  var cluster_type = el.target.getAttribute("data-type");
  var cluster_value = el.target.getAttribute("data-cluster");
  index.search({ 
      filters: cluster_type + ' = ' + cluster_value,
      hitsPerPage: 2000
    }, function searchDone(err, content) {
    if (err) {
      console.error(err);
      return;
    } else {
      // var cn = "collection";
      var clusterName = cluster_type.split("_")[1];
      var field_names = _.map(_.find(clusters, {"name": clusterName}).fields, "field");
      var display_names = _.map(_.find(clusters, {"name": clusterName}).fields, "name");

      if (content.nbPages > 1) {
         console.log( content.nbPages );
        // console.log(fscs_id);
      }
      var baseLibrary = _.find(content.hits, {"fscs_id": fscs_id_param} );

      createCalculationsTable(baseLibrary, content, field_names, display_names);
      calculateMean(content, field_names);
      calculatePercentileRank( content, field_names );
      displaySimilarLibraries( baseLibrary, content, cluster_type, field_names, display_names );
      prepareCsvData( content );
      var similarRows = document.querySelectorAll('.similar-row');
      _.forEach( similarRows, function( el ) {
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
  _.forEach( display_names, function(f) {
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
  _.forEach( field_names, function(f) {

    if ( f !== "fscs_id" ) {
      var td = document.createElement("td");
      var td_text = document.createTextNode(baseLibrary[f].toLocaleString("en-US"));
      td.appendChild(td_text);
      document.getElementById("comparison-data").appendChild(td);
      // add to base_values object
      base_values[f] = baseLibrary[f];
    }
  });

  // Add total_staff_expenditures_mean and total_staff_expenditures_percentile
  base_values["total_staff_expenditures_mean"] = baseLibrary["total_staff_expenditures_mean"];
  base_values["total_staff_expenditures_percentile"] = baseLibrary["total_staff_expenditures_percentile"];

  // create empty mean and percentile rank td cells
  var elements = document.getElementById("comparison-mean").getElementsByTagName("td");
  removeElements( elements );
  var elements = document.getElementById("comparison-percentile").getElementsByTagName("td");
  removeElements( elements );
  _.forEach( field_names, function(f) {
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
  _.forEach( field_names, function(f) { 
    if ( f !== "fscs_id" ) {
      var values = [];
      total = 0;
      for ( var h in content.hits ) {
        res = content.hits[h];
        if ( res[f] !== "M" && res[f] !== "S" ) {
          values.push( res[f] );
          total = total + res[f];
        }
      }

      if ( f === "total_staff_expenditures" ) {
        var mean  = base_values["total_staff_expenditures_mean"].toLocaleFixed(1);
      } else {
        var mean = (total/values.length).toLocaleFixed(1);
      }
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
  _.forEach( field_names, function(f) {
    if ( base_values[f] == "M" ) {
      var percentile_rank = "M";
      displayPercentileRank ( f, percentile_rank );
    } else if (base_values[f] == "S" ) {
      var percentile_rank = base_values["total_staff_expenditures_percentile"]
      displayPercentileRank ( f, percentile_rank );
    } else {
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
      quartileRank = "NA";
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
    _.forEach( field_names, function(f) {
      tableRow.push(res[f].toLocaleString("en-US"));
    });
    tableRows.push(tableRow);
  }
  _.forEach( display_names, function(f) {
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

function prepareCsvData( content ) {
  var csvRows = [];
  var excludeFields = [ '_highlightResult', 'address', 'address_change', 'address_match_type', 'administrative_structure', 'bea_region', 'census_block', 'census_track', 'city', 'cluster_collection', 'cluster_finance', 'cluster_service', 'cluster_staff', 'congressional_district', 'county', 'end_date', 'esri_match_status', 'fscs_definition', 'geocode_score', 'geographic_code', 'gnis_id', 'incits_county_code', 'incits_state_code', 'interlibrary_relationship', 'legal_basis', 'library_id', 'library_name', 'locale_string', 'longitude', 'lsabound', 'mailing_address', 'mailing_city', 'mailing_zip', 'metro_micro_area', 'name_change', 'objectID', 'phone', 'reap_locale', 'reporting_status', 'start_date', 'state', 'structure_change', 'total_staff_expenditures_mean', 'total_staff_expenditures_percentile', 'year', 'zip' ];

  for (var h in content.hits) {
    var res = content.hits[h];
    var csvHeadings = [ 'Name' ];
    var library_name = _.replace( res[ 'library_name' ], ',', '' );
    var csvRow = [ library_name ];
    _.forEach( res, function( value, key ) {
      if ( _.includes( excludeFields, key ) === false ) {
        csvHeadings.push( key );
        csvRow.push(res[ key ]);
      }
    });
    csvRows.push(csvRow);
  }

  csvRows.unshift( csvHeadings );

  // csvRows.unshift( tableData.headings );
  csvContent = "";
  csvRows.forEach(function(rowArray){
     var row = rowArray.join(",");
     csvContent += row + "\r\n";
  }); 

  encodedUri = encodeURI(csvContent);
}

function downloadCsv() {
  var filename = "imls_data"; 
  var csvData = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
  if( msieversion()) {
    navigator.msSaveBlob(csvData, 'pls_export.csv');
  } else {
    // window.open(encodedUri);
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(csvData);
    link.setAttribute('download', 'pls_export.csv');
    document.body.appendChild(link);    
    link.click();
    document.body.removeChild(link);
  }
}

function msieversion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return true
  {
    return true;
  } else { // If another browser,
  return false;
  }
  return false;
}

