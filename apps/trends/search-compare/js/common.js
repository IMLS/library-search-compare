/* Make space for fixed header on resize */
$(window).on('resize', function () {
  headRoom(); //also, recheck any dropdowns that are open

  if ($('.show').length) {
    isElementInViewport();
  }
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

    var library_name = _.replace(res['library_name'], /,/g, '');

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
  //assemble checked legal

  var selectedLegals = $('#legal-basis-refinement input:checked').map(function () {
    return this.value;
  }).get(); //end map checked legal basis checkboxes

  /* Code to get values from sliders:
   $('.min-max').each(function(){
  	var currentSlider = $(this).attr('id').replace('-refinement','').replace('total-','');
     
  	//get current lower position
  	var lowerPos = $(this).find('.ais-range-slider--handle-lower').attr('aria-valuenow');
  	var lowerPos = shortenLargeNumber(lowerPos,2);
  		//get current upper position
  	var upperPos = $(this).find('.ais-range-slider--handle-upper').attr('aria-valuenow');
  	var upperPos = shortenLargeNumber(upperPos,2);
  		//stick it in the right hole
  	$('#'+currentSlider).text(lowerPos+' - '+upperPos);
  	});//end each slider container*/

  /* Code to get values from inputs: */

  $('.ais-range-input').each(function () {
    //find out which one we're on
    var whichRange = $(this).parent().parent().attr('id').replace('-input', ''); //gather the data about it

    var lowerPos = $('#' + whichRange + '-input .ais-range-input--inputMin').val();
    var upperPos = $('#' + whichRange + '-input .ais-range-input--inputMax').val(); //if the input is empty or if it's out of bounds, use its min/max value

    if (!lowerPos) {
      lowerPos = $('#' + whichRange + '-input .ais-range-input--inputMin').attr('placeholder');
    }

    if (!upperPos) {
      upperPos = $('#' + whichRange + '-input .ais-range-input--inputMax').attr('placeholder');
    } //console.log('summary to update: #'+whichRange+'; its min is '+lowerPos+' and its max is '+upperPos);
    //shorten 'em up


    upperPos = shortenLargeNumber(upperPos, 2);
    lowerPos = shortenLargeNumber(lowerPos, 2); //stick it in the right hole

    $('#' + whichRange).text(lowerPos + ' - ' + upperPos);
  }); //end each range input

  /* Fill in "current filters" for locale, state, and legal basis */

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


  if (jQuery.isEmptyObject(selectedLegals)) {
    $('#current-legals').text('All');
  } else {
    $('#current-legals').text(selectedLegals.join(', '));
  } //end check if any legals are selected


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

  if ($('header').css('position') === 'fixed') {
    $('#show-user-table').css({
      'top': $('header').height(),
      'bottom': 'auto'
    });
  } else {
    $('#show-user-table').css({
      'bottom': '200px',
      'top': 'auto'
    });
  }
}

function isElementInViewport() {
  var showDiv = document.querySelector('.show'); // Get its position in the viewport

  var bounding = showDiv.getBoundingClientRect(); //console.log(bounding);

  if (bounding.right >= (window.innerWidth || document.documentElement.clientWidth)) {
    //it's going off the right side
    $('.show').addClass('right');
  } else {
    $('.show').removeClass('right');
  } //end if right bounding is negative

} //end isElementInViewport

/* Tooltips Function */


function doTooltips() {
  var t = !1,
      e = !1;
  $("[rel~=tooltip]").focus(function () {
    if (t = $(this), tip = t.attr("title"), e = $('<div id="tooltip"></div>'), !tip || "" == tip) return !1;
    t.removeAttr("title"), e.css("opacity", 0).html(tip).appendTo("body");

    var o = function o() {
      $(window).width() < 1.5 * e.outerWidth() ? e.css("max-width", $(window).width() / 2) : e.css("max-width", 340);
      var o = t.offset().left + t.outerWidth() / 2 - e.outerWidth() / 2,
          i = t.offset().top - e.outerHeight() - 20;

      if (o < 0 ? (o = t.offset().left + t.outerWidth() / 2 - 20, e.addClass("left")) : e.removeClass("left"), o + e.outerWidth() > $(window).width() ? (o = t.offset().left - e.outerWidth() + t.outerWidth() / 2 + 20, e.addClass("right")) : e.removeClass("right"), i < 0) {
        i = t.offset().top + t.outerHeight();
        e.addClass("top");
      } else e.removeClass("top");

      e.css({
        left: o,
        top: i
      }).animate({
        top: "+=10",
        opacity: 1
      }, 50);
    };

    o(), $(window).resize(o);
  }).blur(function () {
    $(this).attr("id"), e.animate({
      top: "-=10",
      opacity: 0
    }, 50, function () {
      $(this).attr("id"), $(this).remove();
    }), t.attr("title", tip);
  }).mouseenter(function () {
    if (target_mouseenter = $(this), tip_mouseenter = target_mouseenter.attr("title"), tooltip_mouseenter = $('<div id="tooltip"></div>'), !tip_mouseenter || "" == tip_mouseenter) return !1;
    target_mouseenter.removeAttr("title"), tooltip_mouseenter.css("opacity", 0).html(tip_mouseenter).appendTo("body");

    var t = function t() {
      $(window).width() < 1.5 * tooltip_mouseenter.outerWidth() ? tooltip_mouseenter.css("max-width", $(window).width() / 2) : tooltip_mouseenter.css("max-width", 340);
      var t = target_mouseenter.offset().left + target_mouseenter.outerWidth() / 2 - tooltip_mouseenter.outerWidth() / 2,
          e = target_mouseenter.offset().top - tooltip_mouseenter.outerHeight() - 20;

      if (t < 0 ? (t = target_mouseenter.offset().left + target_mouseenter.outerWidth() / 2 - 20, tooltip_mouseenter.addClass("left")) : tooltip_mouseenter.removeClass("left"), t + tooltip_mouseenter.outerWidth() > $(window).width() ? (t = target_mouseenter.offset().left - tooltip_mouseenter.outerWidth() + target_mouseenter.outerWidth() / 2 + 20, tooltip_mouseenter.addClass("right")) : tooltip_mouseenter.removeClass("right"), e < 0) {
        e = target_mouseenter.offset().top + target_mouseenter.outerHeight();
        tooltip_mouseenter.addClass("top");
      } else tooltip_mouseenter.removeClass("top");

      tooltip_mouseenter.css({
        left: t,
        top: e
      }).animate({
        top: "+=10",
        opacity: 1
      }, 50);
    };

    t(), $(window).resize(t);
  }).mouseleave(function () {
    $(this).attr("id"), tooltip_mouseenter.animate({
      top: "-=10",
      opacity: 0
    }, 50, function () {
      $(this).attr("id"), $(this).remove();
    }), target_mouseenter.attr("title", tip_mouseenter);
  });
}