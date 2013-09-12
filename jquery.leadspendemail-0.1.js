/*!
 * LeadSpend Email Validation jQuery Plugin
 * jquery.leadspendemail-0.1.js
 * 
 * Original author: @this-sam, @leadspend
 * Kudos to: @jtnotat
 * Licensed under the MIT license
 *
 * Requires jQuery
 */

;(function( $, window, document, undefined ){
	// Initialize defaults
	var pluginName = 'leadSpendEmail',
	defaults = {
		timeout: 5,
		debug: false,
		delaySubmit: false, // note: true expects a well-formed form! (i.e. email input inside form element)
		resultCallback: null
	};
	
	// Constructor
	function LeadSpendEmail( element, options ){
		this.element = element;
		this.resultElement = null;
		this.options = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		
		this.apiUrl = "https://primary.api.leadspend.com/v2/validity/"
        
		// Actual jsonp call to the LeadSpend API
		this._jsonpValidateEmail = function( emailAddress ) {
			$.getJSON( this.apiUrl + encodeURIComponent( emailAddress ) + "?timeout=" + this.options.timeout + "&callback=?", null )
				.done( $.proxy( this._jsonpValidateEmailDone, this ) )
				.fail( $.proxy( this._jsonpValidateEmailFail, this ) );
		};
		
		// Called on completion of jsonp email validation call
		// (to be called using $.proxy for proper context)
		this._jsonpValidateEmailDone = function( data, textStatus, jqXHR ){
			if ( this.options.debug ){
				console.log( data );			// json response
			}
			
			this._setResultValue( data.result );
		};
		
		// Called on fail of jsonp email validation call
		// (to be called using $.proxy for proper context)
		this._jsonpValidateEmailFail = function( jqXHR, textStatus, errorThrown ){
			this._setResultPending( false );
			
			if ( this.options.debug ){
				console.log( "Leadspend API $getJSON().fail() called. Logging jqXHR, textStatus, and errorThrown:" );
				console.log( jqXHR );
				console.log( textStatus );
				console.log( errorThrown );
				this._setResultValue( "error" );
			} else {
				this._setResultValue( "unknown" );
			}
		};
		
		// Creates the resultElement, where the email result is stored and accessible for any validation front/back end
		this._createResultElement = function(){			
			// get element ID, and NAME
			elementID = $( this.element ).attr( "id" );
			elementName = $( this.element ).attr( "name" );
			
			resultInputSuffix = "-result";
			
			// append options.suffix to each attr that is set and create the hidden input for the result
			if ( elementID ) {
				resultElementID = elementID + resultInputSuffix;
			} else {
				resultElementID = "";
			}
			
			if ( elementName ){
				resultElementName = elementName + resultInputSuffix;
			} else {
				resultElementName = "";
			}
			
			// Class attr will always be leadSpendEmail[+suffix]
			resultElementClass = "leadSpendEmail" + resultInputSuffix;
			
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
				if ( this.options.delaySubmit ){
					this._bindDelaySubmit();
				}
			} else{
				this.resultPending = false;
				if ( this.options.delaySubmit ){
					this._handleDelaySubmit();
				}
			}
		};
		
		// Returns true if jsonp response has not been returned and false otherwise
		this._isResultPending = function(){
			return this.resultPending;
		};
		
		this._setResultAddress = function( emailAddress ){
			this.resultAddress = emailAddress;
		};
		
		// sets the value in the resultElement.  Eventually, provide a flag which sets these results to actionable vs. more detailed
		this._setResultValue = function( value ){
			// Only update value and trigger the change event if new value is different
			if ( $( this.resultElement ).val() != value ){
				if ( this.options.debug ) console.log( "Setting resultInput value to: " + value );
				
				// Set actual state of element
				$( this.resultElement ).val( value );
				
				// Update internal state to pending
				if ( value == "pending" ){
					this._setResultPending( true );
				} else {
					this._setResultPending( false );
				}
				
				// Trigger change event for external use/binding
				console.log( "setResultValue triggering change" );
				$( this.resultElement ).trigger( "change" );
				
				// call the resultCallback (if it has been set)
				if ( typeof( this.options.resultCallback ) != "undefined" ){
					console.log( "trying to execute resultCallback function" );
					this.options.resultCallback( this.element, this.resultElement );
				}
			}
		};
		
		// returns the email address associated with the current result
		this._getResultAddress = function(){
			return this.resultAddress;
		};
		
		// Binds the submit-delaying function to form submit
		this._bindDelaySubmit = function(){
			 console.log( "bindSubmit called" );
			 console.log( this.form );
			 $( this.form ).on( "submit", $.proxy( function(){
				console.log( "bindSubmit callback executing" );
				console.log( "setting submitPressed to true" )
				this.submitPressed = true;
				console.log( "submit blocked" );
				return false;   // block form submit
			}, this) );
		}
		
		this._handleDelaySubmit = function(){
			console.log( "handleSubmit entered" );
			console.log( "this.submitPressed = " + this.submitPressed.toString() );
			if ( this.submitPressed ){
				console.log( "handleSubmit executing" );
				this.submitPressed = false;
				$( this.element ).parent( "form" ).unbind( "submit" );
				console.log( "submit enabled" );
				$( this.element ).parent( "form" ).submit()
			}
		};
		
		// Main email validation function.  Bound to focusout event of input.
		this.validateEmailInput = function(){
			emailAddress = $( this.element ).val();
			
			// Email address must contain an '@' and a '.' and the '@' must come before the '.'
			// Conveniently also checks for a blank email address
			if ( emailAddress.indexOf( "@" ) != -1 && 
				 emailAddress.indexOf( "." ) != -1 && 
				 emailAddress.indexOf( "@" ) < emailAddress.lastIndexOf( "." ) ){
				
				// Now test the pending address.  As long as it is different from the currently pending address, continue.
				if ( emailAddress != this._getResultAddress() ){
					this._setResultValue( "pending" );
					this._setResultAddress( emailAddress );
					this._jsonpValidateEmail( emailAddress );
				}
			} else {
				this._setResultValue( "undeliverable" );
			}
		};
		
        this.init();
	};

	// Code to be called on plugin init
	LeadSpendEmail.prototype.init = function () {
		// Modify form and initialize option-based variables
		$( this.element ).addClass( "leadSpendEmail" );
		this._createResultElement();  	// create the hidden element where result codes will be stored
		
		if ( this.options.delaySubmit ){			
			this.submitPressed = false;	// for tracking form submit
			this.form = $( this.element ).parent( "form" ); // TODO: is this a strict enough selector?
		}
		
		$( this.element ).on( "focusout blur", $.proxy( this.validateEmailInput, this ) );  // TODO: also trigger on pressing enter	
		return this; 
	};
	
	// Constructor wrapper, preventing against multiple instantiations
	$.fn[pluginName] = function ( options ){
		return this.each(function () {
			if ( !$.data( this, 'plugin_' + pluginName ) ) {
				$.data( this, 'plugin_' + pluginName, 
				new LeadSpendEmail( this, options ));
			}
		});
	}
}( jQuery, window, document ) );

// Validate all leadSpendEmail fields by default
$( document ).ready( function(){
	$( ".leadSpendEmail-noconfig" ).leadSpendEmail();
} );
