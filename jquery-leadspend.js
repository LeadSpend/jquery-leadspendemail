(function( $ ){
	var leadspendAPI = "https://primary.api.leadspend.com/v2/validity/";
	var timeout = 5;
	
	var jsonpValidateEmail = function( emailInput ) {
		console.log("jsonpValidateEmail called.  Email address val is:");
		console.log( emailInput.val() )
		emailAddress = emailInput.val();
		
		if (emailAddress){
			$.getJSON( leadspendAPI + encodeURIComponent( emailAddress ) + "?timeout=" + timeout + "&callback=?", null, {
				//emailAddress: emailAddress
			}).done( function(data, textStatus, jqXHR) {
				console.log( data );
				console.log( emailAddress );
				console.log( emailInput );
			}).fail(function( data ) {
				console.log("fail");
			});
		}
	};
	
	$.fn.leadSpendEmail = function() {
		var emailInput = this;
		this.on( "focusout", function(){ jsonpValidateEmail( emailInput ); });//jsonpValidateEmail() );

		return this;
	};
}( jQuery ));

