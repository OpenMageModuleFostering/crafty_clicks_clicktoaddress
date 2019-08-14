/*
// This is a collection of JavaScript code to allow easy integration of
// the Crafty Clicks Click2Address functionality into Magento
//
// This file works for the standard magento checkout (both community and enterprise)
//
// Provided by www.CraftyClicks.co.uk
//
// Requires the new fancy Crafty Clicks Global JS library - Tested with 1.1.6
//
// If you copy/use/modify this code - please keep this
// comment header in place
//
// Copyright (c) 2009-2016 Crafty Clicks (http://www.craftyclicks.com)
//
// This code relies on prototype js, you must have a reasonably recent version loaded
// in your template. Magento should include it as standard.
//
// If you need any help, contact support@craftyclicks.co.uk - we will help!
//
**********************************************************************************/


var cc_search = null;
function cc_magento(magentoCfg){
	var li_class = 'advanced-col-xs-12 input-field';

	if (c2a_config.design.search_position == 1){
		if (!$(magentoCfg.prefix+'_cc_search_input')) {
			var tmp_html = '<div class="'+li_class+'">'
				+'<label>'+c2a_config.texts.search_label+'</label>'
				+'<div class="input-box"><input class="input-text" id="'+magentoCfg.prefix+'_cc_search_input" type="search"/></div>'
				+'</div>';
			magentoCfg.fields.line_1.up('.advanced-row').up('.input-field').insert( {before: tmp_html} );
		}
		cc_search.attach({
			search: 	$(magentoCfg.prefix+'_cc_search_input'),
			line_1: 	magentoCfg.fields.line_1,
			line_2: 	magentoCfg.fields.line_2,
			town:		magentoCfg.fields.town,
			company:	magentoCfg.fields.company,
			postcode:	magentoCfg.fields.postcode,
			county:		magentoCfg.fields.county,
			country:	magentoCfg.fields.country
		});
		cc_hide_fields(magentoCfg.fields);
	} else {
		cc_search.attach({
			search: 	magentoCfg.fields.line_1,
			line_1: 	magentoCfg.fields.line_1,
			line_2: 	magentoCfg.fields.line_2,
			town:		magentoCfg.fields.town,
			company:	magentoCfg.fields.company,
			postcode:	magentoCfg.fields.postcode,
			county:		magentoCfg.fields.county,
			country:	magentoCfg.fields.country
		});
		cc_hide_fields(magentoCfg.fields);
	}
}

function cc_hide_fields(dom, show){
	var show = show || false;
	if(!c2a_config.design.hide_address_fields){
		return;
	}
	var elementsToHide = ['line_1', 'line_2', 'town', 'postcode', 'county'];
	if(!c2a_config.advanced.lock_country_to_dropdown){
		elementsToHide.push('country');
	}
	var getParent = function(element){
		while(!element.up().hasClassName('advanced-form-style')){
			element = element.up();
		}
		return element;
	};

	if(!show){
		// check if there's anything in the input boxes
		var allEmpty = true;
		for(var i=0; i<elementsToHide.length - 2; i++){
			if(dom[elementsToHide[i]].value !== ''){
				allEmpty = false;
			}
		}
		if(!allEmpty){
			return;
		}

		for(var i=0; i<elementsToHide.length; i++){
			if(elementsToHide[i] == 'county'){
				getParent(dom[elementsToHide[i]].input).hide();
				getParent(dom[elementsToHide[i]].list).hide();
			} else {
				getParent(dom[elementsToHide[i]]).hide();
			}
		}
	} else {
		for(var i=0; i<elementsToHide.length; i++){
			if(elementsToHide[i] == 'county'){
				getParent(dom[elementsToHide[i]].input).show();
				getParent(dom[elementsToHide[i]].list).show();
			} else {
				getParent(dom[elementsToHide[i]]).show();
			}
		}
	}
}


document.observe('dom:loaded', function() {
	if (typeof c2a_config == 'undefined' || !c2a_config.active) return;

	var config = {
		accessToken: c2a_config.access_token,
		domMode: 'object',
		gfxMode: c2a_config.design.mode,
		style: {
			ambient: c2a_config.design.ambient,
			accent: c2a_config.design.accent
		},
		showLogo: false,
		texts: c2a_config.texts,
		getIpLocation: c2a_config.advanced.geocoding,
		onSetCounty: function(c2a, elements, county){
			var quickChange = function(elem){
				if(typeof elem != 'undefined' && elem !== null){
					elem.simulate('change');
				}
			};
			quickChange(elements.country);
			quickChange(elements.postcode);
			quickChange(elements.line_1);
			quickChange(elements.line_2);
			quickChange(elements.town);
			quickChange(elements.company);
			if(typeof elements.county.list != 'undefined' && elements.county.list !== null){
				c2a.setCounty(elements.county.list, county);
			}
			if(typeof elements.county.input != 'undefined' && elements.county.input !== null){
				c2a.setCounty(elements.county.input, county);
			}
		},
		onResultSelected: function(c2a, elements, results){
			cc_hide_fields(elements, true);
			// if can't find country, enforce country dropdown to match by iso_2
			if(typeof elements.country.down('option:selected') == 'undefined' || elements.country.down('option:selected').value == ''){
				elements.country.value = results.country.iso_3166_1_alpha_2;
			}
		},
		tag: 'Magento 1'
	};
	if(parseInt(c2a_config.texts.country_language) !== 0){
		switch(parseInt(c2a_config.texts.country_language)){
			case 1:
				config.countryLanguage = 'de';
				break;
		}
	}
	if(c2a_config.advanced.match_countries_to_magento){
		config.countryMatchWith = 'iso_2';
		config.enabledCountries = c2a_config.enabled_countries;
	}
	config.defaultCountry = c2a_config.default_country;
	if(c2a_config.advanced.lock_country_to_dropdown){
		config.countrySelector = false;
		config.onSearchFocus = function(c2a, dom){
			var currentCountry = dom.country.options[dom.country.selectedIndex].value;
			if(currentCountry !== ''){
				var countryCode = getCountryCode(c2a, currentCountry, 'iso_2');
				c2a.selectCountry(countryCode);
			}
		};
	}

	cc_search = new clickToAddress(config);

	if ($('billing:postcode')) {
		cc_magento({
			prefix: 'billing',
			fields: {
				postcode: $('billing:postcode'),
				company	: $('billing:company'),
				line_1	: $('billing:street1'),
				line_2	: $('billing:street2'),
				line_3	: $('billing:street3'),
				line_4	: $('billing:street4'),
				town	: $('billing:city'),
				county	: {
					input	: $('billing:region'),
					list	: $('billing:region_id')
				},
				country	: $('billing:country_id')
			}
		});
	}
	if ($('shipping:postcode')) {
		cc_magento({
			prefix	: 'shipping',
			fields	: {
				postcode	: $('shipping:postcode'),
				company		: $('shipping:company'),
				line_1		: $('shipping:street1'),
				line_2		: $('shipping:street2'),
				line_3		: $('shipping:street3'),
				line_4		: $('shipping:street4'),
				town		: $('shipping:city'),
				county		: {
					input		: $('shipping:region'),
					list		: $('shipping:region_id')
				},
				country		: $('shipping:country_id')
			}
		});
	}

	if ($('zip')) {
		cc_magento({
			prefix	: '',
			fields	: {
				postcode	: $('zip'),
				company		: $('company'),
				line_1		: $('street_1'),
				line_2		: $('street_2'),
				line_3		: $('street_3'),
				line_4		: $('street_4'),
				town		: $('city'),
				county		: {
					input		: $('region'),
					list		: $('region_id')
				},
				country		: $('country')
			}
		});
	}
});
/*
 * Protolicious
 * Extension to Prototype to add support to simulate JS events
 * https://github.com/kangax/protolicious
 * Protolicious is licensed under the terms of the MIT license
 */
 (function(){

   var eventMatchers = {
	 'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
	 'MouseEvents': /^(?:click|mouse(?:down|up|over|move|out))$/
 };
   var defaultOptions = {
	 pointerX: 0,
	 pointerY: 0,
	 button: 0,
	 ctrlKey: false,
	 altKey: false,
	 shiftKey: false,
	 metaKey: false,
	 bubbles: true,
	 cancelable: true
	};

   Event.simulate = function(element, eventName) {
	 var options = Object.extend(defaultOptions, arguments[2] || { });
	 var oEvent, eventType = null;

	 element = $(element);

	 for (var name in eventMatchers) {
	   if (eventMatchers[name].test(eventName)) { eventType = name; break; }
	 }

	 if (!eventType)
	   throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

	 if (document.createEvent) {
	   oEvent = document.createEvent(eventType);
	   if (eventType == 'HTMLEvents') {
		 oEvent.initEvent(eventName, options.bubbles, options.cancelable);
	   }
	   else {
		 oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
		   options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
		   options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
	   }
	   element.dispatchEvent(oEvent);
	 }
	 else {
	   options.clientX = options.pointerX;
	   options.clientY = options.pointerY;
	   oEvent = Object.extend(document.createEventObject(), options);
	   element.fireEvent('on' + eventName, oEvent);
	 }
	 return element;
 };

   Element.addMethods({ simulate: Event.simulate });
 })();
/* End of Protolicious */
