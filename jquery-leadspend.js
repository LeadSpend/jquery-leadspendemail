(function( $ ){
	var leadspendAPI = "https://primary.api.leadspend.com/v2/validity/";
	var timeout = 5;
	
	var jsonpValidateEmail = function() {
		console.log("jsonpValidateEmail called");
		console.log("email address was: "+emailAddress)
		/*if (emailAddress){
			$.getJSON( leadspendAPI + encodeURIComponent( emailAddress ) + "?timeout=" + timeout + "&callback=?", null, {
				emailAddress: emailAddress
			}).done( function(data, textStatus, jqXHR) {
				console.log( data );
				console.log( textStatus );
				console.log( jqXHR );
				console.log( emailAddress );
			}).fail(function( data ) {
				console.log("fail");
			});
		}*/
	}
	
	$.fn.leadSpendEmail = function() {
		console.log("leadSpendEmail init");
		
		this.on( "blur", jsonpValidateEmail() );

		return this;
	};
}( jQuery ));

$("#EMAIL_FIELD_ID").leadSpendEmail();