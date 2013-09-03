(function( $ ){
	$.fn.leadSpendEmail = function() {
		
		this.on( "focusout", function(){alert("hello world");});

		return this;
	};
}( jQuery ));

$("#EMAIL_FIELD_ID").leadSpendEmail();