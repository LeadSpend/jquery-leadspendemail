(function( $ ){
	var leadspendAPI = "https://primary.api.leadspend.com/v2/validity/";
	var timeout = 5;
	
	var jsonpValidateEmail = function( me ) {
		console.log("jsonpValidateEmail called.  Val is:");
		console.log(me.val())
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
	};
	
	$.fn.leadSpendEmail = function() {
		var me = this;
		this.on( "focusout", function(){ jsonpValidateEmail(me); });//jsonpValidateEmail() );

		return this;
	};
}( jQuery ));

