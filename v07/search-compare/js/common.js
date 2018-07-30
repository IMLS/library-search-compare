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

	//get slider values if they've been modified
	$('.ais-root.ais-range-input').each(function(){
		
		var minInput = $(this).find('.ais-range-input--inputMin').val();
		var maxInput = $(this).find('.ais-range-input--inputMax').val();
		
		if(!minInput){
			console.log('min is empty');
		}else{
			console.log('there is something in min!');
		}

		var minValue = $(this).find('.ais-range-input--inputMin').attr('min');
		var maxValue = $(this).find('.ais-range-input--inputMax').attr('max');

		

		//console.log('minValue: '+minValue+', maxValue: '+maxValue+', minInput: '+minInput+', maxInput: '+maxInput);

		if(minValue == (minInput || '')){
			//console.log('the min matches the current value of the min');
		}else{
			//console.log('no the min does not match');
		}
	});//end each range-input


	/*$('.ais-range-slider--handle-lower').each(function(){
		console.log('the aria-valuemax is ' + $(this).attr('aria-valuemax'));
		
		//check if min is modified
		if(($(this).attr('aria-valuemin')) == ($(this).attr('aria-valuenow'))){
			//the min hasn't been modified; has the max?
			if(($(this).next('.ais-range-slider--handle-upper').attr('aria-valuemax')) == ($(this).next('.ais-range-slider--handle-upper').attr('aria-valuenow'))){
				//the max hasn't been modified either
			}
		}
	});//end each lower handle*/

	$('#current-filters').text(selectedStates.join(', '));
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
}