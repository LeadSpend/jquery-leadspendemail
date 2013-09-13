// Set jQuery Validate to automatically ignore leadSpendEmail fields during onkeyup validation
(function( $ ){
	jQuery.validator.addMethod(
		"leadSpendEmail",
		function( emailValue, element ) {	// actual validation function.  Return true if valid.
			result = $( element ).siblings( ".leadSpendEmail-result" ).val();
			switch ( result ){
				case "illegitimate":
				case "unreachable":
				case "undeliverable":
				case "pending":	// email result has not yet been returned.
					return false;
				
				case "unknown":
				case "disposable":
				case "verified":
				case "error": // only enabled in debug mode
					return true;
			}
			return true; // always return a value, even if code is crazy
		},
		function( value, field ){	// function to determine error message
			result = $( field ).siblings( ".leadSpendEmail-result" ).val();
			switch ( result ){
				case "illegitimate":
				case "unreachable":
				case "undeliverable":
					return "Sorry, this email address appears to be " + result + ".";
				
				case "pending":
					return "Verifying email address...";
			}
			return "";
		} );
	$( document ).ready( function(){
		$( ".leadSpendEmail" ).closest( "form" ).validate();
	});
}( jQuery ) );