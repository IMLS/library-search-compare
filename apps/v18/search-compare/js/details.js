var client = algoliasearch('CDUMM9WVUG', '3cc392a5d139bd9131e42a5abb75d4ee');
var index = client.initIndex('libraries_fy18');
var outletsIndex = client.initIndex('outlets_fy18');
var trendsIndex = client.initIndex('trends_fy18'); // comparison data grid labels and field names  

var searchCompare = {}; // comparison data grid labels and field names  

var comparisonData = {};
comparisonData = [{
  name: 'demographic',
  display_name: 'Demographic',
  headings: ['Name', 'Population of Legal Service Area (LSA)', 'Number of central libraries', 'Number of branch libraries', 'Number of bookmobiles', 'Interlibrary relationship code', 'Legal basis code', 'Administrative structure code', 'FSCS public library definition', 'Geographic code'],
  field_names: ['service_area_population', 'central_libraries', 'branch_libraries', 'bookmobiles', 'interlibrary_relationship', 'legal_basis', 'administrative_structure', 'fscs_definition', 'geographic_code']
}, {
  name: 'staff',
  display_name: 'Paid Staff (FTE)',
  headings: ['Name', 'ALA-MLS librarians', 'Total librarians', 'All other paid staff', 'Total paid staff'],
  field_names: ['mls_librarian_staff', 'librarian_staff', 'other_staff', 'total_staff']
}, {
  name: 'revenue',
  display_name: 'Operating Revenue',
  headings: ['Name', 'Local Revenue', 'State Revenue', 'Federal Revenue', 'Other Revenue', 'Total Revenue'],
  field_names: ['local_revenue', 'state_revenue', 'federal_revenue', 'other_revenue', 'total_revenue']
}, {
  name: 'expenditures',
  display_name: 'Operating Expenditures',
  headings: ['Name', 'Salaries & wages', 'Employee benefits', 'Total staff expenditures', 'Print materials expenditures', 'Electronic materials expenditures', 'Other material expenditures', 'Total collection expenditures', 'Other operating expenditures', 'Total operating expenditures'],
  field_names: ['salaries', 'benefits', 'total_staff_expenditures', 'print_expenditures', 'electronic_expenditures', 'other_collection_expenditures', 'total_collection_expenditures', 'other_expenditures', 'total_expenditures']
}, {
  name: 'capital',
  display_name: 'Capital Revenue and Expenditures',
  headings: ['Name', 'Local capital revenue', 'State capital revenue', 'Federal capital revenue', 'Other capital revenue', 'Total capital revenue', 'Total capital expenditures'],
  field_names: ['local_capital_revenue', 'state_capital_revenue', 'federal_capital_revenue', 'other_capital_revenue', 'total_capital_revenue', 'capital_expenditures']
}, {
  name: 'collection',
  display_name: 'Library Collection',
  headings: ['Name', 'Print materials', 'Electronic books', 'Audio-physical units', 'Audio-downloadable units', 'Video-physical units', 'Video-downloadable units', 'Local databases', 'State databases', 'Total databases', 'Print serial subscriptions'],
  field_names: ['print_materials', 'ebooks', 'audio_materials', 'audio_downloads', 'video_materials', 'video_downloads', 'local_databases', 'state_databases', 'total_databases', 'print_serials']
}, {
  name: 'services',
  display_name: 'Services',
  headings: ['Name', 'Public service hours/year', 'Library visits', 'Reference transactions', 'Number of registered users', 'Total circulation of materials', 'Circulation of kid\'s materials', 'Use of electronic material', 'Physical item circulation', 'Electronic information retrievals', 'Electronic content use', 'Total collection use'],
  field_names: ['hours', 'visits', 'references', 'users', 'total_circulation', 'kids_circulation', 'electronic_content_uses', 'physical_item_circulation', 'electronic_info_retrievals', 'electronic_content_uses', 'total_circulation_retrievals']
}, {
  name: 'inter-library',
  display_name: 'Inter-Library Loans',
  headings: ['Name', 'Provided to', 'Received from'],
  field_names: ['loans_to', 'loans_from']
}, {
  name: 'programs',
  display_name: 'Library Programs',
  headings: ['Name', 'Total library programs', 'Children\'s programs', 'Young adult programs', 'Total attendance at library programs', 'Children\'s program attendance', 'Young adult program attendance'],
  field_names: ['total_programs', 'kids_programs', 'ya_programs', 'program_audience', 'kids_program_audience', 'ya_program_audience']
}, {
  name: 'other_electronic',
  display_name: 'Other Electronic Information',
  headings: ['Name', 'Computers used by general public', 'Computer uses', 'Wireless sessions'],
  field_names: ['computers', 'computer_uses', 'wifi_sessions']
}]; // comparison data grid labels and field names  

var longitudinalData = {};
longitudinalData = [
/*
{ name: 'demographic',
  display_name: 'Demographic', 
  headings: [ 'Time Period', 'Population of Legal Service Area (LSA)', 'Number of central libraries', 'Number of branch libraries', 'Number of bookmobiles' ],
  field_names: [ 'POPU_LSA', 'CENTLIB', 'BRANLIB', 'BKMOB' ] },
{ name: 'revenue',
  display_name: 'Operating Revenue', 
  headings: [ 'Time Period', 'Local Revenue ($)', 'State Revenue ($)', 'Federal Revenue ($)', 'Other Revenue ($)', 'Total Revenue ($)' ],
  field_names: [ 'LOCGVT', 'STGVT', 'FEDGVT', 'OTHINCM', 'TOTINCM' ] },
{ name: 'expenditures',
  display_name: 'Operating Expenditures', 
  headings: [ 'Time Period', 'Salaries & wages ($)', 'Employee benefits ($)', 'Total staff expenditures ($)', 'Print materials expenditures ($)', 'Electronic materials expenditures ($)', 'Other material expenditures ($)', 'Total collection expenditures ($)', 'Other operating expenditures ($)', 'Total operating expenditures ($)' ],
  field_names: [ 'SALARIES', 'BENEFIT', 'STAFFEXP', 'PRMATEXP', 'ELMATEXP', 'OTHMATEX', 'TOTEXPCO', 'OTHOPEXP', 'TOTOPEXP' ] },
{ name: 'inter-library',
  display_name: 'Inter-Library Loans', 
  headings: [ 'Time Period', 'Provided to', 'Received from' ],
  field_names: [ 'LOANTO', 'LOANFM' ] },
{ name: 'other_electronic',
  display_name: 'Other Electronic Information', 
  headings: [ 'Time Period', 'Computers used by general public', 'Computer uses' ],
  field_names: [ 'GPTERMS', 'PITUSR' ] }
  */
{
  name: 'staff',
  display_name: 'Staff, Revenue and Expenditures',
  headings: ['Time Period', 'Other Paid Staff (FTE)', 'Total Staff (FTE)', 'Total Librarians (FTE)', 'Total Revenue ($)', 'Total Operating Expenses ($)'],
  field_names: ['other_staff', 'total_staff', 'librarian_staff', 'total_revenue', 'total_expenditures']
}, {
  name: 'collection',
  display_name: 'Library Collection',
  headings: ['Time Period', 'Print Materials', 'E-Books', 'Audio-Physical', 'Audio-Downloadable', 'Video-Physical', 'Video-Downloadable'],
  field_names: ['print_materials', 'ebooks', 'audio_materials', 'audio_downloads', 'video_materials', 'video_downloads']
}, {
  name: 'services',
  display_name: 'Services',
  headings: ['Time Period', 'Visits', 'Reference Transactions', 'Total Circulation', 'Circulation of Children\'s Materials'],
  field_names: ['visits', 'references', 'total_circulation', 'kids_circulation']
}, {
  name: 'programs',
  display_name: 'Library Programs and Electronic Information',
  headings: ['Time Period', 'Library Programs', 'Program Attendance', 'Internet Computers', 'Computer Uses'],
  field_names: ['total_programs', 'program_audience', 'computers', 'computer_uses']
}];
var clusters = [{
  name: "service",
  fields: [{
    field: "fscs_id",
    name: "FSCS_ID"
  }, {
    field: "visits",
    name: "Physical Visits"
  }, {
    field: "references",
    name: "Reference Transactions"
  }, {
    field: "users",
    name: "Registered Users"
  }, {
    field: "total_circulation_retrievals",
    name: "Total Circulation Transactions"
  }, {
    field: "kids_circulation",
    name: "Circulation of Children’s Material (raw number)"
  }, {
    field: "kids_circulation_percentage",
    name: "Percentage of Total Circulation (%)"
  }, {
    field: "physical_item_circulation",
    name: "Physical Circulation"
  }, {
    field: "electronic_content_uses",
    name: "Use of Electronic Material"
  }, {
    field: "loans_to",
    name: "IL Loans to Other Libraries"
  }, {
    field: "loans_from",
    name: "IL Loans from Other Libraries"
  }, {
    field: "total_programs",
    name: "Total Library Programs"
  }, {
    field: "kids_programs",
    name: "Children’s Programs"
  }, {
    field: "ya_programs",
    name: "Young Adult Programs"
  }, {
    field: "program_audience",
    name: "Total Program Attendance"
  }, {
    field: "kids_program_audience",
    name: "Children's Program Attendance"
  }, {
    field: "ya_program_audience",
    name: "Young Adult Program Attendance"
  }, {
    field: "computers",
    name: "Internet Computers"
  }, {
    field: "computer_uses",
    name: "Computer Uses Per Year"
  }, {
    field: "wifi_sessions",
    name: "Wireless Sessions"
  }, {
    field: "web_visits",
    name: "Website Visits (new in FY2018 data)"
  }]
}, {
  name: "staff",
  fields: [{
    field: "fscs_id",
    name: "FSCS_ID"
  }, {
    field: "total_staff",
    name: "Total Paid Staff"
  }, {
    field: "librarian_staff",
    name: "Total Librarians"
  }, {
    field: "mls_librarian_staff",
    name: "ALA MLS Librarians"
  }, {
    field: "other_staff",
    name: "All Other Paid Staff"
  }]
}, {
  name: "finance",
  fields: [{
    field: "fscs_id",
    name: "FSCS_ID"
  }, {
    field: "total_revenue",
    name: "Total Operating Revenue"
  }, {
    field: "local_revenue",
    name: "From Local Government"
  }, {
    field: "state_revenue",
    name: "From State Government"
  }, {
    field: "federal_revenue",
    name: "From Federal Government"
  }, {
    field: "total_staff_expenditures",
    name: "Staff Expenditures"
  }, {
    field: "total_collection_expenditures",
    name: "Collection Expenditures"
  }, {
    field: "print_expenditures",
    name: "Print"
  }, {
    field: "electronic_expenditures",
    name: "Electronic"
  }, {
    field: "other_collection_expenditures",
    name: "Other"
  }, {
    field: "other_expenditures",
    name: "Other Operating Expenditures"
  }, {
    field: "total_capital_revenue",
    name: "Capital Revenue ($)"
  }, {
    field: "capital_expenditures",
    name: "Capital Expenditures ($)"
  }, {
    field: "total_expenditures",
    name: "Total Operating Expenditures"
  }]
}, {
  name: "collection",
  fields: [{
    field: "fscs_id",
    name: "FSCS_ID"
  }, {
    field: "print_materials",
    name: "Print Materials"
  }, {
    field: "ebooks",
    name: "E-Books"
  }, {
    field: "audio_materials",
    name: "Audio-Physical"
  }, {
    field: "video_materials",
    name: "Video-Physical"
  }, {
    field: "audio_downloads",
    name: "Audio-Downloadable"
  }, {
    field: "video_downloads",
    name: "Video-Downloadable"
  }, {
    field: "total_databases",
    name: "Electronic Collection (Databases)"
  }, {
    field: "print_serials",
    name: "Print Serial Collections"
  }]
}];
var base_values = {}; // Add toLocaleFixed to Number prototype

Number.prototype.toLocaleFixed = function (n) {
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


var simulateClick = function simulateClick(elem) {
  // Create our event (with options)
  if (document.createEvent) {
    var evt = document.createEvent("MouseEvent");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    elem.dispatchEvent(evt);
  } else {
    var evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
  } // If cancelled, don't dispatch our event


  var canceled = !elem.dispatchEvent(evt);
}; // parse url params


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
/* Event handler for share this page button
var share_btn = document.querySelector('#share-btn');
share_btn.onclick = function( evt ) {
  sharePage( evt );
}

function sharePage( evt ) {
  var page_url = window.location.href;
  var myLink = document.getElementById( 'shareMe' );
  var myDiv = document.getElementById( 'shareDiv' );
  var closed = myDiv.className.indexOf( 'away' ) !== -1;
  if( closed ) {
    myDiv.className = myDiv.className.replace( 'away', 'here' );
  }
  myLink.value = page_url;
  myLink.select();
  document.execCommand( "copy" );
  hideIt();
}

function hideIt() {
  setTimeout( function(){
    var myDiv = document.getElementById( 'shareDiv' );
    var open = myDiv.className.indexOf( 'here' ) !== -1;
    if( open ) {
      myDiv.className = myDiv.className.replace( 'here', 'away' );
    }
  }, 5000 );
  return false;
}*/
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
    for (var h in content.hits) {
      res = content.hits[h];
      document.getElementById("name").innerHTML = res.library_name;
      document.getElementById("address").innerHTML = res.mailing_address;
      var city = res.mailing_city + ', ' + res.state;
      document.getElementById("city").innerHTML = city;
      var serviceAreaPopulation = 'Service Area Population: ' + res.service_area_population.toLocaleFixed(0);
      document.getElementById("service-area-population").innerHTML = serviceAreaPopulation;
      var locale = 'Locale: ' + res.locale_string;
      document.getElementById("locale").innerHTML = locale + ' (' + res.locale + ')';
      var centralLibraries = 'Central Libraries: ' + res.central_libraries;
      document.getElementById("central-libraries").innerHTML = centralLibraries;
      var branchLibraries = 'Branch Libraries: ' + res.branch_libraries;
      document.getElementById("branch-libraries").innerHTML = branchLibraries;
      var bookmobiles = 'Bookmobiles: ' + res.bookmobiles;
      document.getElementById("bookmobiles").innerHTML = bookmobiles;
      var fscs_id = res.fscs_id;
      document.getElementById("fscs-id").innerHTML = fscs_id; // display library name

      var libraryNames = document.querySelectorAll('.library-name');

      _.forEach(libraryNames, function (el) {
        el.innerHTML = res.library_name;
      });

      res.kids_circulation_percentage = (res.kids_circulation / res.total_circulation_retrievals * 100).toLocaleFixed(1) + '%';

      _.forEach(clusters, function (cluster) {
        _.forEach(cluster.fields, function (field) {
          if (field.field !== "fscs_id") {
            if (cluster.name !== "staff") {
              document.getElementById(field.field).innerHTML = field.name + " <span>" + (typeof res[field.field] == "number" ? res[field.field].toLocaleFixed(0) : res[field.field]) + "</span>";
            } else {
              document.getElementById(field.field).innerHTML = field.name + " <span>" + res[field.field] + "</span>";
            }
          }
        });
      }); // Add total staff to Staff Data section
      // document.getElementById("total_staff").innerHTML = "Total Paid Staff:<span>" + res[ 'total_staff' ] + "</span>";

      /*
      var service = document.querySelector('#service-link');
      service.setAttribute("data-cluster",res.cluster_service);
       var staff = document.querySelector('#staff-link');
      staff.setAttribute("data-cluster",res.cluster_staff);
       var finance = document.querySelector('#finance-link');
      finance.setAttribute("data-cluster",res.cluster_finance);
       var collection = document.querySelector('#collection-link');
      collection.setAttribute("data-cluster",res.cluster_collection);
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
      */

    }
  }
});
outletsIndex.search({
  query: query,
  exactOnSingleWordQuery: 'attribute',
  hitsPerPage: 10000,
  typoTolerance: false
}, function searchDone(err, content) {
  if (err) {
    console.error(err);
    return;
  } else {
    displayOutlets(content);
  }
});
var longitudinalQuery = 'FSCSKEY ' + fscs_id_param;
trendsIndex.search({
  query: longitudinalQuery,
  exactOnSingleWordQuery: 'attribute',
  hitsPerPage: 1000,
  typoTolerance: false
}, function searchDone(err, content) {
  if (err) {
    console.error(err);
    return;
  } else {
    searchCompare.longitudinalContent = content;
    displayTrendsGrid(searchCompare.longitudinalContent, 'staff');
  }
});

function pad(num, size) {
  var s = num + "";

  while (s.length < size) {
    s = "0" + s;
  }

  return s;
} // trends data prototype


function handleTrendSelection(target) {
  var comparisonSelect = target.value;
  displayTrendsGrid(searchCompare.longitudinalContent, comparisonSelect);
}

function displayTrendsGrid(content, comparisonSelect) {
  window.trendData = content.hits[0];
  var trendTableRows = [];
  window.trendTableData = {};

  var field_names = _.map(_.find(longitudinalData, {
    'name': comparisonSelect
  }).field_names);

  trendTableData['headings'] = _.map(_.find(longitudinalData, {
    'name': comparisonSelect
  }).headings);
  var hit = searchCompare.longitudinalContent.hits;
  var rows = {
    '2018 value': '_0',
    '2017 value': '_1',
    '2013 value': '_5',
    '2008 value': '_10'
  };

  _.forEach(rows, function (suffix, label, rows) {
    var trendTableRow = [label];

    _.forEach(field_names, function (field_name) {
      var cell_value = hit[0][field_name + suffix]; // test for undefined value from index  

      cell_value = typeof cell_value === 'undefined' ? '' : cell_value;
      cell_value = isNaN(cell_value) || isNaN(parseInt(cell_value)) ? cell_value : parseFloat(cell_value).toLocaleString('en-US');
      var string_end = _.includes(label, 'year') && isNaN(cell_value) === false ? '%' : '';
      trendTableRow.push(cell_value + string_end);
    });

    trendTableRows.push(trendTableRow);
  });

  trendTableData['data'] = trendTableRows;

  if (typeof trendGrid !== 'undefined') {
    trendGrid.destroy();
  }

  trendGrid = new DataTable("#trends-table", {
    perPage: 5,
    data: trendTableData,
    searchable: false,
    sortable: true,
    perPageSelect: false,
    columns: [{
      select: 0,
      render: function render(data, cell, row) {
        return data;
      }
    }]
  });
  trendGrid.on('datatable.init', function () {
    // $('#trends-table th:not(:first)').css( 'text-align', 'right' );
    var comparisonSelect = $('#trends-select').val(); //add the footnote if needed

    if (comparisonSelect === 'staff') {
      //it's a money one; show the footnote
      $('#trends-table-wrapper .dataTable-bottom .dataTable-info').html('The displayed financial values are not adjusted for inflation, they are the values that were reported for that year.');
    } else {
      //it doesn't need the footnote; clear that area out
      $('#trends-table-wrapper .dataTable-bottom .dataTable-info').html('&nbsp;');
    } //end if revenue or expenditures

  });
  trendGrid.on('datatable.page', function () {});
  trendGrid.on('datatable.sort', function () {});
}

function convertLocale(locale) {
  var expr = Math.floor(locale / 10);

  switch (expr) {
    case 4:
      return 'Rural (' + locale + ')';
      break;

    case 3:
      return 'Town (' + locale + ')';
      break;

    case 2:
      return 'Suburban (' + locale + ')';
      break;

    case 1:
      return 'City (' + locale + ')';
      break;

    default:
      return '';
      break;
  }
}

function convertOutletType(outlet_type) {
  switch (outlet_type) {
    case 'CE':
      return 'Central';
      break;

    case 'BR':
      return 'Branch';
      break;

    case 'BS':
      return 'Bookmobile(s)';
      break;

    case 'MO':
    case 'BM':
      return 'Books-by-Mail Only';
      break;

    default:
      return '';
      break;
  }
}

function displayOutlets(content) {
  if (content.hits.length > 0) {
    var outletRows = [];
    var outletData = {};

    for (var h in content.hits) {
      res = content.hits[h];
      var outletRow = [res['library_name'], res['fscs_id'] + "-" + pad(res['fscs_id_seq'], 3), convertLocale(res['locale']), convertOutletType(res['outlet_type']), res['sq_feet'].toLocaleString("en-US"), res['hours'].toLocaleString("en-US"), res['weeks_open'].toLocaleString("en-US")];
      outletRows.push(outletRow);
    }

    outletData["headings"] = ["Name", "FSCS ID Seq", "Locale Code", "Branch Type", "Square Feet", "Hours", "Weeks Open"];
    outletData["data"] = outletRows;
    outletTable = new DataTable("#outlets-table", {
      perPage: 5,
      perPageSelect: [5, 25, 50, 100],
      data: outletData,
      searchable: false,
      sortable: true,
      columns: [{
        select: 0,
        sortable: true
      }, {
        select: 1,
        sortable: true,
        render: function render(data, cell, row) {
          return data;
        }
      }]
    });
  } else {
    jQuery('#outlets-table-wrapper h3').after('<div>There are no outlets for this library system</div>');
  }
}

; // Get and display cluster data

/*
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
      var clusterName = cluster_type.split("_")[1];
      var field_names = _.map(_.find(clusters, {"name": clusterName}).fields, "field");
      var display_names = _.map(_.find(clusters, {"name": clusterName}).fields, "name");

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
*/
// create table for mean and quartile rank calculations

function createCalculationsTable(baseLibrary, content, field_names, display_names) {
  base_values = {};
  document.getElementById("comparison-headers").innerHTML = "";
  var blankTh = document.createElement("th");
  document.getElementById("comparison-headers").appendChild(blankTh); // display field titles on data grid

  _.forEach(display_names, function (f) {
    if (f !== "FSCS_ID") {
      var th = document.createElement("th");
      var th_text = document.createTextNode(f);
      th.appendChild(th_text);
      document.getElementById("comparison-headers").appendChild(th);
    }
  }); // display library data on data grid


  var elements = document.getElementById("comparison-data").getElementsByTagName("td");
  removeElements(elements);

  _.forEach(field_names, function (f) {
    if (f !== "fscs_id") {
      var td = document.createElement("td");
      var td_text = document.createTextNode(baseLibrary[f].toLocaleString("en-US"));
      td.appendChild(td_text);
      document.getElementById("comparison-data").appendChild(td); // add to base_values object

      base_values[f] = baseLibrary[f];
    }
  }); // Add total_staff_expenditures_mean and total_staff_expenditures_percentile


  base_values["total_staff_expenditures_mean"] = baseLibrary["total_staff_expenditures_mean"];
  base_values["total_staff_expenditures_percentile"] = baseLibrary["total_staff_expenditures_percentile"]; // create empty mean and percentile rank td cells

  var elements = document.getElementById("comparison-mean").getElementsByTagName("td");
  removeElements(elements);
  var elements = document.getElementById("comparison-percentile").getElementsByTagName("td");
  removeElements(elements);

  _.forEach(field_names, function (f) {
    if (f !== "fscs_id") {
      var mean_td = document.createElement("td");
      mean_td.setAttribute("id", "mean-" + f);
      document.getElementById('comparison-mean').appendChild(mean_td);
      var percentile_td = document.createElement("td");
      percentile_td.setAttribute("id", "percentile-" + f);
      document.getElementById('comparison-percentile').appendChild(percentile_td);
    }
  });
}

function removeElements(elements) {
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
} // calculate mean


function calculateMean(content, field_names) {
  _.forEach(field_names, function (f) {
    if (f !== "fscs_id") {
      var values = [];
      total = 0;

      for (var h in content.hits) {
        res = content.hits[h];

        if (res[f] !== "M" && res[f] !== "S") {
          values.push(res[f]);
          total = total + res[f];
        }
      }

      if (f === "total_staff_expenditures") {
        var mean = base_values["total_staff_expenditures_mean"].toLocaleFixed(1);
      } else {
        var mean = (total / values.length).toLocaleFixed(1);
      } // display mean


      displayMean(f, mean);
    }
  });
}

function displayMean(f, mean) {
  var el = "mean-" + f;
  document.getElementById(el).innerHTML = mean;
} // calculate percentile rank


function calculatePercentileRank(content, field_names) {
  _.forEach(field_names, function (f) {
    if (base_values[f] == "M") {
      var percentile_rank = "M";
      displayPercentileRank(f, percentile_rank);
    } else if (base_values[f] == "S") {
      var percentile_rank = base_values["total_staff_expenditures_percentile"];
      displayPercentileRank(f, percentile_rank);
    } else {
      if (f !== "fscs_id") {
        var values = [];

        for (var h in content.hits) {
          res = content.hits[h];
          values.push(res[f]);
        }

        values = _.sortBy(values);

        var position = _.sortedIndex(values, base_values[f]);

        var matches = _.filter(values, function (n) {
          return n == base_values[f];
        });

        var percentile_rank = Math.round((position + 0.5 * matches.length) / values.length * 100); // display percentile rank

        displayPercentileRank(f, percentile_rank);
      }
    }
  });
}

function displayPercentileRank(f, percentile_rank) {
  switch (true) {
    case percentile_rank < 25:
      quartileRank = "Bottom";
      break;

    case percentile_rank < 50:
      quartileRank = "Lower Mid";
      break;

    case percentile_rank < 75:
      quartileRank = "Upper Mid";
      break;

    case percentile_rank < 100:
      quartileRank = "Top";
      break;

    default:
      quartileRank = "NA";
      break;
  }

  document.getElementById("percentile-" + f).innerHTML = quartileRank;
}
/*
function displaySimilarLibraries( baseLibrary, content, cluster_type, field_names, display_names ) {
  var similarName = _.capitalize(cluster_type.split("_")[1]);
  var similarNumber = content.hits.length;
  var tableHeadings = ["Name"];
  var tableRows = [];
  var tableData = {};

  document.getElementById( "similar-name" ).innerHTML = similarName;
  document.getElementById( "similar-number" ).innerHTML = similarNumber;
  $('#expBtn').attr('data-cluster', similarName);

  for (var h in content.hits) {
    res = content.hits[h];
    var tableRow = [ '<a data-name="' + res[ 'library_name' ] + '" href="details.html?fscs_id=' + res["fscs_id"] + '">' + res["library_name"] + '</a>' ];
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
        sortable: true
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
*/


function renderTrendsCsv(trendData) {
  var fields = [{
    id: 'time_period',
    name: 'Time Period'
  }];
  var records = [];

  _.forEach(longitudinalData, function (longitudinalCategory, key) {
    _.forEach(longitudinalCategory.headings, function (longitudinalHeading, key) {
      // skip the name column that does not match corresponding field_names array.
      if (key === 0) return;
      fields.push({
        name: longitudinalCategory.headings[key],
        id: longitudinalCategory.field_names[key - 1]
      });
    });
  });

  var field_names = [];

  _.forEach(fields, function (field, key) {
    field_names.push(field.id);
  });

  var trendTableValuesRows = []; // var trendTableRows = []

  var rows = {
    '2017 value': '_0',
    '2016 value': '_1',
    '2012 value': '_5',
    '2007 value': '_10'
  }; // var rows = {  [current_year + ' value']: '_0', [current_year - 1 + ' value']: '_1', [current_year - 5 + ' value']: '_5', [current_year - 10 + ' value']: '_10' };

  _.forEach(rows, function (suffix, label, rows) {
    var trendTableValuesRow = [];
    /*
    var trendTableRow = {
      time_period: label
    }
    */

    _.forEach(field_names, function (field_name) {
      var cell_value = trendData[field_name + suffix]; // test for undefined value from index  

      cell_value = typeof cell_value === 'undefined' ? '' : cell_value; // cell_value = ( isNaN( cell_value ) || isNaN( parseInt( cell_value ) ) ) ? cell_value : parseFloat( cell_value ).toLocaleString( 'en-US' );

      var string_end = _.includes(label, 'year') && isNaN(cell_value) === false ? '%' : '';
      trendTableValuesRow.push(cell_value + string_end); // trendTableRow[field_name.replace(suffix, '')] = cell_value + string_end
    });

    trendTableValuesRow.shift();
    trendTableValuesRow.unshift(label);
    trendTableValuesRows.push(trendTableValuesRow); // trendTableRows.push(trendTableRow);
  });

  trendTableValuesRows.unshift(field_names);
  var trendCsvContent = '';
  trendTableValuesRows.forEach(function (rowArray) {
    var row = rowArray.join(",");
    trendCsvContent += row + "\r\n";
  });
  encodedUri = encodeURI(trendCsvContent);
  return trendCsvContent;
  /*
  return CSV.serialize({
    fields: fields,
      //.reduce((acc, row) => [ ...new Set([...acc, ...Object.keys(row)]) ], [])
      //.map(key => { return {id: key} }),
    records: trendTableRows 
  })
  */
}

function downloadTrendsCsv(tableData) {
  var csvContent = renderTrendsCsv(window.trendData);
  csvContent = csvContent + '\n\"The financial values are not adjusted for inflation, they are the values that were reported for that year.\",';
  var filename = "imls_data";
  var csvData = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  if (msieversion()) {
    navigator.msSaveBlob(csvData, 'pls_trends_' + searchCompare.longitudinalContent.hits[0].FSCSKEY + '.csv');
  } else {
    // window.open(encodedUri);
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(csvData);
    link.setAttribute('download', 'pls_trends_' + searchCompare.longitudinalContent.hits[0].FSCSKEY + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} //add to URL on button click


jQuery(function ($) {
  $(document).ready(function () {
    // swap in current year text and link to data elements definition document
    $('.current_year').html(current_year);
    $('.data-def-link').attr('href', 'https://www.imls.gov/sites/default/files/fy2017_pls_data_file_documentation.pdf#page=82'); // Call display of trends data prototype table  
    // displayTrendsGrid( 'demographic' );

    _.forEach(longitudinalData, function (value, key) {
      $('#trends-select').append($('<option></option>').attr('value', value.name).text(value.display_name));
    });

    $('#trends-select').change(function (event) {
      var comparisonSelect = event.target.value;
      displayTrendsGrid(searchCompare.longitudinalContent, comparisonSelect);
    }); //end trends data prototype
    //first, make room for header

    headRoom();
    $('.similar-link').click(function (event) {
      //first check if the similar param already exists
      var currentURL = window.location.href.split('/').pop();

      if (currentURL.indexOf('similar') >= 0) {
        var currentURL = currentURL.split('&')[0];
      } //add the appropriate param


      var clickedSimilar = $(this).attr('id').split('-')[0];
      history.replaceState(null, null, currentURL + '&similar=' + clickedSimilar);
      location.hash = 'compared-to';
    }); //end on similar-link click
    //tooltips

    doTooltips();
    /* Handle Return to Search Results button */

    var myReturnURL = localStorage.getItem('returnURL');
    $('#returnTo').attr("href", myReturnURL);

    if (!myReturnURL) {
      $('#returnTo').hide();
    } //if URL is null

  }); //end document ready
}); //dollar sign