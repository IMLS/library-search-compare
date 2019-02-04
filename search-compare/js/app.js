var client = algoliasearch('CDUMM9WVUG', '4ed0ae66adc167ec909a431c46a7897c');
var index = client.initIndex('imls_v04');

// comparison data grid labels and field names  
var searchCompare = {};
searchCompare.fscs_arr = [];
var comparisonData = {};

comparisonData = [
  { name: 'demographic',
    display_name: 'Demographic', 
    headings: [ 'Name', 'Population of Legal Service Area (LSA)', 'Total unduplicated population of LSA', 'Central libraries', 'Branch libraries', 'Bookmobiles', 'Interlibrary relationship code', 'Legal basis code', 'Administrative structure code', 'FSCS public library definition', 'Geographic code' ],
    field_names: [ 'service_area_population', 'unduplicated_population', 'central_libraries', 'branch_libraries', 'bookmobiles', 'interlibrary_relationship', 'legal_basis', 'administrative_structure', 'fscs_definition', 'geographic_code' ],
    field_types: [ 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'string', 'string', 'string' ] },
  { name: 'staff',
    display_name: 'Paid Staff (FTE)', 
    headings: [ 'Name', 'ALA-MLS librarians', 'Total librarians', 'All other paid staff', 'Total paid staff' ],
    field_names: [ 'mls_librarian_staff', 'librarian_staff', 'other_staff', 'total_staff' ],
    field_types: [ 'number', 'number', 'number', 'number' ] },
  { name: 'revenue',
    display_name: 'Operating Revenue', 
    headings: [ 'Name', 'Local Revenue ($)', 'State Revenue ($)', 'Federal Revenue ($)', 'Other Revenue ($)', 'Total Revenue ($)' ],
    field_names: [ 'local_revenue', 'state_revenue', 'federal_revenue', 'other_revenue', 'total_revenue' ],
    field_types: [ 'dollars', 'dollars', 'dollars', 'dollars', 'dollars' ] },
  { name: 'expenditures',
    display_name: 'Operating Expenditures', 
    headings: [ 'Name', 'Salaries & wages ($)', 'Employee benefits ($)', 'Total staff expenditures ($)', 'Print materials expenditures ($)', 'Electronic materials expenditures ($)', 'Other material expenditures ($)', 'Total collection expenditures ($)', 'Other operating expenditures ($)', 'Total operating expenditures ($)' ],
    field_names: [ 'salaries', 'benefits', 'total_staff_expenditures', 'print_expenditures', 'electronic_expenditures', 'other_collection_expenditures', 'total_collection_expenditures', 'other_expenditures', 'total_expenditures' ],
    field_types: [ 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars' ] },
  { name: 'capital',
    display_name: 'Capital Revenue and Expenditures', 
    headings: [ 'Name', 'Local capital revenue ($)', 'State capital revenue ($)', 'Federal capital revenue ($)', 'Other capital revenue ($)', 'Total capital revenue ($)', 'Total capital expenditures ($)' ],
    field_names: [ 'local_capital_revenue', 'state_capital_revenue', 'federal_capital_revenue', 'other_capital_revenue', 'total_capital_revenue', 'capital_expenditures' ],
    field_types: [ 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars' ] },
  { name: 'collection',
    display_name: 'Library Collection', 
    headings: [ 'Name', 'Print materials', 'Electronic books', 'Audio-physical units', 'Audio-downloadable units', 'Video-physical units', 'Video-downloadable units', 'Local databases', 'State databases', 'Total databases', 'Print serial subscriptions' ],
    field_names: [ 'print_materials', 'ebooks', 'audio_materials', 'audio_downloads', 'video_materials', 'video_downloads', 'local_databases', 'state_databases', 'total_databases', 'print_serials' ],
    field_types: [ 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number' ] },
  { name: 'services',
    display_name: 'Services', 
    headings: [ 'Name', 'Public service hours/year', 'Library visits', 'Reference transactions', 'Registered users', 'Total circulation of materials', 'Circulation of kid\'s materials', 'Electronic Circulation', 'Physical item circulation', 'Electronic information retrievals', 'Electronic content use', 'Total collection use' ],
    field_names: [ 'hours', 'visits', 'references', 'users', 'total_circulation', 'kids_circulation', 'electronic_circulation', 'physical_item_circulation', 'electronic_info_retrievals', 'electronic_content_uses', 'total_circulation_retrievals' ],
    field_types: [ 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number' ] },
  { name: 'inter-library',
    display_name: 'Inter-Library Loans', 
    headings: [ 'Name', 'Provided to', 'Received from' ],
    field_names: [ 'loans_to', 'loans_from' ],
    field_types: [ 'number', 'number' ] },
  { name: 'programs',
    display_name: 'Library Programs', 
    headings: [ 'Name', 'Total library programs', 'Children\'s programs', 'Young adult programs', 'Total attendance at library programs', 'Children\'s program attendance', 'Young adult program attendance' ],
    field_names: [ 'total_programs', 'kids_programs', 'ya_programs', 'program_audience', 'kids_program_audience', 'ya_program_audience' ],
    field_types: [ 'number', 'number', 'number', 'number', 'number', 'number' ] },
  { name: 'other_electronic',
    display_name: 'Other Electronic Information', 
    headings: [ 'Name', 'Computers used by general public', 'Computer uses', 'Wireless sessions' ],
    field_names: [ 'computers', 'computer_uses', 'wifi_sessions' ],
    field_types: [ 'number', 'number', 'number' ] }
];

function handleDataSelection( target ) {
  var comparisonSelect = target.value;
  var targetID = $( target ).attr( 'id' );
  if( targetID === 'comparison-select' ) {
    displayDataGrid( searchCompare.globalContent, comparisonSelect );
    $('#expBtn').attr('data-cluster', $('#comparison-select').val());
  } else if( targetID === 'user-comparison-select' ) {
    getUserComparisonData();
    $('#userExpBtn').attr('data-cluster', $('#user-comparison-select').val());
  }
}

function getJsonFromUrl(url) {
  var url_arr = url.split('?');
  var query = url_arr[1];
  query = typeof query != 'undefined' ? query : '';
  var result = {};
  query.split("&").forEach(function(part) {
    if(!part) return;
    part = part.split("+").join(" "); // replace every + with space, regexp-free version
    var eq = part.indexOf("=");
    var key = eq>-1 ? part.substr(0,eq) : part;
    var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : "";
    var from = key.indexOf("[");
    if(from==-1) result[decodeURIComponent(key)] = val;
    else {
      var to = key.indexOf("]",from);
      var index = decodeURIComponent(key.substring(from+1,to));
      key = decodeURIComponent(key.substring(0,from));
      if(!result[key]) result[key] = [];
      if(!index) result[key].push(val);
      else result[key][index] = val;
    }
  });
  return result;
}

function getFullData() {
  //console.log('getFullData');

  //if ( window.app.store.getState().searchMode === 'table' ) {
  if($('#list-results').is(':visible') === false ){
    //start the loading notice
    $('header, main, footer').attr('aria-hidden', 'true');
    $('#modalOverlay').removeClass('hidden');
    $('#loading-spinner').removeClass('paused');
    $('#loading-spinner span').html('Content is loading....<br>This could take several moments for larger result sets.');

    var url_params = getJsonFromUrl( searchCompare.instantSearchURL );
    var params_obj = {};

    _.mapKeys( url_params, function( value, key ) { 
      _.set(params_obj, key, value);
    } );

    // Get query string
    var query = params_obj['query'];  

    // Create array of refinementList (facet) statements
    var rl_arr = [];

    _.forEach(params_obj['refinementList'], function(value, key) {
      var rl_query_string = '(';
      _.forEach(params_obj['refinementList'][key], function(value) {
        rl_query_string = rl_query_string + key + ':' + value + ' OR ';
      });
      rl_query_string = rl_query_string.slice(0, -4);
      rl_query_string = rl_query_string + ')';
      rl_arr.push(rl_query_string);
    });

    // Create array of range input statements
    var range_arr = [];

    _.forEach(params_obj['range'], function(value, key) {
      _.forEach(params_obj['range'][key].split(':'), function(value, inner_key) {
        if(value !== '') {
          var range_string = '';
          var comparator = inner_key === 0 ? ' >= ' : ' <= ';
          range_string = range_string + key + comparator + value;
          range_arr.push(range_string);
        }
      })
    });

    var rl_string = rl_arr.join( ' AND ');  
    var range_string = range_arr.join( ' AND ');  

    filter_string = rl_string.length > 0 && range_string.length > 0 ? rl_string + ' AND ' + range_string : rl_string + range_string;


    var browser = index.browseAll({ 
      query: query,
      filters: filter_string
    });

    var myHits = [];
    var myContent = {};
    
    browser.on('result', function onResult(content) {
      myHits = myHits.concat(content.hits);
    });

    browser.on('end', function onEnd() {
      console.log('Finished!');
      console.log('We got %d hits', myHits.length);
      myContent.hits = myHits;
      searchCompare.globalContent = myContent;
      var comparisonSelect = $( '#comparison-select' ).val();
      displayDataGrid( searchCompare.globalContent, comparisonSelect );
      prepareCsvData( searchCompare.globalContent, comparisonSelect );
    });

    browser.on('error', function onError(err) {
      throw err;
    });
  }
}

function displayDataGrid( content, comparisonSelect ) {
  var state = window.app.store.getState()
  var imlsTableEl = document.createElement('imls-table')
  imlsTableEl.rowData = content.hits
  if (comparisonSelect) {
    imlsTableEl.compareOn = comparisonSelect
  }
  imlsTableEl.userCompareListOnly = false
  imlsTableEl.userCompareList = state.myLibraries
  imlsTableEl.shareUrl = window.location.href
  imlsTableEl.hideActions = true
  document.querySelector('#grid-results-wrapper').innerHTML = ''
  document.querySelector('#grid-results-wrapper').appendChild(imlsTableEl)
  imlsTableEl.addEventListener('remove-library', function(event) {
    window.app.store.dispatch({type: 'REMOVE_LIBRARY', id: event.detail})
  })
  imlsTableEl.addEventListener('add-library', function(event) {
    window.app.store.dispatch({type: 'ADD_LIBRARY', id: event.detail})
  })
  window.app.store.subscribe(function() {
    state = window.app.store.getState()
    imlsTableEl.userCompareList = state.myLibraries
    imlsTableEl.render()
  })
}

function setAddUserCompareHandler() {
  // Click event for adding libraries to user-comparison table  
  $('.user-compare-btn').on('click', function( evt ) {
    evt.stopPropagation();
    evt.stopImmediatePropagation();
    if( evt.target.dataset.action === 'add' ) {
      searchCompare.fscs_arr.push( evt.target.dataset.fscs );
    } else {
      _.pull( searchCompare.fscs_arr, evt.target.dataset.fscs );
    }
    $('[data-fscs=' + evt.target.dataset.fscs + ']')
      .each(function (index) {
        $(this).toggleClass( 'user-compare-add user-compare-remove' );
        if( this.dataset.action === 'add' ) {
          $(this).attr( 'data-action', 'remove' );
        } else {
          $(this).attr( 'data-action', 'add' );
        }
      })
    searchCompare.fscs_arr = _.uniq( searchCompare.fscs_arr );
    //getUserComparisonData();
    evt.preventDefault();
  } );
}

function getUserComparisonData() {
  var state = window.app.store.getState()
  if( state.myLibraries !== 0 ) {
    var filterParam = []
    _.forEach( state.myLibraries, function(id) {
      var filterString = "fscs_id:" + id;
      filterParam.push( filterString );
    } );

    index.search({
      query: '',
      hitsPerPage: 10000,
      facetFilters: [filterParam]
    }, function comparisonSearchDone( err, content ) {
      if ( err ) {
        console.log( err );
      } else {
        var comparisonSelect = $( '#user-comparison-select' ).val() ? $( '#user-comparison-select' ).val() : 'demographic';
        var imlsTableEl = document.createElement('imls-table')
        imlsTableEl.rowData = content.hits
        imlsTableEl.compareOn = comparisonSelect
        imlsTableEl.userCompareListOnly = true
        imlsTableEl.userCompareList = state.myLibraries 
        document.querySelector('#userTable .page-shadow').innerHTML = ''
        document.querySelector('#userTable .page-shadow').appendChild(imlsTableEl)
        imlsTableEl.addEventListener('remove-library', function(event) {
          window.app.store.dispatch({type: 'REMOVE_LIBRARY', id: event.detail})
        })
        imlsTableEl.addEventListener('add-library', function(event) {
          window.app.store.dispatch({type: 'ADD_LIBRARY', id: event.detail})
        })
        window.app.store.subscribe(function() {
          state = window.app.store.getState()
          imlsTableEl.userCompareList = state.myLibraries
          imlsTableEl.render()
        })
        imlsTableEl.addEventListener('show-modal', function(event){
          $('#exp-'+event.detail).show();
          showModal($('#modal'));
        })
      };
    })
  } else {
    $( '#user-comparison-results' ).empty();
  }
}

function displayUserComparisonGrid ( content, comparisonSelect, el ) {
  var tableRows = []
  var tableData = {};

  var field_names = _.map( _.find( comparisonData, { 'name': comparisonSelect } ).field_names );

  tableData[ 'headings' ] = _.map( _.find( comparisonData, { 'name': comparisonSelect } ).headings );
  tableData[ 'headings' ].unshift('');
  for (var h in content.hits) {
    res = content.hits[h];
    //var tableRow = [ '<a data-name="' + res[ 'library_name' ] + '" data-fscs="' + res[ "fscs_id" ] + '" href="details.html?fscs_id=' + res["fscs_id"] + '">' + res["library_name"] + ' (' + res[ "fscs_id" ] + ')' + '</a>' ];
    var tableRow = [ '<i class="user-compare-btn user-compare-remove" data-fscs="' + res[ "fscs_id" ] + '" data-action="remove"></i>', '<a data-name="' + res[ 'library_name' ] + '" href="details.html?fscs_id=' + res["fscs_id"] + '">' + res["library_name"] + ' (' + res[ "fscs_id" ] + ')' + '</a>' ];
    _.forEach( field_names, function(f) {
      tableRow.push(res[f].toLocaleString("en-US"));
    });
    tableRows.push(tableRow);
  }
  tableData[ 'rows' ] = tableRows;
  
  if (typeof comparisonGrid !== 'undefined') {
    comparisonGrid.destroy();
  }

  var page_url = window.location.href;

  comparisonGrid = new DataTable(el, {
    perPage: 50,
    data: tableData,
    searchable: false,
    perPageSelect: false,
    columns: [
      {
        select: 1,
        sortable: true
      },
      {
        select: 2,
        render: function( data, cell, row) {
          return data;
        }
      }
    ]
  });
  comparisonGrid.on('datatable.init', function() {
    setAddUserCompareHandler();
  });

  comparisonGrid.on('datatable.page', function() {
    setAddUserCompareHandler();
  });

  comparisonGrid.on('datatable.sort', function() {
    setAddUserCompareHandler();
  });
}

function returnButton(){
  var returnURL = window.location.href;
  console.log('now returnURL = '+returnURL);
  localStorage.setItem('returnURL', returnURL);
}

function changeLegalLabels(){
  $('#legal-basis-refinement .ais-refinement-list--label').each(function(){
    $(this).contents().filter(function(){
      switch($.trim(this.textContent)){
        case 'CC':
          this.textContent = this.textContent.replace('CC','City/County');
          break;
        case 'CI':
          this.textContent = this.textContent.replace('CI','Municipal Gov\'t');
          break;
        case 'CO':
          this.textContent = this.textContent.replace('CO','County/Parish');
          break;
        case 'LD':
          this.textContent = this.textContent.replace('LD','Library District');
          break;
        case 'MJ':
          this.textContent = this.textContent.replace('MJ','Multi-jurisdictional');
          break;
        case 'NL':
          this.textContent = this.textContent.replace('NL','NA Tribal Gov\'t');
          break;
        case 'NP':
          this.textContent = this.textContent.replace('NP','Non-Profit');
          break;
        case 'OT':
          this.textContent = this.textContent.replace('OT','School District');
          break;
        case 'SD':
          this.textContent = this.textContent.replace('SD','Other');
      }//end switch
    });//end filter label contents
  });//end each label
}

function startAppJs() {
  // Comparison data selector event handler
  $( '#comparison-select, #user-comparison-select' ).change( function() { 
    handleDataSelection( this );
  });

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
               // getFullData( res.results );
            }
          });
          origOpen.apply(this, arguments);
      };
  })();


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
      clearsQuery: true,
      templates: {
        link: '<i class="icon-x"></i> Clear All Filters'
      }
    })
  )

  // state facet
  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#state-refinement',
      attributeName: 'state',
      limit: 65,
      showMore: false,
      sortBy: ['name:asc']
    })
  );

  // locale facet
  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#locale-refinement',
      attributeName: 'locale_string',
      sortBy: ['name:asc']
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
      }
    })
  );

  // total revenue input  
  search.addWidget(
    instantsearch.widgets.rangeInput({
      container: '#revenue-input',
      attributeName: 'total_revenue',
      min: 0,
      max: 312078526,
      labels: {
        separator: 'to',
        submit: 'Go'
      }
    })
  );

  // total staff input  
  search.addWidget(
    instantsearch.widgets.rangeInput({
      container: '#staff-input',
      attributeName: 'total_staff',
      min: 0,
      max: 2209,
      labels: {
        separator: 'to',
        submit: 'Go'
      }
    })
  );

  // total population input  
  search.addWidget(
    instantsearch.widgets.rangeInput({
      container: '#population-input',
      attributeName: 'service_area_population',
      min: 0,
      max: 4137076,
      labels: {
        separator: 'to',
        submit: 'Go'
      }
    })
  );

  // legal basis facet
  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#legal-basis-refinement',
      attributeName: 'legal_basis',
      limit: 65,
      showMore: false,
      sortBy: ['name:asc']
    })
  );

  // branch libraries input  
  search.addWidget(
    instantsearch.widgets.rangeInput({
      container: '#branch-libraries-input',
      attributeName: 'branch_libraries',
      min: 0,
      max: 92,
      labels: {
        separator: 'to',
        submit: 'Go'
      }
    })
  );

  // visits input  
  search.addWidget(
    instantsearch.widgets.rangeInput({
      container: '#visits-input',
      attributeName: 'visits',
      min: 0,
      max: 17420607,
      labels: {
        separator: 'to',
        submit: 'Go'
      }
    })
  );

  // total programs input  
  search.addWidget(
    instantsearch.widgets.rangeInput({
      container: '#total-programs-input',
      attributeName: 'total_programs',
      min: 0,
      max: 104226,
      labels: {
        separator: 'to',
        submit: 'Go'
      }
    })
  );

  // start the search UI
  search.start();

  //tell when the widgets are rendered the first time
  search.once('render', function(){
    
    /* Make space for fixed header once filters are loaded */
    headRoom();
    
    doTooltips();

    /* Change labels on 'Legal Basis' dropdowns */
    changeLegalLabels();

  });//end render once

  //tell when the widgets are re-rendered
  var updateSearchUI = function() {
    /* Make sure the content is still in the right place */
    headRoom();
    
    /* Assemble the 'current filters' list and stick it in */
    currentFilters();

    /* Change labels on 'Legal Basis' dropdowns */
    changeLegalLabels();

    // call second search to populate comparison table
    searchCompare.instantSearchURL = search.createURL();
    getFullData()

    //if an input refinement is empty, display a message.
    $('.filter-dropdown .ais-root').each(function(){
      if ($(this).parent().css('display') == 'none'){
        $(this).parent().parent().append('<div class="none-avail">No refinement available.</div>');
      }else{
        $(this).parent().parent().remove('.none-avail');
      }
    });//end check each input
  }
  search.on('render', updateSearchUI)
  search.on('error', updateSearchUI)

  // fill in data grid variable selector
  var selectLabels = _.map( comparisonData, 'display_name' );
  var selectValues = _.map( comparisonData, 'name' );
  _.forEach( comparisonData, function( value, key ) {
    $( '#comparison-select, #user-comparison-select' ).append( $('<option></option>' )
      .attr( 'value', value.name )
      .text( value.display_name ));
  });//end forEach

    /* Toggle between list and grid view for results */
  $('#viewToggle').on('click', function(){
    // window.app.store.dispatch({type:'TOGGLE_SEARCH_MODE'})
    if($('#list-results').is(':visible')){
      $('#list-results').hide();
      $('#download-csv').show();
      $('#grid-results-wrapper').show();
      $('#comparison-select-wrapper').show();
      $('#expBtn').show();
      $('#viewToggle i').toggleClass('icon-list-view icon-grid-view');
      $('#viewToggle span').text('List Libraries');
      getFullData();
    }else{
      $('#list-results').show();
      $('#download-csv').hide();
      $('#grid-results-wrapper').hide();
      $('#comparison-select-wrapper').hide();
      $('#expBtn').hide();
      $('#viewToggle i').toggleClass('icon-list-view icon-grid-view');
      $('#viewToggle span').text('Compare Libraries');
    }//end if list is shown
  });//end on viewToggle click

  /* Hide and show User Table */
  $('#show-user-table').on('click', function(){
    $('#userTable, #results').toggleClass('open closed');
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    if($('#userTable').hasClass('open')){
      getUserComparisonData();
      $('#show-user-table').text('Show Search Results');
    }else{
      $('#show-user-table').text('Show My Libraries');
    }
  });//end on show-user-table click

  /* Add their current URL to local storage before they leave the page */
  window.addEventListener("beforeunload", function (e) {
    var returnURL = window.location.href;
    //console.log('now returnURL = '+returnURL);
    localStorage.setItem('returnURL', returnURL);
  });

  /* Set up the definitions buttons */
  $('#expBtn').attr('data-cluster', $('#comparison-select').val());
  $('#userExpBtn').attr('data-cluster', $('#user-comparison-select').val());

  /* Handle filter dropdowns */
  $('.filter-dropdown button').click(function(){
    $('.filter-dropdown button').not(this).next('div').removeClass('show');
    $(this).next('div').toggleClass('show');
    if($('.show').length){
      isElementInViewport();
    }    
  });//end filter-dropdown button click
  $(document).click(function(e){
    if((!$(e.target).closest('.filter-dropdown > div input[type="number"]').length) && (!$(e.target).closest('.filter-dropdown > button').length)) {
      //document was clicked and it wasn't a dropdown button or a range input
      $('.filter-dropdown > div').each(function(){
        if($(this).hasClass('show')){
          //the dropdown is open; close it
          $(this).removeClass('show');
        }
      });//end check each dropdown
    }
  });//end if click document
}

$(document).ready(function() {
  window.app = document.createElement('search-compare-app')
  document.body.appendChild(window.app)
  $( '#csvBtnWrapper' ).html('<button id="download-csv" onclick="downloadCsv();" class="btn btn-deault btn-sm"><i class="icon-file-excel"></i> Download</button>');
  $('#download-csv').hide();
});
