/*
// This is a collection of JavaScript code to allow easy integration of
// the Crafty Clicks Click2Address functionality into Magento
//
// This file works for the standard magento checkout (both community and enterprise)
//
// Provided by www.CraftyClicks.co.uk
//
// Requires the new fancy Crafty Clicks Global JS library - Tested with 0.1
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
	var li_class = 'wide';

	if (c2a_config.design.search_position == 1){
		if (!$(magentoCfg.prefix+'_cc_search_input')) {
			var tmp_html = '<li class="'+li_class+'"><label>'+c2a_config.texts.search_label+'</label><div class="input-box"><input id="'+magentoCfg.prefix+'_cc_search_input" type="text"/></div></li>';
			magentoCfg.fields.street1_obj.up('li').insert( {before: tmp_html} );
		}
		cc_search.attach({
			search: 	$(magentoCfg.prefix+'_cc_search_input'),
			line_1: 	magentoCfg.fields.street1_obj,
			line_2: 	magentoCfg.fields.street2_obj,
			town:		magentoCfg.fields.town_obj,
			company:	magentoCfg.fields.company_obj,
			postcode:	magentoCfg.fields.postcode_obj,
			county:		magentoCfg.fields.county_obj,
			country:	magentoCfg.fields.country_obj
		});
	} else {
		cc_search.attach({
			search: 	magentoCfg.fields.street1_obj,
			line_1: 	magentoCfg.fields.street1_obj,
			line_2: 	magentoCfg.fields.street2_obj,
			town:		magentoCfg.fields.town_obj,
			company:	magentoCfg.fields.company_obj,
			postcode:	magentoCfg.fields.postcode_obj,
			county:		magentoCfg.fields.county_obj,
			country:	magentoCfg.fields.country_obj
		});
	}
}


document.observe('dom:loaded', function() {
	if (typeof c2a_config == 'undefined' || !c2a_config.active) return;

	var config = {
		accessToken: c2a_config.access_token,
		domMode: 'object',
		geocode: false,
		gfxMode: c2a_config.design.mode,
		style: {
			ambient: c2a_config.design.ambient,
			accent: c2a_config.design.accent
		},
		showLogo: false,
		texts: c2a_config.texts,
		cssPath: false,
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
		tag: 'Magento 1'
	};
	if(parseInt(c2a_config.advanced.match_countries_to_magento) == 1){
		config.countryMatchWith = 'iso_2';
		config.enabledCountries = c2a_config.enabled_countries;
	}
	cc_search = new clickToAddress(config);

	if ($('billing:postcode')) {
		cc_magento({
			prefix: 'billing',
			fields: {
				postcode_obj: $('billing:postcode'),
				company_obj	: $('billing:company'),
				street1_obj	: $('billing:street1'),
				street2_obj	: $('billing:street2'),
				street3_obj	: $('billing:street3'),
				street4_obj	: $('billing:street4'),
				town_obj	: $('billing:city'),
				county_obj	: {
					input	: $('billing:region'),
					list	: $('billing:region_id')
				},
				country_obj	: $('billing:country_id')
			}
		});
	}
	if ($('shipping:postcode')) {
		cc_magento({
			prefix	: 'shipping',
			fields	: {
				postcode_obj	: $('shipping:postcode'),
				company_obj		: $('shipping:company'),
				street1_obj		: $('shipping:street1'),
				street2_obj		: $('shipping:street2'),
				street3_obj		: $('shipping:street3'),
				street4_obj		: $('shipping:street4'),
				town_obj		: $('shipping:city'),
				county_obj		: {
					input		: $('shipping:region'),
					list		: $('shipping:region_id')
				},
				country_obj		: $('shipping:country_id')
			}
		});
	}

	if ($('zip')) {
		cc_magento({
			prefix	: '',
			fields	: {
				postcode_obj	: $('zip'),
				company_obj		: $('company'),
				street1_obj		: $('street_1'),
				street2_obj		: $('street_2'),
				street3_obj		: $('street_3'),
				street4_obj		: $('street_4'),
				town_obj		: $('city'),
				county_obj		: {
					input		: $('region'),
					list		: $('region_id')
				},
				country_obj		: $('country')
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
   }
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
   }

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
   }

   Element.addMethods({ simulate: Event.simulate });
 })()
/* End of Protolicious */
