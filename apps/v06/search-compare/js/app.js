var client = algoliasearch('CDUMM9WVUG', '3cc392a5d139bd9131e42a5abb75d4ee');
var index = client.initIndex('imls_v04');

// comparison data grid labels and field names  
var searchCompare = {};
var comparisonData = {};
comparisonData = [
  { name: 'capital',
    display_name: 'Capital Revenue and Expenditures', 
    headings: [ 'Name', 'Local capital revenue', 'State capital revenue', 'Federal captial revenue', 'Other capital revenue', 'Total capital revenue', 'Total capital expenditures' ],
    field_names: [ 'local_capital_revenue', 'state_capital_revenue', 'federal_capital_revenue', 'other_capital_revenue', 'total_capital_revenue', 'capital_expenditures' ] },
  { name: 'demographic',
    display_name: 'Demographic', 
    headings: [ 'Name', 'Population of Legal Service Area (LSA)', 'Total unduplicated population of LSA', 'Number of central libraries', 'Number of branch libraries', 'Number of bookmobiles', 'Interlibrary relationship code', 'Legal basis code', 'Administrative structure code', 'FSCS public library definition', 'Geographic code' ],
    field_names: [ 'service_area_population', 'unduplicated_population', 'central_libraries', 'branch_libraries', 'bookmobiles', 'interlibrary_relationship', 'legal_basis', 'administrative_structure', 'fscs_definition', 'geographic_code' ] },
  { name: 'inter-library',
    display_name: 'Inter-Library Loans', 
    headings: [ 'Name', 'Provided to', 'Received from' ],
    field_names: [ 'loans_to', 'loans_from' ] },
  { name: 'collection',
    display_name: 'Library Collection', 
    headings: [ 'Name', 'Print materials', 'Electronic books', 'Audio-physical units', 'Audio-downloadable units', 'Video-physical units', 'Video-downloadable units', 'Local databases', 'State databases', 'Total databases', 'Print serial subscriptions' ],
    field_names: [ 'print_materials', 'ebooks', 'audio_materials', 'audio_downloads', 'video_materials', 'video_downloads', 'local_databases', 'state_databases', 'total_databases', 'print_serials' ] },
  { name: 'programs',
    display_name: 'Library Programs', 
    headings: [ 'Name', 'Total library programs', 'Children\'s programs', 'Young adult prograns', 'Total attendance at library programs', 'Children\'s program attendance', 'Young adult program attendance' ],
    field_names: [ 'total_programs', 'kids_programs', 'ya_programs', 'program_audience', 'kids_program_audience', 'ya_program_audience' ] },
  { name: 'revenue',
    display_name: 'Operating Revenue', 
    headings: [ 'Name', 'Local Revenue', 'State Revenue', 'Federal Revenue', 'Other Revenue', 'Total Revenue' ],
    field_names: [ 'local_revenue', 'state_revenue', 'federal_revenue', 'other_revenue', 'total_revenue' ] },
  { name: 'expenditures',
    display_name: 'Operating Expenditures', 
    headings: [ 'Name', 'Salaries & wages', 'Employee benefits', 'Total staff expenditures', 'Print materials expenditures', 'Electronic materials expenditures', 'Other material expenditures', 'Total collection expenditures', 'Other operating expenditures', 'Total operating expenditures' ],
    field_names: [ 'salaries', 'benefits', 'total_staff_expenditures', 'print_expenditures', 'electronic_expenditures', 'other_collection_expenditures', 'total_collection_expenditures', 'other_expenditures', 'total_expenditures' ] },
  { name: 'other_electronic',
    display_name: 'Other Electronic Information', 
    headings: [ 'Name', 'Computers used by general public', 'Computer uses', 'Wireless sessions' ],
    field_names: [ 'computers', 'computer_uses', 'wifi_sessions' ] },
  { name: 'services',
    display_name: 'Services', 
    headings: [ 'Name', 'Public service hours/year', 'Library visits', 'Reference transactions', 'Number of registered users', 'Total circulation of materials', 'Circulation of kid\'s materials', 'Use of electronic material', 'Physical item circulation', 'Electronic information retrievals', 'Electronic content use', 'Total collection use' ],
    field_names: [ 'hours', 'visits', 'references', 'users', 'total_circulation', 'kids_circulation', 'electronic_content_uses', 'physical_item_circulation', 'electronic_info_retrievals', 'electronic_content_uses', 'total_circulation_retrievals' ] },
  { name: 'staff',
    display_name: 'Paid Staff (FTE)', 
    headings: [ 'Name', 'ALA-MLS librarians', 'Total librarians', 'All other paid staff', 'Total paid staff' ],
    field_names: [ 'mls_librarian_staff', 'librarian_staff', 'other_staff', 'total_staff' ] }
];

// Comparison data selector event handler
$( '#comparison-select' ).change( function() { 
  handleDataSelection( this );
});

function handleDataSelection( evt ) {
  var comparisonSelect = evt.value;
  displayDataGrid( searchCompare.globalContent, comparisonSelect )
}

var search = instantsearch({
  // Replace with your own values
  appId: 'CDUMM9WVUG',
  apiKey: '3cc392a5d139bd9131e42a5abb75d4ee', // search only API key, no ADMIN key
  indexName: 'imls_v04',
  numberLocale: 'en-US',
  stalledSearchDelay: 5000,
  routing: true,
  searchParameters: {
    hitsPerPage: 50
  }
});

// search input widget  
search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search-input'
  })
);

// number of hits
search.addWidget(
  instantsearch.widgets.stats({
    container: '#count',
    templates: {
      body: function(data) {
        var result = data.hasOneResult ? "result" : "results";
        return data.nbHits + ' ' + result;
      }
    }
  })
);

// display results
search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: document.getElementById('hit-template').innerHTML,
      empty: "We didn't find any results for the search <em>\"{{query}}\"</em>"
    }
  })
);

// search.on( 'render', getFullData );
(function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
          var res = JSON.parse(this.responseText);
          if ( typeof res.results !== "undefined" ) {
            getFullData( res.results );
          }
        });
        origOpen.apply(this, arguments);
    };
})();

function getFullData( results ) {
  var query = _.split( results[0].params, "&", 1);
  var query = _.split(query, "=")[1];
  var filters = _.split( results[0].params, 'tagFilters=&');
  filters = decodeURIComponent( filters[1] );
  filters = _.split( filters, "&" );
  asFf = "";
  asNf = "";
  _.forEach( filters, function( value ) {
    if( _.startsWith( value, 'facetFilters' ) ) {
      eqIndex = value.indexOf('=') + 1;
      asFf = value.substring( eqIndex );
    } else if( _.startsWith( value, 'numericFilters' ) ) {
      eqIndex = value.indexOf('=') + 1;
      asNf = value.substring( eqIndex );
    }
  });
  index.search({
    query: query,
    hitsPerPage: 2000,
    facetFilters: asFf,
    numericFilters: asNf
  }, function searchDone( err, content ) {
    if ( err ) {
      console.error( err );
    } else {
      searchCompare.globalContent = content;
      var comparisonSelect = $( '#comparison-select' ).val();
      displayDataGrid( searchCompare.globalContent, comparisonSelect )
      prepareCsvData( searchCompare.globalContent, comparisonSelect );
    }
  });
}


function displayDataGrid( content, comparisonSelect ) {
  var tableRows = []
  var tableData = {};

  var field_names = _.map( _.find( comparisonData, { 'name': comparisonSelect } ).field_names );

  tableData[ 'headings' ] = _.map( _.find( comparisonData, { 'name': comparisonSelect } ).headings );
  for (var h in content.hits) {
    res = content.hits[h];
    var tableRow = [ '<a href="details.html?fscs_id=' + res["fscs_id"] + '">' + res["library_name"] + '</a>' ];
    _.forEach( field_names, function(f) {
      tableRow.push(res[f].toLocaleString("en-US"));
    });
    tableRows.push(tableRow);
  }
  tableData[ 'data' ] = tableRows;
  
  if (typeof dataGrid !== 'undefined') {
    dataGrid.destroy();
  }

  var page_url = window.location.href;

  dataGrid = new DataTable("#grid-results", {
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
          return data;
        }
      }
    ]
  });

  dataGrid.on('datatable.sort', function(column, direction) {
  });

  dataGrid.on('similarTable.init', function() {
  });
}

function prepareCsvData( content ) {
  var csvRows = [];

  for (var h in content.hits) {
    var res = content.hits[h];
    var csvHeadings = [ 'Name', 'State' ];
    var library_name = _.replace( res[ 'library_name' ], ',', '' );
    var csvRow = [ library_name, res[ 'state' ] ];

    _.forEach( comparisonData, function( value, key) {
      _.forEach( value.field_names, function( value ) {
        csvHeadings.push( value );
        csvRow.push(res[ value ]);
      } );
    } );
    csvRows.push(csvRow);
  }

  csvRows.unshift( csvHeadings );

  csvContent = "";
  csvRows.forEach(function(rowArray){
     var row = rowArray.join(",");
     csvContent += row + "\r\n";
  }); 

  encodedUri = encodeURI(csvContent);
  /*
  var csvRows = [];
  var excludeFields = [ '_highlightResult', 'address', 'address_change', 'address_match_type', 'administrative_structure', 'bea_region', 'census_block', 'census_track', 'city', 'state', 'cluster_collection', 'cluster_finance', 'cluster_service', 'cluster_staff', 'congressional_district', 'county', 'end_date', 'esri_match_status', 'fscs_definition', 'geocode_score', 'geographic_code', 'gnis_id', 'incits_county_code', 'incits_state_code', 'interlibrary_relationship', 'legal_basis', 'library_id', 'library_name', 'locale_string', 'longitude', 'lsabound', 'mailing_address', 'mailing_city', 'mailing_zip', 'metro_micro_area', 'name_change', 'objectID', 'phone', 'reap_locale', 'reporting_status', 'start_date', 'structure_change', 'total_staff_expenditures_mean', 'total_staff_expenditures_percentile', 'year', 'zip' ];

  for (var h in content.hits) {
    var res = content.hits[h];
    var csvHeadings = [ 'Name', 'State' ];
    var library_name = _.replace( res[ 'library_name' ], ',', '' );
    var csvRow = [ library_name, res[ 'state' ] ];
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
  */
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

// pagination
search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination'
  })
);

// clear all filters
search.addWidget(
  instantsearch.widgets.clearAll({
    container: '#clear-all',
    templates: {
      link: 'Reset filters'
    }
  })
)

// state facet
search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#state-refinement',
    attributeName: 'state',
    limit: 5,
    showMore: true,
    sortBy: ['name:asc'],
    templates: {
      header: 'State'
    }
  })
);

// locale facet
search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#locale-refinement',
    attributeName: 'locale_string',
    sortBy: ['name:asc'],
    templates: {
      header: 'Locale'
    }
  })
);

// total circulation input  
search.addWidget(
  instantsearch.widgets.rangeInput({
    container: '#circulation-input',
    attributeName: 'total_circulation',
    labels: {
      separator: 'to',
      submit: 'Go'
    },
    templates: {
      header: 'Total Circulation'
    }
  })
);

// total circulation slider  
search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: '#total-circulation-refinement',
    attributeName: 'total_circulation',
    templates: {
      header: 'Total Circulation'
    },
    tooltips: {
      format: function(rawValue) {
        return shortenLargeNumber(rawValue).toLocaleString();
        //return Math.round(rawValue).toLocaleString();
      }
    }
  })
);

// total revenue input  
search.addWidget(
  instantsearch.widgets.rangeInput({
    container: '#revenue-input',
    attributeName: 'total_revenue',
    labels: {
      separator: 'to',
      submit: 'Go'
    },
    templates: {
      header: 'Total Revenue'
    }
  })
);


// total revenue slider  
search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: '#total-revenue-refinement',
    attributeName: 'total_revenue',
    templates: {
      header: 'Total Revenue'
    },
    tooltips: {
      format: function(rawValue) {
        return shortenLargeNumber(rawValue).toLocaleString();
        //return Math.round(rawValue).toLocaleString();
      }
    }
  })
);

// total staff input  
search.addWidget(
  instantsearch.widgets.rangeInput({
    container: '#staff-input',
    attributeName: 'total_staff',
    labels: {
      separator: 'to',
      submit: 'Go'
    },
    templates: {
      header: 'Total Staff'
    }
  })
);

// total staff slider  
search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: '#total-staff-refinement',
    attributeName: 'total_staff',
    templates: {
      header: 'Total Staff'
    },
    tooltips: {
      format: function(rawValue) {
        return shortenLargeNumber(rawValue).toLocaleString();
        //return Math.round(rawValue).toLocaleString();
      }
    }
  })
);

// total population input  
search.addWidget(
  instantsearch.widgets.rangeInput({
    container: '#population-input',
    attributeName: 'service_area_population',
    labels: {
      separator: 'to',
      submit: 'Go'
    },
    templates: {
      header: 'Service Area Population'
    }
  })
);

// service area population slider  
search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: '#service-area-population-refinement',
    attributeName: 'service_area_population',
    templates: {
      header: 'Service Area Population'
    },
    tooltips: {
      format: function(rawValue) {
        return shortenLargeNumber(rawValue).toLocaleString();
        //return Math.round(rawValue).toLocaleString();
      }
    }
  })
);

// start the search UI
search.start();

//tell when the widgets are rendered
search.once('render', function(){
  //console.log('render once!');
  $('#search-intro').closest('.row').css('margin-top', $('#min-max-wrapper').outerHeight(true));
});//end render once

// handle share button stuff
var share_btn = document.querySelector('#share-btn');
share_btn.onclick = function( evt ) {
  sharePage( evt );
}

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

/*
function JSONToCSVConvertor(JSONData,fileName,ShowLabel) {
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    if (ShowLabel) {
        var row = "";
        for (var index in arrData[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        CSV += row + '\r\n';
    }
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        for (var index in arrData[i]) {
            var arrValue = arrData[i][index] == null ? "" : '="' + arrData[i][index] + '"';
            row += arrValue + ',';
        }
        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
    }
    if (CSV == '') {
        growl.error("Invalid data");
        return;
    }
    var fileName = "Result";
    if(msieversion()){
        var IEwindow = window.open();
        IEwindow.document.write('sep=,\r\n' + CSV);
        IEwindow.document.close();
        IEwindow.document.execCommand('SaveAs', true, fileName + ".csv");
        IEwindow.close();
    } else {
        var uri = 'data:application/csv;charset=utf-8,' + escape(CSV);
        var link = document.createElement("a");
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
*/
