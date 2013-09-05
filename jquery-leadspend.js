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
        
		this.jsonpValidateEmail = function() {
			// CHECK FOR EXISTING .leadSpendEmail-result field with #EMAIL_FIELD_ID-RESULT ID
			// if !exists:
			// 		create it
			// elif val=pending
			// 		check email address being validated
			//		if same address
			//			return
			//		else
			//			continue
			
			emailAddress = $(this.element).val();
			var lsInstance = this; //define this as lsInstance to faciliate access within callback context
			
			if (emailAddress){
				$.getJSON( this.options.leadspendApi + encodeURIComponent( emailAddress ) + "?timeout=" + this.options.timeout + "&callback=?", null)
					.done( function(data, textStatus, jqXHR) {
						//console.log( data );			// json response
						//console.log( emailAddress );  // email address from jsonpValidateEmail function
						//console.log( lsInstance );	// instance of LeadSpendEmail object from jsonpValidateEmail function
					})
					.fail(function( data ) {
						console.log("fail");
					});
			}
		};

		
        this.init();
	};

	// Code to be called on LSE init
	LeadSpendEmail.prototype.init = function () {
		//var lsInstance = this;  //define this as lsInstance to faciliate access within callback context
		return $(this.element).on( "focusout", $.proxy(this.jsonpValidateEmail, this) );//function() { lsInstance.jsonpValidateEmail() } );
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
