/*!
 * LeadSpend Email Validation jQuery Plugin
 * jquery.leadspendemail-0.1.js
 * 
 * Original author: @this-sam, @leadspend
 * Licensed under the MIT license
 *
 * Requires jQuery
 */

;(function( $, window, document, undefined ){
	// Initialize defaults
	var pluginName = 'leadSpendEmail',
	defaults = {
		timeout: 5,
		resultInputSuffix: "-result",
		debug: false
	};
	
	// Constructor
	function LeadSpendEmail( element, options){
		this.element = element;
		this.resultElement = null;
		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		
		this.apiUrl = "https://secondary.api.leadspend.com/v2/validity/"
        
		// Actual jsonp call to the LeadSpend API
		this._jsonpValidateEmail = function( emailAddress ) {
			$.getJSON( this.apiUrl + encodeURIComponent( emailAddress ) + "?timeout=" + this.options.timeout + "&callback=?", null )
				.done( $.proxy(this._jsonpValidateEmailDone, this ) )
				.fail( $.proxy(this._jsonpValidateEmailFail, this ) );
		};
		
		// Called on completion of jsonp email validation call
		// (to be called using $.proxy for proper context)
		this._jsonpValidateEmailDone = function( data, textStatus, jqXHR ){
			if ( this.options.debug ){
				console.log( data );			// json response
			}
			
			this._setResultPending( false );
			$(this.resultElement).val( data.result );
		};
		
		// Called on fail of jsonp email validation call
		// (to be called using $.proxy for proper context)
		this._jsonpValidateEmailFail = function( jqXHR, textStatus, errorThrown ){
			if ( this.options.debug ){
				console.log( "LeadSpend API Call Failed.  Logging jqXHR, textStatus, and errorThrown:");
				console.log( jqXHR );
				console.log( textStatus );
				console.log( errorThrown );
			}
			
			this._setResultPending( false );
			$( this.resultElement ).val( "error" );
		};
		
		// Creates the resultElement, where the email result is stored and accessible for any validation front/back end
		this._createResultElement = function(){			
			// get element ID, and NAME
			elementID = $( this.element ).attr( "id" );
			elementName = $( this.element ).attr( "name" );
			
			// append options.suffix to each attr that is set and create the hidden input for the result
			if ( elementID ) {
				resultElementID = elementID + this.options.resultInputSuffix;
			} else {
				resultElementID = "";
			}
			
			if ( elementName ){
				resultElementName = elementName + this.options.resultInputSuffix;
			} else {
				resultElementName = "";
			}
			
			// Class attr will always be leadSpendEmail[+suffix]
			resultElementClass = "leadSpendEmail" + this.options.suffix;
			
			resultElementHtml = "<input class=\"" 	+ resultElementClass +
									   "\" id=\"" 	+ resultElementID +
									   "\" name=\"" + resultElementName + "\">";
								   
			this.resultElement = $( resultElementHtml );
			this.resultElement.hide();
			$( this.element ).after( this.resultElement );
		}
		
		// Set state of email input to pending
		this._setResultPending = function( resultPending ){
			if ( resultPending ){
				this.resultPending = true;
				$( this.resultElement ).val( "pending" );
			} else{
				this.resultPending = false;
			}
		};
		
		// Returns true if jsonp response has not been returned and false otherwise
		this._isResultPending = function(){
			return this.resultPending;
		};
		
		this._setResultAddress = function( emailAddress ){
			this.resultAddress = emailAddress;
		};
		
		this._getResultAddress = function(){
			return this.resultAddress;
		};
		
		// Main email validation function.  Bound to focusout event of input.
		this.validateEmailInput = function(){
			emailAddress = $( this.element ).val();
			
			// Email address must contain an '@' and a '.' and the '@' must come before the '.'
			// Conveniently, this also checks for a blank email address
			if ( emailAddress.indexOf("@") != -1 && 
				 emailAddress.indexOf(".") != -1 && 
				 emailAddress.indexOf("@") < emailAddress.lastIndexOf(".") ){
				
				// Check for hidden result element.  Create if necessary. 
				if ( !this.resultElement ){
					this._createResultElement();
				}
				
				// Now test the pending address.  As long as it is different from the currently pending address, continue.
				if ( emailAddress != this._getResultAddress() ){
					this._setResultPending( true );
					this._setResultAddress( emailAddress );
					this._jsonpValidateEmail( emailAddress );
				}
			}
		};
		
        this.init();
	};

	// Code to be called on plugin init
	LeadSpendEmail.prototype.init = function () {
		return $( this.element ).on( "focusout", $.proxy( this.validateEmailInput, this ) );
	};
	
	// Constructor wrapper, preventing against multiple instantiations
	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if ( !$.data( this, 'plugin_' + pluginName ) ) {
				$.data( this, 'plugin_' + pluginName, 
				new LeadSpendEmail( this, options ));
			} else if ( options ){
				$.data( this, 'plugin_' + pluginName ).options = $.extend( {}, $.data( this, 'plugin_' + pluginName ).options, options );
			}
		});
	}
}( jQuery, window, document ));

// Validate all leadSpendEmail fields by default
$( document ).ready( function(){
	$( ".leadSpendEmail" ).leadSpendEmail();
} );
