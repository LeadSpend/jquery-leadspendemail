(function( $ ){
	$.fn.leadSpendEmail = function() {
		//console.log("leadSpendEmail init");
		
		this.on( "focusout", function(){alert("hello world");});

		return this;
	};
}( jQuery ));

$("#EMAIL_FIELD_ID").leadSpendEmail();