(function( $ ){
	var leadspendAPI = "https://primary.api.leadspend.com/v2/validity/";
	var timeout = 5;
	
	var jsonpValidateEmail = function( emailAddress ) {
		if (emailAddress){
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
		}
	}
	
	$.fn.leadSpendEmail = function() {
		emailAddress = this.val();
		
		this.on( "focusout", jsonpValidateEmail( emailAddress ) );

		return this;
	};
}( jQuery ));


$("#EMAIL_FIELD_ID").leadSpendEmail();
