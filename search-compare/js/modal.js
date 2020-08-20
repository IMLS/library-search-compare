var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

// store the item that has focus before opening the modal window
var focusedElementBeforeModal;

$(document).ready(function() {
    jQuery('#expBtn').click(function(e) {
        showModal($('#modal'));
    });
    jQuery('#modalCloseBtn').click(function(e) {
        hideModal();
    });
    jQuery('#modal').keydown(function(event) {
        trapTabKey($(this), event);
    })
    jQuery('#modal').keydown(function(event) {
        trapEscapeKey($(this), event);
    })

    jQuery('#defBtn').click(function(e) {
        showFilterModal($('#filterModal'));
    });
    jQuery('#filterModalCloseBtn').click(function(e) {
        hideFilterModal();
    });
});

function trapEscapeKey(obj, evt) {

    // if escape pressed
    if (evt.which == 27) {

        // get list of all children elements in given object
        var o = obj.find('*');

        // get list of focusable items
        var cancelElement;
        cancelElement = o.filter("#modalCloseBtn")

        // close the modal window
        cancelElement.click();
        evt.preventDefault();
    }

}

function trapTabKey(obj, evt) {

    // if tab or shift-tab pressed
    if (evt.which == 9) {

        // get list of all children elements in given object
        var o = obj.find('*');

        // get list of focusable items
        var focusableItems;
        focusableItems = o.filter(focusableElementsString).filter(':visible')

        // get currently focused item
        var focusedItem;
        focusedItem = jQuery(':focus');

        // get the number of focusable items
        var numberOfFocusableItems;
        numberOfFocusableItems = focusableItems.length

        // get the index of the currently focused item
        var focusedItemIndex;
        focusedItemIndex = focusableItems.index(focusedItem);

        if (evt.shiftKey) {
            //back tab
            // if focused on first item and user preses back-tab, go to the last focusable item
            if (focusedItemIndex == 0) {
                focusableItems.get(numberOfFocusableItems - 1).focus();
                evt.preventDefault();
            }

        } else {
            //forward tab
            // if focused on the last item and user preses tab, go to the first focusable item
            if (focusedItemIndex == numberOfFocusableItems - 1) {
                focusableItems.get(0).focus();
                evt.preventDefault();
            }
        }
    }

}

function setInitialFocusModal(obj) {
    // get list of all children elements in given object
    var o = obj.find('*');

    // set focus to first focusable item
    var focusableItems;
    focusableItems = o.filter(focusableElementsString).filter(':visible').first().focus();

}

function setFocusToFirstItemInModal(obj){
    // get list of all children elements in given object
    var o = obj.find('*');

    // set the focus to the first keyboard focusable item
    o.filter(focusableElementsString).filter(':visible').first().focus();
}

function showModal(obj) {
    jQuery('header, main, footer').attr('aria-hidden', 'true'); // mark the main page as hidden
    jQuery('#modalOverlay').toggleClass('hidden'); // insert an overlay to prevent clicking and make a visual change to indicate the main apge is not available
    jQuery('#modal').toggleClass('hidden'); // make the modal window visible
    jQuery('#modal').attr('aria-hidden', 'false'); // mark the modal window as visible

    // attach a listener to redirect the tab to the modal window if the user somehow gets out of the modal window
    jQuery('body').on('focusin','header, main, footer',function() {
        setFocusToFirstItemInModal(jQuery('#modal'));
    })

    // save current focus
    focusedElementBeforeModal = jQuery(':focus');

    setFocusToFirstItemInModal(obj);

    //show appropriate definition list
    if($('#results').hasClass('open')){
        var whichCluster = $('#expBtn').attr('data-cluster');
        $('#exp-'+whichCluster).show();
    }//end check if it's the compare table
    
}

function hideModal() {
    jQuery('#modalOverlay').toggleClass('hidden'); // remove the overlay in order to make the main screen available again
    jQuery('#modal').toggleClass('hidden'); // hide the modal window
    jQuery('#modal').attr('aria-hidden', 'true'); // mark the modal window as hidden
    jQuery('header, main, footer').attr('aria-hidden', 'false'); // mark the main page as visible

    // remove the listener which redirects tab keys in the main content area to the modal
    jQuery('body').off('focusin','header, main, footer');

    // set focus back to element that had it before the modal was opened
    focusedElementBeforeModal.focus();

    //re-hide definition list
    $('.def-list').hide();
}

function showFilterModal(obj) {
    jQuery('header, main, footer').attr('aria-hidden', 'true'); // mark the main page as hidden
    jQuery('#filterModalOverlay').toggleClass('hidden'); // insert an overlay to prevent clicking and make a visual change to indicate the main apge is not available
    jQuery('#filterModal').toggleClass('hidden'); // make the filterModal window visible
    jQuery('#filterModal').attr('aria-hidden', 'false'); // mark the filterModal window as visible

    // attach a listener to redirect the tab to the filterModal window if the user somehow gets out of the filterModal window
    jQuery('body').on('focusin','header, main, footer',function() {
        setFocusToFirstItemInModal(jQuery('#filterModal'));
    })

    // save current focus
    focusedElementBeforeModal = jQuery(':focus');

    setFocusToFirstItemInModal(obj);

    $('#filterDefs').show();

    //show appropriate definition list
    /*
    if($('#results').hasClass('open')){
        var whichCluster = $('#defBtn').attr('data-cluster');
        $('#exp-'+whichCluster).show();
    }//end check if it's the compare table
    */
}

function hideFilterModal() {
    jQuery('#filterModalOverlay').toggleClass('hidden'); // remove the overlay in order to make the main screen available again
    jQuery('#filterModal').toggleClass('hidden'); // hide the modal window
    jQuery('#filterModal').attr('aria-hidden', 'true'); // mark the modal window as hidden
    jQuery('header, main, footer').attr('aria-hidden', 'false'); // mark the main page as visible

    // remove the listener which redirects tab keys in the main content area to the modal
    jQuery('body').off('focusin','header, main, footer');

    // set focus back to element that had it before the modal was opened
    focusedElementBeforeModal.focus();

    //re-hide definition list
    $('.filter-def-list').hide();
}
