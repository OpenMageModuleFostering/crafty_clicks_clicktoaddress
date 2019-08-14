document.observe('dom:loaded', function() {
	if($($('c2a_global_design_dropdown_accent'))){
		$('c2a_global_design_dropdown_accent').setStyle({display:'none'});
		var colorpicker = '<div class="color-set"></div>';
		$('c2a_global_design_dropdown_accent').insert({after: colorpicker});
		var colors = {
			default:	'#63a2f1',
			red:		'#F44336',
			pink:		'#E91E63',
			purple:		'#9C27B0',
			deepPurple:	'#673ab7',
			indigo:		'#3f51b5',
			blue:		'#2196f3',
			lightBlue:	'#03a9f4',
			cyan:		'#00bcd4',
			teal:		'#009688',
			green:		'#4caf50',
			lightGreen:	'#8bc34a',
			lime:		'#cddc39',
			yellow:		'#ffeb3b',
			amber:		'#ffc107',
			orange:		'#ff9800',
			deepOrange:	'#ff5722',
			brown:		'#795548',
			grey:		'#9e9e9e',
			blueGrey:	'#607d8b'
		};
		var keys = Object.keys(colors);
		for(var i=0; i<keys.length; i++){
			$$('.color-set')[0].insert({bottom: '<div class="color-cube" data-value="'+keys[i]+'" style="background-color: '+colors[keys[i]]+'"></div>'})
		}
		$$('.color-set .color-cube').each(function(item){
			$(item).on('click', function(event){
				$('c2a_global_design_dropdown_accent').setValue(this.readAttribute('data-value'));
				$$('.color-set .color-cube').each(function(cube){ cube.removeClassName('active'); });
				this.addClassName('active');
			});
			if($(item).readAttribute('data-value') == $('c2a_global_design_dropdown_accent').getValue()){
				$(item).addClassName('active');
			}
		});
	}
});
