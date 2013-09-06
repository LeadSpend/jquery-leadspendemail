/*!
 * LeadSpend Email Validation jQuery Plugin
 * Original author: @this-sam, @leadspend
 * Licensed under the MIT license
 */

;(function( $, window, document, undefined ){
	// Initialize defaults
	var pluginName = 'LeadSpendEmail',
	defaults = {
		leadspendApi: "https://primary.api.leadspend.com/v2/validity/",
		timeout: 5,
		resultInputSuffix: "-result"
	};
	
	// Constructor
	function LeadSpendEmail( element, options){
		this.element = element;
		this.resultElement = null;
		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
        this._name = pluginName;
        
		// Actual jsonp call to the LeadSpend API
		this._jsonpValidateEmail = function( emailAddress ) {
			$.getJSON( this.options.leadspendApi + encodeURIComponent( emailAddress ) + "?timeout=" + this.options.timeout + "&callback=?", null )
				.done( $.proxy(this._jsonpValidateEmailDone, this ) )
				.fail( $.proxy(this._jsonpValidateEmailFail, this ) );
		};
		
		// Called on completion of jsonp email validation call
		// (to be called using $.proxy for proper context)
		this._jsonpValidateEmailDone = function( data, textStatus, jqXHR ){
			console.log( data );			// json response
			console.log( emailAddress );  	// email address from jsonpValidateEmail function
			
			this._setResultPending( false );
			$(this.resultElement).val( data.result );
		};
		
		// Called on fail of jsonp email validation call
		// (to be called using $.proxy for proper context)
		this._jsonpValidateEmailFail = function(){
			console.log( "_jsonpValidateEmailFail called :(" );
			this._setResultPending( false );
		};
		
		this._createResultElement = function(){
			//$( "#" + $( this.element ).attr( "id" ) + "-result").length == 0 ){	// TODO: extend to support elements without IDs --> need UUID or global counter?
			console.log( "_createResultElement called" );
			
			// get element ID, NAME, and CLASS
			elementID = $( this.element ).attr( "id" );
			console.log( "Element ID = " + elementID );
			elementClass = $( this.element ).attr( "class" );
			console.log( "Element class = " + elementClass );
			elementName = $( this.element ).attr( "name" );
			console.log( "Element name = " + elementName );
			
			// append options.suffix to each attr that is set and create the hidden input for the result
			
			if ( elementID ) {
				resultElementID = elementID + this.options.resultInputSuffix;
			} else {
				resultElementID = "";
			}
			
						
			if ( elementClass ) {
				resultElementClass = elementClass + this.options.resultInputSuffix;
			} else {
				resultElementClass = "";
			}
			
			if ( elementName ){
				resultElementName = elementName + this.options.resultInputSuffix;
			} else {
				resultElementName = "";
			}
			
			resultElementHtml = "<input class=\"" 	+ resultElementClass +
									   "\" id=\"" 	+ resultElementID +
									   "\" name=\"" + resultElementname + "\">";
			
			// Testing select pre insert.  Does it maintain reference?						   
			this.resultElement = $(resultElementHTML);
			$( this.element ).after( this.resultElement );
			console.log( "Finished creating resultElement " );
			console.log( this.element );
			console.log( this.resultElement );
			
			// Create the hidden result input to store validity result
			//$( this.element ).after( resultElementHtml );
			//
			// Store a reference to the hidden result imput
			//this.resultElement = $( "#" + resultElementID );  // TODO: test whether $(this.resultElement) is necessary, or if I can just do this.resultElement
			//console.log(this.resultElement);
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
			
			// TODO: Talk to Andrew about whether we want to do any validation in here.
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
		return $( this.element ).on( "focusout", $.proxy( this.validateEmailInput, this ) ); // Use jQuery.proxy to enforce proper context within callback
	};
	
	// Constructor wrapper, preventing against multiple instantiations
	$.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName, 
                new LeadSpendEmail( this, options ));
            }
        });
    }
}( jQuery, window, document ));

// Validate all leadSpendEmail fields by default
$( document ).ready( function(){
	$( ".leadSpendEmail" ).LeadSpendEmail();
} );
