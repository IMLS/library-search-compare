var client = algoliasearch('CDUMM9WVUG', '3cc392a5d139bd9131e42a5abb75d4ee');
var index = client.initIndex('imls_v04');

var search = instantsearch({
  // Replace with your own values
  appId: 'CDUMM9WVUG',
  apiKey: '3cc392a5d139bd9131e42a5abb75d4ee', // search only API key, no ADMIN key
  indexName: 'imls_v04',
  numberLocale: 'en-US',
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

search.on( 'render', getFullData );

function getFullData() {
  index.search({
    hitsPerPage: 2000
  }, function searchDone( err, content ) {
    if ( err ) {
      console.error( err );
    } else {
      displayDataGrid( content )
      prepareCsvData( content );
    }
  });
}

function displayDataGrid( content ) {
  var tableRows = []
  var tableData = {};
  tableData.headings  = [ 'Name', 'Local Revenue', 'State Revenue', 'Federal Revenue', 'Other Revenue', 'Total Revenue', 'Total Expenditures' ];
  var field_names = [ 'local_revenue', 'state_revenue', 'federal_revenue', 'other_revenue', 'total_revenue', 'total_expenditures' ];

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
  console.log( page_url );

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
  var csvContent = "data:text/csv;charset=utf-8,";
  csvRows.forEach(function(rowArray){
     var row = rowArray.join(",");
     csvContent += row + "\r\n";
  }); 

  encodedUri = encodeURI(csvContent);
}


function downloadCsv() {
  window.open(encodedUri);
}
// display hits library compare data grid
/*
function renderFn(HitsRenderingOptions) {
  var tableData = {};
  tableData.headings  = [ 'Local Revenue', 'State Revenue', 'Federal Revenue', 'Other Revenue', 'Total Revenue', 'Total Expenditures' ];
  console.log( tableData );
  console.log( HitsRenderingOptions.hits );
  HitsRenderingOptions.widgetParams.containerNode.html(
    HitsRenderingOptions.hits.map(function(hit) {
    })
  );
};

var customHits = instantsearch.connectors.connectHits(renderFn)

search.addWidget(
  customHits({
    containerNode: $('#grid-results'),
  })
);
*/

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

//tell when the widgets are rendered
search.once('render', function(){
  //console.log('render once!');
  $('#search-intro').closest('.row').css('margin-top', $('#min-max-wrapper').outerHeight(true));
});//end render once
