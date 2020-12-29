var client = algoliasearch('CDUMM9WVUG', '4ed0ae66adc167ec909a431c46a7897c');
var index = client.initIndex('libraries_fy18_statstru');
var index_name = 'libraries_fy18_statstru';
var topMargin = 20;
var rightMargin = 587;
var leftMargin = 25;
var centerX = 306;
var dataX = 285;
var chartY = 180;
var chart2Y = 450;
var padding = 7;

Number.prototype.toLocaleFixed = function (n) {
  return this.toLocaleString(undefined, {
    minimumFractionDigits: n,
    maximumFractionDigits: n
  });
};

function openVizModal(e, fscs_id, viz_type) {
  e.preventDefault();
  toggleModal();
  $('#fscsid').html(fscs_id);
  $('input[name="viz-fscs-id"]').val(fscs_id);
}

function vizPdf(e, fscs_id, viz_type) {
  e.preventDefault();
  var query = 'fscs_id ' + fscs_id;
  index.search({
    query: query,
    exactOnSingleWordQuery: 'attribute',
    typoTolerance: false
  }, function searchDone(err, content) {
    if (err) {
      console.error(err);
      return;
    } else {
      var res = content.hits[0];
      console.log(res);
      switchPdf(res, viz_type);
    }
  });
}

function switchPdf(res, viz_type) {
  switch (viz_type) {
    case 'revenueExpenditureStaff':
      revenueExpenditureStaff(res, viz_type);
      break;

    case 'programService':
      programService(res, viz_type);
      break;

    case 'collectionCirculation':
      collectionCirculation(res, viz_type);
      break;

    default:
      console.log('no pdf type chosen');
  }
}

function revenueExpenditureStaff(res, viz_type) {
  doc = new jsPDF('p', 'pt', 'letter');
  var fontSize = 11;
  doc.setFontSize(fontSize);
  var labelX = doc.getTextWidth('"Total Operating Expenditures:' + res.total_expenditures);
  var baseY = chartY;
  pdf_fields = _.find(fields, viz_type);

  var title = _.find(pdf_fields[viz_type], 'title').title;

  var sections = _.find(pdf_fields[viz_type], 'sections').sections;

  setTitle(title);
  setLibraryBlock(res);
  endDataY = setData(res, sections, doc, baseY, labelX);
  var footnoteY = addFootnote(endDataY, 'FTE stands for full-time equivalent. Libraries report FTE based on a measure of 40 hours per week. For example, 60 hours per week of part-time work by employees in a staff category divided by the 40-hour measure equals 1.50 FTEs.');
  var footnote2Y = addFootnote(footnoteY + 40, 'S = Suppressed for personally identifiable information'); //without_mls = res.librarian_staff - res.mls_librarian_staff;

  var is_suppressed = isNaN(res.total_staff_expenditures) === true || isNaN(res.other_expenditures) === true ? true : false;

  if (is_suppressed) {
    var non_collection_expenditures = res.total_expenditures - res.total_collection_expenditures;
    pieChart('Operating Expenditures', 40, leftMargin, chartY, [{
      name: 'Collection',
      value: res.total_collection_expenditures
    }, {
      name: 'Other',
      value: non_collection_expenditures
    }]);
  } else {
    pieChart('Operating Expenditures by Type', 40, leftMargin, chartY, [{
      name: 'Staff',
      value: res.total_staff_expenditures
    }, {
      name: 'Collection',
      value: res.total_collection_expenditures
    }, {
      name: 'Other',
      value: res.other_expenditures
    }]);
  }

  pieChart('Collection Expenditures by Type', 40, leftMargin, 360, [{
    name: 'Print',
    value: res.print_expenditures
  }, {
    name: 'Electronic',
    value: res.electronic_expenditures
  }, {
    name: 'Other',
    value: res.other_collection_expenditures
  }]);
  pieChart('Paid Staff by Type', 40, leftMargin, 540, [{
    name: 'Total Librarians',
    value: res.librarian_staff
  }, {
    name: 'All Other Paid Staff',
    value: res.other_staff
  }]);
  setFooter(res);
  savePdf(doc, res, title);
}

var fields = [{
  'programService': [{
    'title': 'Library Programs and Services'
  }, {
    'sections': [{
      'Programs Offered': [{
        "Total Library Programs": "total_programs"
      }, {
        "    - Children's Programs": "kids_programs"
      }, {
        "    - Young Adult Programs": "ya_programs"
      }, {
        "    - All Other Programs": "all_other_programs"
      }]
    }, {
      'Program Attendance': [{
        "Total Program Attendance": "program_audience"
      }, {
        "    - Children's Program Attendance": "kids_program_audience"
      }, {
        "    - Young Adult Program Attendance": "ya_program_audience"
      }, {
        "    - All Other Program Attendance": "all_other_attendance"
      }]
    }, {
      'Library Services': [{
        "Physical Visits": "visits"
      }, {
        "Website Visits (new in FY2018 data)": "web_visits"
      }, {
        "Library Card Holders": "users"
      }, {
        "Questions Answered": "references"
      }, {
        "Interlibrary Loans (ILL)": "ill"
      }, {
        "    - ILL to Other Libraries": "loans_to"
      }, {
        "    - ILL from Other Libraries": "loans_from"
      }]
    }]
  }]
}, {
  'collectionCirculation': [{
    'title': 'Library Collections, Circulation, and Technology'
  }, {
    'sections': [{
      "Collections": [{
        "Physical": "physical"
      }, {
        "    - Books and other items": "print_materials"
      }, {
        "    - Audio (tapes, CDs)": "audio_materials"
      }, {
        "    - Videos": "video_materials"
      }, {
        "    - Print subscriptions": "print_serials"
      }, {
        "Digital": "digital"
      }, {
        "    - E-Books": "ebooks"
      }, {
        "    - Audio (downloadable)": "audio_downloads"
      }, {
        "    - Video (streaming)": "video_downloads"
      }, {
        "Electronic Collections (Databases)": "total_databases"
      }]
    }, {
      "Circulation": [{
        "Total Circulation Transactions": "total_circulation_retrievals"
      }, {
        "    - Physical Circulation": "physical_item_circulation"
      }, {
        "    - Use of Electronic Material": "electronic_content_uses"
      }, {
        "Circulation of Children's Material": "kids_circulation"
      }, {
        "    - As Percentage of Total Circulation (%)": "kids_circulation_percentage"
      }]
    }, {
      "Technology": [{
        "Internet Computers": "computers"
      }, {
        "Computer Uses Per Year": "computer_uses"
      }, {
        "Wireless Sessions": "wifi_sessions"
      }]
    }]
  }]
}, {
  'revenueExpenditureStaff': [{
    'title': 'Library Revenue, Expenditures, and Staff'
  }, {
    'sections': [{
      'Operating Revenue ($)': [{
        'Total Operating Revenue': 'total_revenue'
      }, {
        '    - From Local Government': 'local_revenue'
      }, {
        '    - From State Government': 'state_revenue'
      }, {
        '    - From Federal Government': 'federal_revenue'
      }, {
        '    - Other Operating Revenue': 'other_revenue'
      }, {
        'Capital Revenue': 'total_capital_revenue'
      }, {
        'Capital Expenditures': 'capital_expenditures'
      }]
    }, {
      'Operating Expenditures ($)': [{
        'Total Operating Expenditures': 'total_expenditures'
      }, {
        '    - Staff Expenditures': 'total_staff_expenditures'
      }, {
        '    - Collection Expenditures': 'total_collection_expenditures'
      }, {
        '        - Print': 'print_expenditures'
      }, {
        '        - Electronic': 'electronic_expenditures'
      }, {
        '        - Other': 'other_collection_expenditures'
      }, {
        '    - Other Operating Expenditures': 'other_expenditures'
      }]
    }, {
      'Paid Staff (FTE)': [{
        'Total Paid Staff': 'total_staff'
      }, {
        '    - Total Librarians': 'librarian_staff'
      }, {
        '    - All Other Paid Staff': 'other_staff'
      }]
    }] // end sections

  }]
}];

function programService(res, viz_type) {
  doc = new jsPDF('p', 'pt', 'letter');
  var fontSize = 11;
  doc.setFontSize(fontSize);
  var labelX = doc.getTextWidth('"Young Adult Program Attendance: ' + res.ya_program_audience);
  var baseY = chartY;
  pdf_fields = _.find(fields, viz_type);

  var title = _.find(pdf_fields[viz_type], 'title').title;

  var sections = _.find(pdf_fields[viz_type], 'sections').sections;

  setTitle(title);
  setLibraryBlock(res);
  res.ill = "";
  res.all_other_programs = res.total_programs - res.kids_programs - res.ya_programs;
  res.all_other_attendance = res.program_audience - res.kids_program_audience - res.ya_program_audience;
  endDataY = setData(res, sections, doc, baseY, labelX); //var fontSize = 14;
  //doc.setFontSize(fontSize);

  pieChart('Programs Offered', 70, leftMargin, chartY, [{
    name: "Children's Programs",
    value: res.kids_programs
  }, {
    name: "Young Adult Programs",
    value: res.ya_programs
  }, {
    name: "All Other Programs",
    value: res.all_other_programs
  }]);
  pieChart('Program Attendance', 70, leftMargin, chart2Y, [{
    name: "Children's Program Attendance",
    value: res.kids_program_audience
  }, {
    name: "Young Adult Program Attendance",
    value: res.ya_program_audience
  }, {
    name: 'All Other Program Attendance',
    value: res.all_other_attendance
  }]);
  setFooter(res);
  savePdf(doc, res, title);
}

function collectionCirculation(res, viz_type) {
  doc = new jsPDF('p', 'pt', 'letter');
  var labelX = doc.getTextWidth('Website Visits (new in FY2018 data) ' + res.kids_circulation);
  var baseY = chartY;
  pdf_fields = _.find(fields, viz_type);

  var title = _.find(pdf_fields[viz_type], 'title').title;

  var sections = _.find(pdf_fields[viz_type], 'sections').sections;

  res.kids_circulation_percentage = res.kids_circulation / res.total_circulation_retrievals * 100;
  res.physical = res.digital = "";
  setTitle(title);
  setLibraryBlock(res);
  endDataY = setData(res, sections, doc, baseY, labelX);
  physical_av = res.audio_materials + res.video_materials;
  downloadable_av = res.audio_downloads + res.video_downloads;
  other_circulation = res.total_circulation_retrievals - res.kids_circulation;
  pieChart('Collection Materials by Type', 70, leftMargin, chartY, [{
    name: "Books and Other Items",
    value: res.print_materials
  }, {
    name: "Physical Audio and Video",
    value: physical_av
  }, {
    name: "E-Books",
    value: res.ebooks
  }, {
    name: "Digital Audio and Video",
    value: downloadable_av
  }]);
  pieChart('Circulation', 70, leftMargin, chart2Y, [{
    name: "Circulation of Children's Materials",
    value: res.kids_circulation
  }, {
    name: "Circulation of All Other Materials",
    value: other_circulation
  }]);
  setFooter(res);
  savePdf(doc, res, title);
}

function setData(res, sections, doc, currentY, labelX) {
  labelX = rightMargin - 20;
  sections.forEach(function (section, index) {
    var fontSize = 15;
    doc.setFontSize(fontSize);
    doc.setTextColor(52, 113, 91);

    var sectionTitle = _.keys(section).join();

    if (index !== 0) {
      currentY = currentY + fontSize * 2;
    }

    doc.text(sectionTitle, dataX, currentY);
    currentY = currentY + fontSize / 2;
    var fontSize = 12;
    doc.setTextColor(0, 0, 0);
    var lineHeight = fontSize + padding;
    doc.setFontSize(fontSize);
    section[sectionTitle].forEach(function (line, index) {
      label = _.keys(line).join();
      data_field = line[label];
      doc.text(label + " ", dataX, currentY + lineHeight);
      var data = typeof res[data_field] === "number" ? res[data_field].toLocaleFixed(0) : res[data_field];
      doc.text(data, labelX, currentY + lineHeight, 'right');
      currentY = currentY + lineHeight;
    });
  });
  return currentY;
}

;

function setTitle(title) {
  doc.setFillColor(52, 113, 91);
  doc.rect(0, 0, 612, 55, 'F');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text(title, leftMargin, topMargin + 15, 'left');
}

;

function setLibraryBlock(res) {
  var baseY = 76;
  doc.setFontSize(15);
  doc.setTextColor(0, 0, 0);
  doc.text(res.library_name + ' (' + res.fscs_id + ')', leftMargin, baseY);
  var baseY = 80;
  var fontSize = 10;
  doc.setFontSize(fontSize);
  doc.text(res.mailing_address + ' ' + res.mailing_city + ', ' + res.state, leftMargin, baseY + fontSize * 2);
  doc.text('Service Area Population: ' + res.service_area_population.toLocaleFixed(0), leftMargin, baseY + fontSize * 3);
  doc.text('Locale: ' + res.locale_string.toString() + ' (' + res.locale + ')', leftMargin, baseY + fontSize * 4);

  if (res.structure_change !== '23') {
    doc.text('Central Libraries: ' + res.central_libraries.toLocaleFixed(0), centerX, baseY + fontSize * 2);
    doc.text('Branch Libraries: ' + res.branch_libraries.toLocaleFixed(0), centerX, baseY + fontSize * 3);
    doc.text('Bookmobiles: ' + res.bookmobiles.toLocaleFixed(0), centerX, baseY + fontSize * 4);
  }

  doc.setLineWidth(2);
  doc.setDrawColor(195, 196, 198);
  doc.setLineWidth(1);
  doc.line(leftMargin, baseY + fontSize * 6, rightMargin, baseY + fontSize * 6);
}

;

function addFootnote(footnoteY, footnote) {
  var splitFootnote = doc.splitTextToSize(footnote, rightMargin - dataX);
  var fontSize = 10;
  doc.setFontSize(fontSize);
  var footnoteY = footnoteY + fontSize * 2 + 4;
  doc.text(splitFootnote, dataX, footnoteY + fontSize * 2 + 4);
  return footnoteY;
}

;

function setFooter(res) {
  var baseY = 710;
  doc.setDrawColor(195, 196, 198);
  doc.setLineWidth(1);
  doc.line(leftMargin, baseY, rightMargin, baseY);
  var fontSize = 10;
  doc.setFontSize(fontSize);
  doc.text('All data from IMLS FY2018 Public Libraries Survey', leftMargin, baseY + 40);
  var imls_logo = new Image();
  imls_logo.src = './img/viz/imls_logo_2c.jpg';
  doc.addImage(imls_logo, 'JPEG', leftMargin + 370, baseY + 5, 150, 68);
}

function savePdf(doc, res, title) {
  doc.save(res.library_name + ' - ' + title + " FY18.pdf");
}

$(document).ready(function () {
  $(document).on('click', '.compare-viz', function (e) {
    e.preventDefault();
    console.log(dataset.id);
  });
  $('.viz-close-button').click(function () {
    toggleModal();
  });
  $('#viz-download-btn').click(function (e) {
    var fscs_id = $('#viz-fscs-id').val();
    var viz_type = $('select#viz-type option:selected').val();
    vizPdf(e, fscs_id, viz_type);
  });
  $('#compare-select').change(function (e) {
    if ($('#compare-select option:selected').text() === 'Yes') {
      base_res = res;
      base_fscs_id = $('#viz-fscs-id').val();
      viz_type = $('#viz-type').val();
      var url = window.location.origin + 'compare.html?fscs_id=' + base_fscs_id + '&viz_type=' + viz_type;
      var compare_window = window.open(url);
      compare_window.base_res = base_res;
    }
  });
  /*
  var search = instantsearch({
    // Replace with your own values
    appId: 'CDUMM9WVUG',
    apiKey: '4ed0ae66adc167ec909a431c46a7897c', // search only API key, no ADMIN key
    indexName: index_name,
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
      container: '#viz-search-input'
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
  */
});
/*
function toggleModal() {
  $('.viz-modal').toggleClass('viz-show-modal');
}
*/
// Pie chart jspdf plugin

function pieChart(title, _radius, _left, _top, _data) {
  var square = _radius * 2;
  var fontSize = 15;
  doc.setFontSize(fontSize);
  doc.text(title, leftMargin + 15, _top);
  var keyY = _top + _radius * 2 + 15;
  _left = _radius + _left + 20;
  _top = _radius + _top + fontSize;
  var total = 0;

  for (var e in _data) {
    total = total + _data[e].value;
  }

  chart_total = 100 / total;
  doc.circle(_left, _top, _radius, 'F');
  var time = 0;
  var colors = [[0, 58, 99], // dark blue
  [156, 197, 202], //light blue
  [227, 111, 30], //orange
  [95, 96, 98], // gray
  [52, 113, 91]];
  doc.setLineWidth(2);
  var text_coordinates = [];

  for (var z = 0; z < _data.length; z++) {
    // calculate percentage
    var percentage = (_data[z].value / total * 100).toFixed(0);
    /*
    console.log(percentage);
    console.log(total);
    */

    var _grad = _data[z].value * chart_total * 3.6;

    _data[z].value = _grad;

    if (_grad > 0 && _grad <= 360) {
      var lineatexto = 0;

      for (var i = time; i <= _grad + time; i++) {
        if (lineatexto == 0) {
          lineatexto = _radius;
        }

        var _rad = i * Math.PI / 180;

        var x = _left + _radius * Math.cos(_rad);

        var y = _top - _radius * Math.sin(_rad);

        doc.setDrawColor(colors[z][0], colors[z][1], colors[z][2]);
        doc.line(_left, _top, x, y);
        doc.setLineWidth(2);

        if (lineatexto > 1) {
          _radius = lineatexto;
          lineatexto = 1;
          text_coordinates.push({
            x: x,
            y: y,
            data: _data[z].name
          });
        }
      }

      time = time + _grad - 0.1;
    } // Output data key


    var fontSize = 11;
    var padding = 7;
    doc.setFillColor(colors[z][0], colors[z][1], colors[z][2]);
    doc.rect(leftMargin + 10, keyY + (fontSize * (z + 1) - fontSize) + padding * (z + 1), 12, 12, 'F');
    doc.setFontSize(fontSize);
    doc.text(_data[z].name + ' (' + percentage + '%)', leftMargin + fontSize + 20, keyY + fontSize * (z + 1) + padding * (z + 1));
  }

  doc.setDrawColor(195, 196, 198);
  doc.setFillColor(255, 255, 255);
  doc.setLineWidth(1);
  doc.circle(_left, _top, _radius / 4, 'FD');
  time = 0;
}
