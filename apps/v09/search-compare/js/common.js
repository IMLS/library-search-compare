/* Make space for fixed header on resize */
$(window).on('resize', function () {
  headRoom();
}); //end on resize
// handle share button stuff

$('#share-btn, #user-share-btn').on('click', function (evt) {
  sharePage(evt);
});

function sharePage(evt) {
  var shareId = $(evt.target).attr('id');

  if (shareId === 'share-btn') {
    var page_url = window.location.href;
    var myLink = document.getElementById('shareMe');
    var myDiv = document.getElementById('shareDiv');
    var closed = myDiv.className.indexOf('away') !== -1;

    if (closed) {
      myDiv.className = myDiv.className.replace('away', 'here');
    }

    myLink.value = page_url;
    myLink.select();
    document.execCommand("copy");
    hideIt();
  } else if (shareId === 'user-share-btn') {
    console.log(searchCompare.fscs_arr);
  }
}

function hideIt() {
  setTimeout(function () {
    var myDiv = document.getElementById('shareDiv');
    var open = myDiv.className.indexOf('here') !== -1;

    if (open) {
      myDiv.className = myDiv.className.replace('here', 'away');
    }
  }, 5000);
  return false;
}

function msieversion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return true
    {
      return true;
    } else {
    // If another browser,
    return false;
  }

  return false;
}

function prepareCsvData(content) {
  var csvRows = [];

  for (var h in content.hits) {
    var res = content.hits[h];
    var csvHeadings = ['Name', 'fscs_id', 'City', 'State', 'Locale code'];

    var library_name = _.replace(res['library_name'], ',', '');

    var csvRow = [library_name, res['fscs_id'], res['mailing_city'], res['state'], res['locale']];

    _.forEach(comparisonData, function (value, key) {
      _.forEach(value.field_names, function (value) {
        csvHeadings.push(value);
        csvRow.push(res[value]);
      });
    });

    csvRows.push(csvRow);
  }

  csvRows.unshift(csvHeadings);
  csvContent = "";
  csvRows.forEach(function (rowArray) {
    var row = rowArray.join(",");
    csvContent += row + "\r\n";
  });
  encodedUri = encodeURI(csvContent);
}

function downloadCsv() {
  var filename = "imls_data";
  var csvData = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  if (msieversion()) {
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

function shortenLargeNumber(num, digits) {
  var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
      decimal;

  for (var i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1);

    if (num <= -decimal || num >= decimal) {
      return +(num / decimal).toFixed(digits) + units[i];
    }
  } //end for


  return num;
} //end shortenLargeNumber

/* Handle the "Current Filters" section */


function currentFilters() {
  //assemble checked locales
  var selectedLocales = $('#locale-refinement input:checked').map(function () {
    return this.value;
  }).get(); //end map checked locale checkboxes
  //assemble checked states

  var selectedStates = $('#state-refinement input:checked').map(function () {
    return this.value;
  }).get(); //end map checked state checkboxes

  $('#min-max-wrapper .facet').each(function () {
    var currentSlider = $(this).attr('id').replace('-refinement', '').replace('total-', ''); //get current lower position

    var lowerPos = $(this).find('.ais-range-slider--handle-lower').attr('aria-valuenow');
    var lowerPos = shortenLargeNumber(lowerPos, 2); //get current upper position

    var upperPos = $(this).find('.ais-range-slider--handle-upper').attr('aria-valuenow');
    var upperPos = shortenLargeNumber(upperPos, 2); //stick it in the right hole

    $('#' + currentSlider).text(lowerPos + ' - ' + upperPos);
  }); //end each slider container

  /* Fill in "current filters" for locale and state */

  if (jQuery.isEmptyObject(selectedLocales)) {
    $('#current-locales').text('All');
  } else {
    $('#current-locales').text(selectedLocales.join(', '));
  } //end check if any locales are selected


  if (jQuery.isEmptyObject(selectedStates)) {
    $('#current-states').text('All');
  } else {
    $('#current-states').text(selectedStates.join(', '));
  } //end check if any states are selected


  headRoom();
} //end currentFilters function


function headRoom() {
  //do the main page stuff
  if ($('header').css('position') == 'fixed') {
    $('main').css('margin-top', $('header').height());
  } else {
    $('main').css('margin-top', '20px');
  } //also do the user table if needed


  $('#userTable').css('top', $('header').height()); //and the user table button

  $('#show-user-table').css('top', $('header').height());
}