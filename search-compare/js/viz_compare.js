var client = algoliasearch('CDUMM9WVUG', '4ed0ae66adc167ec909a431c46a7897c');
var index = client.initIndex('libraries_fy18_statstru');
var index_name = 'libraries_fy18_statstru';

var topMargin = 20;
var rightMargin = 587;
var leftMargin = 25;
var centerX = 306;
var col1X = leftMargin + 30;
var col2X = 380;
var col3X = rightMargin - 30;
var dataY = 240;
var padding = 3;

Number.prototype.toLocaleFixed = function(n) {
    return this.toLocaleString(undefined, {
      minimumFractionDigits: n,
      maximumFractionDigits: n
    });
};
var fields = [
  {'revenueExpenditureStaff': [
    {'title': 'Revenue, Expenditures, and Staff'},
    {'sections':
      [
        {'Operating Revenue ($)':
          [
            {'Total Operating Revenue': 'total_revenue'},
            {'    - From Local Government': 'local_revenue'},
            {'    - From State Government': 'state_revenue'},
            {'    - From Federal Government': 'federal_revenue'},
            {'    - Other Operating Revenue': 'other_revenue'},
            {'Capital Revenue': 'total_capital_revenue'},
            {'Capital Expenditures': 'capital_expenditures'}
          ]
        },
        {'Operating Expenditures ($)':
          [
            {'Total Operating Expenditures': 'total_expenditures'},
            {'    - Staff Expenditures': 'total_staff_expenditures'},
            {'    - Collection Expenditures': 'total_collection_expenditures'},
            {'        - Print': 'print_expenditures'},
            {'        - Electronic': 'electronic_expenditures'},
            {'        - Other': 'other_collection_expenditures'},
            {'    - Other Operating Expenditures': 'other_expenditures'}
          ]
        },
        {'Paid Staff (FTE)':
          [
            {'Total Paid Staff': 'total_staff'},
            {'    - Total Librarians': 'librarian_staff'},
            {'    - All Other Paid Staff': 'other_staff'}
          ]
        }
      ]
     } // end sections
    ]
  },
  {'programService': 
    [
      {'title': 'Programs and Services'},
      {'sections': 
        [
          {'Programs Offered': 
            [
              {"Total Library Programs": "total_programs"},
              {"    - Children's Programs": "kids_programs"},
              {"    - Young Adult": "ya_programs"},
              {"    - All Other Programs": "all_other_programs"}
            ]
          },
          {'Program Attendance': 
            [
              {"Total Program Attendance": "program_audience"},
              {"    - Children's Program Attendance": "kids_program_audience"},
              {"    - Young Adult Program Attendance": "ya_program_audience"},
              {"    - All Other Program Attendance": "all_other_attendance"}
            ]
          },
          {'Library Services': 
            [
              {"Physical Visits": "visits"},
              {"Website Visits (new in FY2018 data)": "web_visits"},
              {"Library Card Holders": "users"},
              {"Questions Answered": "references"},
              {"Interlibrary Loans (ILL)": "ill"},
              {"    - ILL to Other Libraries": "loans_to"},
              {"    - ILL from Other Libraries": "loans_from"},
            ]
          }
        ]
      }
    ]
  },
  {'collectionCirculation': [
      {'title': 'Collections, Circulation and Technology'},
      {'sections': 
        [
          {"Collections":
            [
              {"Physical": "physical"},
              {"    - Books and other items": "print_materials"},
              {"    - Audio (tapes, CDs)": "audio_materials"},
              {"    - Videos": "video_materials"},
              {"    - Print subscriptions": "print_serials"},
              {"Digital": "digital"},
              {"    - E-Books": "ebooks"},
              {"    - Audio (downloadable)": "audio_downloads"},
              {"    - Video (streaming)": "video_downloads"},
              {"Electronic Collections (Databases)": "total_databases"}
            ]
          },
          {"Circulation":
            [
              {"Total Circulation Transactions": "total_circulation_retrievals"},
              {"    - Physical Circulation": "physical_item_circulation"},
              {"    - Use of Electronic Material": "electronic_content_uses"},
              {"Circulation of Children's Material": "kids_circulation"},
              {"  - As Percentage of Total Circulation (%)": "kids_circulation_percentage"}
            ]
          },
          {"Technology":
            [
              {"Internet Computers": "computers"},
              {"Computer Uses Per Year": "computer_uses"},
              {"Wireless Sessions": "wifi_sessions"}
            ]
          }
        ]
      }
    ]
  }
];

function comparePdf(base_res, compare_res, viz_type) {
  doc = new jsPDF('p', 'pt', 'letter');
  var pdf_fields = _.find(fields, viz_type);
  var title = 'Libraries Side by Side';
  setTitle(title);
  // setLibraryBlock(base_res, compare_res);
  setData(base_res, compare_res, viz_type);
  setFooter(base_res);
  savePdf(doc, base_res, compare_res, title); 
};

function setTitle(title) {
  doc.setFillColor(52, 113, 91);
  doc.rect(0, 0, 612, 75, 'F');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(title, leftMargin, topMargin + 25, 'left');
};

function printColumnHeaders(names, currentY) {
  var fontSize = 10;
  doc.setTextColor(52, 113, 91);
  doc.setFontSize(fontSize);
  names.forEach(function(name, index) {
    var width = doc.getTextWidth(name);
    var col = index === 0 ? col2X : col3X;
    var splitName = doc.splitTextToSize(name, 155)
    doc.text(splitName, col, currentY, 'right');
    /*
    if( width > 155 ) {
      var name_arr = name.split(' ');
      var mid = Math.round((name_arr.length)/2);
      var line1 = name_arr.slice(0,mid).join(' ');
      var line2 = name_arr.slice(mid, name_arr.length).join(' ');
      doc.text(line1, col, currentY, 'right');
      doc.text(line2, col, currentY + fontSize, 'right');
    } else {
      doc.text(name, col, currentY, 'right');
    }
    */
  });
};

/*
function setLibraryBlock(base_res, compare_res) {
  var baseY = 76;
  doc.setFontSize(15);
  doc.text(base_res.library_name + ' (' + base_res.fscs_id + ')', leftMargin, baseY);
  var baseY = 80;
  var fontSize = 10;
  doc.setFontSize(fontSize);
  doc.text(base_res.mailing_address + ' ' + base_res.mailing_city + ', ' + base_res.state, leftMargin, baseY + fontSize);
  doc.text('Service Area Population: ' + base_res.service_area_population.toLocaleFixed(0), leftMargin, baseY + fontSize*2);
  doc.text('Locale: ' + base_res.locale_string.toString() + ' (' + base_res.locale + ')', leftMargin, baseY + fontSize*3);
  if( base_res.structure_change !== '23' ) {
    doc.text('Central Libraries: ' + base_res.central_libraries.toLocaleFixed(0), centerX, baseY + fontSize);
    doc.text('Branch Libraries: ' + base_res.branch_libraries.toLocaleFixed(0), centerX, baseY + fontSize*2);
    doc.text('Bookmobiles: ' + base_res.bookmobiles.toLocaleFixed(0), centerX, baseY + fontSize*3);
  }

  var baseY = 150;
  doc.setFontSize(16);
  doc.text(compare_res.library_name + ' (' + compare_res.fscs_id + ')', leftMargin, baseY);
  var baseY = 154;
  var fontSize = 10;
  doc.setFontSize(fontSize);
  doc.text(compare_res.mailing_address + ' ' + compare_res.mailing_city + ', ' + compare_res.state, leftMargin, baseY + fontSize);
  doc.text('Service Area Population: ' + compare_res.service_area_population.toLocaleFixed(0), leftMargin, baseY + fontSize*2);
  doc.text('Locale: ' + compare_res.locale_string.toString() + ' (' + compare_res.locale + ')', leftMargin, baseY + fontSize*3);
  if( compare_res.structure_change !== '23' ) {
    doc.text('Central Libraries: ' + compare_res.central_libraries.toLocaleFixed(0), centerX, baseY + fontSize);
    doc.text('Branch Libraries: ' + compare_res.branch_libraries.toLocaleFixed(0), centerX, baseY + fontSize*2);
    doc.text('Bookmobiles: ' + compare_res.bookmobiles.toLocaleFixed(0), centerX, baseY + fontSize*3);
  }
};
*/

function setData(base, compare, viz_type) {
  var pdf_fields = _.find(fields, viz_type);
  var sections = _.find(pdf_fields[viz_type], 'sections').sections;
  var currentY = 100;
  base['kids_circulation_percentage'] = (( base['kids_circulation'] / base['total_circulation_retrievals']) * 100);
  compare['kids_circulation_percentage'] = (( compare['kids_circulation'] / compare['total_circulation_retrievals']) * 100);
  base['all_other_programs'] =  base['total_programs'] - base['kids_programs'] - base['ya_programs'];
  compare['all_other_programs'] =  compare['total_programs'] - compare['kids_programs'] - compare['ya_programs'];
  base['all_other_attendance'] = base['program_audience'] - base['kids_program_audience'] - base['ya_program_audience'];
  compare['all_other_attendance'] = compare['program_audience'] - compare['kids_program_audience'] - compare['ya_program_audience'];
  base['ill'] = base['physical'] = base['digital'] = "";
  compare['ill'] = compare['physical'] = compare['digital'] = "";

  printColumnHeaders([base.library_name, compare.library_name], currentY);

  //currentY = currentY + fontSize*1.3;
  
  var fontSize = 10;
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);
  currentY = currentY + 20
  var lineHeight = fontSize + padding;
  /*
  doc.text("FSCS ID ", col1X, currentY + lineHeight);
  doc.text(base['fscs_id'], col2X, currentY + lineHeight, 'right');
  doc.text(compare['fscs_id'], col3X, currentY + lineHeight, 'right');
  currentY = currentY + lineHeight;
  */
  //doc.rect(col1X - 3, currentY, col3X - col1X + 6, lineHeight + 3, 'F');

  // Handle Law Library "S" value
  var baseServiceAreaPopulation = typeof(base['service_area_population']) === 'string' ?  'N/A' : base['service_area_population'].toLocaleFixed(0);
  var compareServiceAreaPopulation = typeof(compare['service_area_population']) === 'string' ?  'N/A' : compare['service_area_population'].toLocaleFixed(0);

  addStripe(col1X - 3, currentY, lineHeight);
  doc.text("Service Area Population ", col1X, currentY + lineHeight);
  doc.text(baseServiceAreaPopulation, col2X, currentY + lineHeight, 'right');
  doc.text(compareServiceAreaPopulation, col3X, currentY + lineHeight, 'right');
  currentY = currentY + lineHeight;
  doc.text("Locale ", col1X, currentY + lineHeight);
  doc.text(base['locale_string'].toString() +  ' (' + base['locale'] + ')', col2X, currentY + lineHeight, 'right');
  doc.text(compare['locale_string'].toString() +  ' (' + compare['locale'] + ')', col3X, currentY + lineHeight, 'right');
  currentY = currentY + lineHeight;
  addStripe(col1X - 3, currentY, lineHeight);
  doc.text("Central Libraries ", col1X, currentY + lineHeight);
  doc.text(base['central_libraries'].toLocaleFixed(0), col2X, currentY + lineHeight, 'right');
  doc.text(compare['central_libraries'].toLocaleFixed(0), col3X, currentY + lineHeight, 'right');
  currentY = currentY + lineHeight;
  doc.text("Branch Libraries ", col1X, currentY + lineHeight);
  doc.text(base['branch_libraries'].toLocaleFixed(0), col2X, currentY + lineHeight, 'right');
  doc.text(compare['branch_libraries'].toLocaleFixed(0), col3X, currentY + lineHeight, 'right');
  currentY = currentY + lineHeight;
  addStripe(col1X - 3, currentY, lineHeight);
  doc.text("Bookmobiles ", col1X, currentY + lineHeight);
  doc.text(base['bookmobiles'].toLocaleFixed(0), col2X, currentY + lineHeight, 'right');
  doc.text(compare['bookmobiles'].toLocaleFixed(0), col3X, currentY + lineHeight, 'right');

  currentY = currentY + fontSize*1.3;

  fields.forEach(function(type, index) {
    //console.log(typeof(type));
    //console.log(Object.keys(type));
    var fontSize = 12;
    var type = Object.keys(type)[0];
    var pdf_fields = _.find(fields, type);
    var sections = _.find(pdf_fields[type], 'sections').sections;

    /*
    if( type === 'programService') {
      setFooter();
      doc.addPage('letter', 'p');
      currentY = 60;
      printColumnHeaders([base.library_name, compare.library_name], currentY);
    }
    */

    sections.forEach(function(section, index) { 
      var striped = true;
      var fontSize = 12;
      var sectionTitle = _.keys(section).join();
      console.log(sectionTitle);
      if( sectionTitle === 'Library Services') {
        setFooter();
        doc.addPage('letter', 'p');
        var title = 'Libraries Side by Side';
        setTitle(title);
        currentY = 100;
        printColumnHeaders([base.library_name, compare.library_name], currentY);
      }
      var lineHeight = fontSize + padding;
      doc.setFontSize(fontSize);
      doc.setTextColor(52, 113, 91);
      //if( index !== 0 ) {
        currentY = currentY + lineHeight + 7;
      //}
      doc.text(sectionTitle, col1X, currentY);
      currentY = currentY + 3;
      //currentY = currentY + fontSize/2;
      var fontSize = 10;
      doc.setTextColor(0, 0, 0);
      var lineHeight = fontSize + padding;
      doc.setFontSize(fontSize);
      section[sectionTitle].forEach(function(line, index) {
        if( striped ) { addStripe(col1X, currentY, lineHeight) }
        label = _.keys(line).join();
        data_field = line[label];
        //console.log(compare[data_field]);
        doc.text(label + " ", col1X, currentY + lineHeight);
        var base_data = typeof(base[data_field]) === "number" ? base[data_field].toLocaleFixed(0) : base[data_field];
        var compare_data = typeof(compare[data_field]) === "number" ? compare[data_field].toLocaleFixed(0) : compare[data_field];
        doc.text(base_data, col2X, currentY + lineHeight, 'right');
        doc.text(compare_data, col3X, currentY + lineHeight, 'right');
        currentY = currentY + lineHeight;
        striped = striped ? false : true ;
      });
    });
  });

  var footnoteY = addFootnote(606, 'FTE stands for full-time equivalent. Libraries report FTE based on a measure of 40 hours per week. For example, 60 hours per week of part-time work by employees in a staff category divided by the 40-hour measure equals 1.50 FTEs.');
  var footnote2Y = addFootnote(footnoteY + 20, 'S = Suppressed for personally identifiable information, M = Missing');
};

function addStripe(rectX, rectY, height) {
  doc.setFillColor(249,249,249);
  doc.rect(rectX, rectY + 4, col3X - col1X + 6, height - 1, 'F');
}

function addFootnote(footnoteY, footnote) {
  var splitFootnote = doc.splitTextToSize(footnote, col3X - col1X);
  var fontSize = 10
  doc.setFontSize(fontSize);
  var footnoteY = footnoteY + fontSize * 2 + 4;
  doc.text(splitFootnote, col1X, footnoteY + fontSize * 2 + 4);
  return footnoteY;
};

function setFooter(res) {
  var baseY = 710;
  //doc.setDrawColor(52, 113, 91);
  doc.setDrawColor(195,196,198);
  doc.line(leftMargin, baseY, rightMargin, baseY);
  var fontSize = 10;
  doc.setFontSize(fontSize);
  doc.text('All data from IMLS FY2018 Public Libraries Survey',leftMargin, baseY + 40);
  var imls_logo = new Image();
  imls_logo.src = '../img/viz/imls_logo_2c.jpg';
  doc.addImage(imls_logo, 'JPEG', leftMargin + 370, baseY + 5, 150, 68);
}

function savePdf (doc, base, compare, title) {
  doc.save('Compare_' + base['fscs_id'] + '_and_' + compare['fscs_id'] +  "_FY18.pdf");
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function() {
  var fscs_id_param = getParameterByName('fscs_id');
  var viz_type = getParameterByName('viz_type');
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
      base_res = content.hits[0];
      console.log(base_res.library_name);
      $('#library-name').html('Compare ' + base_res.library_name + ' to:');
    };
  });



  $('#viz-hits').click(function(e) {
    e.preventDefault();
    var compare_fscs_id = e.target.dataset.id;
    var query = 'fscs_id ' + compare_fscs_id;

    index.search({ 
        query: query,
        exactOnSingleWordQuery: 'attribute', 
        typoTolerance: false
      }, function searchDone(err, content) {
      if (err) {
        console.error(err);
        return;
      } else {
        var compare_res = content.hits[0];
        comparePdf(base_res, compare_res, viz_type);
      };
    });
  });

  var search = instantsearch({
    // Replace with your own values
    appId: 'CDUMM9WVUG',
    apiKey: '4ed0ae66adc167ec909a431c46a7897c', // search only API key, no ADMIN key
    indexName: index_name,
    numberLocale: 'en-US',
    stalledSearchDelay: 5000,
    routing: false,
    searchParameters: {
      hitsPerPage: 25
    }
  });

  // search input widget  
  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#compare-viz-search-input'
    })
  );

  // display results
  search.addWidget(
    instantsearch.widgets.hits({
      container: '#viz-hits',
      templates: {
        item: document.getElementById('hit-template').innerHTML,
        empty: "We didn't find any results for the search <em>\"{{query}}\"</em>"
      }
    })
  );

  // start the search UI
  search.start();
  $('.ais-search-box--magnifier-wrapper').hide();
});

