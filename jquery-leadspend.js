/*!
 * LeadSpend Email Validation jQuery Plugin
 * Original author: @this-sam, @leadspend
 * Licensed under the MIT license
 */

;(function( $, window, document, undefined ){
	//Initialize defaults
	var pluginName = 'LeadSpendEmail',
	defaults = {
		leadspendApi: "https://primary.api.leadspend.com/v2/validity/",
		timeout: 5
	};
	
	function LeadSpendEmail( element, options){
		this.element = element;
		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
        this._name = pluginName;
        
		// Actual jsonp call to the LeadSpend API
		this._jsonpValidateEmail = function( emailAddress ) {
			console.log( "_jsonpValidateEmail called" );
			
			if ( emailAddress ){
				$.getJSON( this.options.leadspendApi + encodeURIComponent( emailAddress ) + "?timeout=" + this.options.timeout + "&callback=?", null )
					.done( $.proxy(this._jsonpValidateEmailDone, this) )
					.fail(function( data ) {
						console.log( "fail" );
					});
			}
		};
		
		// Function to be called on completion of jsonp email validation call
		// Must be called using $.proxy for proper context
		this._jsonpValidateEmailDone = function( data, textStatus, jqXHR ){
			console.log( "_jsonpValidateEmailDone called" );
			console.log( data );			// json response
			console.log( emailAddress );  // email address from jsonpValidateEmail function
			console.log( this.element );	// instance of LeadSpendEmail object from jsonpValidateEmail function
		};
		
		// Function to be called on fail of jsonp email validation call
		this._jsonpValidateEmailFail = function(){
			
		};
		
		// 
		this.validateEmailInput = function(){
			console.log( "validateEmailInput called" );
			// CHECK FOR EXISTING .leadSpendEmail-result field with #EMAIL_FIELD_ID-RESULT ID
			// if !exists:
			// 		create it
			// elif val=pending
			// 		check email address being validated
			//		if same address
			//			return
			//		else
			//			continue
			
			emailAddress = $( this.element ).val();
			this._jsonpValidateEmail( emailAddress );
		};

		
        this.init();
	};

	// Code to be called on LSE init
	LeadSpendEmail.prototype.init = function () {
		return $(this.element).on( "focusout", $.proxy(this.validateEmailInput, this) ); // use jQuery.proxy to enforce proper context within callback
	};
	
	// A lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
	$.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new LeadSpendEmail( this, options ));
            }
        });
    }
}( jQuery, window, document ));

$(document).ready(function(){
	$(".leadSpendEmail").LeadSpendEmail();
});
