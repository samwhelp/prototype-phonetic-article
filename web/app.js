


$(function(){
	Parser.getInstance()
		.setMouseOver(function(e){
			var target = $(this);
			var phonetic = target.data('phonetic')
			//console.log('phonetic: %s', phonetic);
			$('#phonetic_panel').html(phonetic);
		})
		.parse($('.phonetic-article').get(0))
		.run()
	;
});
