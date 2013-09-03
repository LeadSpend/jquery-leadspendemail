(function( $ ){
	var leadspendAPI = "https://primary.api.leadspend.com/v2/validity/";
	var timeout = 5;
		
	$.fn.leadspend = function() {
		console.log(this.val())
		
		/*$.getJSON( leadspendAPI + encodeURIComponent( emailAddress ) + "?timeout=" + timeout + "&callback=?", null, {
			emailAddress: emailAddress
		});
		.done( function(data, textStatus, jqXHR) {
			console.log( data );
			console.log( textStatus );
			console.log( jqXHR );
			console.log( emailAddress );
		}).fail(function( data ) {
			console.log("fail");
		});*/
		
		return this;
	};
}( jQuery ));