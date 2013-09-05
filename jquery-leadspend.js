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
		this.options = $.extend( {}, defaults, options)
		this._defaults = defaults;
        this._name = pluginName;
        
		this.jsonpValidateEmail = function() {
			console.log( "THIS From LeadSpendEmail.jsonpValidateEmail call:" );
			console.log( this );
			console.log("jsonpValidateEmail called.  Email address val is:");
			console.log( $(this.element).val() )
			emailAddress = $(this.element).val();
			
			if (emailAddress){
				$.getJSON( this.options.leadspendApi + encodeURIComponent( emailAddress ) + "?timeout=" + this.options.timeout + "&callback=?", null
				).done( function(data, textStatus, jqXHR) {
					console.log( data );
					console.log( emailAddress );
					console.log( this );
				}).fail(function( data ) {
					console.log("fail");
				});
			}
		};

		
        this.init();
	};

	// Code to be called on LSE init
	LeadSpendEmail.prototype.init = function () {
		var lsInstance = this;
		return $(this.element).on( "focusout", function() { lsInstance.jsonpValidateEmail() } );
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
	$(".LeadSpendEmail").LeadSpendEmail();
});
