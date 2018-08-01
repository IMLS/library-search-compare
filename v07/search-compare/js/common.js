/* Make space for fixed header on resize */
$(window).on('resize', function(){
	headRoom();
});//end on resize

function shortenLargeNumber(num, digits) {
  var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
      decimal;

  for(var i=units.length-1; i>=0; i--) {
      decimal = Math.pow(1000, i+1);

      if(num <= -decimal || num >= decimal) {
          return +(num / decimal).toFixed(digits) + units[i];
      }
  }//end for

  return num;
}//end shortenLargeNumber

/* Handle the "Current Filters" section */
function currentFilters(){

	//assemble checked locales
	var selectedLocales = $('#locale-refinement input:checked').map(function(){
		return this.value;
	}).get();//end map checked locale checkboxes

	//assemble checked states
	var selectedStates = $('#state-refinement input:checked').map(function(){
		return this.value;
	}).get();//end map checked state checkboxes


	$('#min-max-wrapper .facet').each(function(){
		var currentSlider = $(this).attr('id').replace('-refinement','').replace('total-','');

		//get current lower position
		var lowerPos = $(this).find('.ais-range-slider--handle-lower').attr('aria-valuenow');
		var lowerPos = shortenLargeNumber(lowerPos,2);

		//get current upper position
		var upperPos = $(this).find('.ais-range-slider--handle-upper').attr('aria-valuenow');
		var upperPos = shortenLargeNumber(upperPos,2);

		//stick it in the right hole
		$('#'+currentSlider).text(lowerPos+' - '+upperPos);

	});//end each slider container


	/* Fill in "current filters" for locale and state */
	if(jQuery.isEmptyObject(selectedLocales)){
		$('#current-locales').text('All');
	}else{
		$('#current-locales').text(selectedLocales.join(', '));
	}//end check if any locales are selected

	if(jQuery.isEmptyObject(selectedStates)){
		$('#current-states').text('All');
	}else{
		$('#current-states').text(selectedStates.join(', '));
	}//end check if any states are selected

	headRoom();

}//end currentFilters function

function headRoom() {
  //do the main page stuff
  if ($('header').css('position') == 'fixed'){
    $('main').css('margin-top', $('header').height());
  }else{
    $('main').css('margin-top', '20px');
  }

  //also do the user table if needed
  $('#userTable').css('top', $('header').height());

  //and the user table button
  $('#show-user-table').css('top', $('header').height());
}