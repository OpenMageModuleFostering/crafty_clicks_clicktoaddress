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
			var tmp_html = '<tr><td class="label">'+c2a_config.texts.search_label+'</td><td class="value">'+
				'<input id="'+magentoCfg.prefix+'_cc_search_input" class="input-text" type="text"/></td></tr>';
			magentoCfg.fields.street1_obj.up('tr').insert( {before: tmp_html} );
		}
		cc_search.attach({
			search: 	$(magentoCfg.prefix+'_cc_search_input'),
			line_1: 	magentoCfg.fields.street1_obj,
			line_2: 	magentoCfg.fields.street2_obj,
			town:		magentoCfg.fields.town_obj,
			company:	magentoCfg.fields.company_obj,
			postcode:	magentoCfg.fields.postcode_obj,
			county:		magentoCfg.fields.county_obj,
			country:	magentoCfg.fields.country_obj,
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
			country:	magentoCfg.fields.country_obj,
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
		defaultCountry: 'usa',
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

	if ($('address_list')) {
		// looks like we are on the customer edit page, check and attach to all existing address forms (there could be many!)
		var add_list = $$("#address_list > li");

		if (add_list && 0 < add_list.length) {
			var max_id = 0;
			for (var ii = 0; ii < add_list.length; ii++) {
				var item = add_list[ii];
				var item_id = '';
				var item_html_id = '';
				if ('address_item_' == item.id.substr(0,13)) {
					item_id = item.id.substr(13);
				} else if ('new_item' == item.id.substr(0,8)) {
					item_id = item.id.substr(8);
				}
				// old magento templates can have "idX", new ones have "_itemX", se we test for this here
				if ($('id'+item_id+'postcode')) {
					item_html_id = 'id'+item_id;
				} if ($('_item'+item_id+'postcode')) {
					item_html_id = '_item'+item_id;
				}

				if ('' != item_html_id) {
					var cc_tmp = cc_magento({
						prefix	: item_html_id,
						fields	: {
							postcode_obj: $(item_html_id+"postcode"),
							company_obj	: $(item_html_id+"company"),
							street1_obj	: $(item_html_id+"street0"),
							street2_obj	: $(item_html_id+"street1"),
							street3_obj	: $(item_html_id+"street2"),
							street4_obj	: $(item_html_id+"street3"),
							town_obj	: $(item_html_id+"city"),
							county_obj	: {
								input		: $(item_html_id+"region"),
								list		: $(item_html_id+"region_id")
							},
							country_obj	: $(item_html_id+"country_id")
						}
					});
				}

				if (item_id > max_id) max_id = item_id;
			}

			// check for magento bug in address numbering
			if (customerAddresses.itemCount <= max_id) customerAddresses.itemCount = max_id;
		}

		// make sure lookup is added when a new adress form is created....
		$('add_address_button').observe('click', function() {
			var item_html_id = '_item'+(customerAddresses.itemCount);
			cc_magento({
				prefix	: item_html_id,
				fields	: {
					postcode_obj: $(item_html_id+"postcode"),
					company_obj	: $(item_html_id+"company"),
					street1_obj	: $(item_html_id+"street0"),
					street2_obj	: $(item_html_id+"street1"),
					street3_obj	: $(item_html_id+"street2"),
					street4_obj	: $(item_html_id+"street3"),
					town_obj	: $(item_html_id+"city"),
					county_obj	: {
						input		: $(item_html_id+"region"),
						list		: $(item_html_id+"region_id")
					},
					country_obj	: $(item_html_id+"country_id")
				}
			});
		});
	} else {
		// probably on the new order page, check and attach
		_cp_check_and_attach();
	}
});

var _cp_last_billing_attachement = null;
var _cp_last_shipping_attachement = null;
var _cp_last_edit_attachement = null;
function _cp_check_and_attach() {
	if ($('order-billing_address_postcode') && _cp_last_billing_attachement != $('order-billing_address_postcode')) {
		_cp_last_billing_attachement = $('order-billing_address_postcode');
		var item_html_id = 'order-billing_address_';
		cc_magento({
			prefix	: item_html_id,
			fields	: {
				postcode_obj: $(item_html_id+"postcode"),
				company_obj	: $(item_html_id+"company"),
				street1_obj	: $(item_html_id+"street0"),
				street2_obj	: $(item_html_id+"street1"),
				street3_obj	: $(item_html_id+"street2"),
				street4_obj	: $(item_html_id+"street3"),
				town_obj	: $(item_html_id+"city"),
				county_obj	: {
					input		: $(item_html_id+"region"),
					list		: $(item_html_id+"region_id")
				},
				country_obj	: $(item_html_id+"country_id")
			}
		});
	}

	if ($('order-shipping_address_postcode') && !$('order-shipping_address_postcode').disabled && _cp_last_shipping_attachement != $('order-shipping_address_postcode')) {
		_cp_last_shipping_attachement = $('order-shipping_address_postcode');
		var item_html_id = 'order-shipping_address_';
		cc_magento({
			prefix	: item_html_id,
			fields	: {
				postcode_obj: $(item_html_id+"postcode"),
				company_obj	: $(item_html_id+"company"),
				street1_obj	: $(item_html_id+"street0"),
				street2_obj	: $(item_html_id+"street1"),
				street3_obj	: $(item_html_id+"street2"),
				street4_obj	: $(item_html_id+"street3"),
				town_obj	: $(item_html_id+"city"),
				county_obj	: {
					input		: $(item_html_id+"region"),
					list		: $(item_html_id+"region_id")
				},
				country_obj	: $(item_html_id+"country_id")
			}
		});
	}

	if ($('postcode') && !$('postcode').disabled && _cp_last_edit_attachement != $('postcode')) {
		_cp_last_edit_attachement = $('postcode');
		var item_html_id = '';
		cc_magento({
			prefix	: item_html_id,
			fields	: {
				postcode_obj: $(item_html_id+"postcode"),
				company_obj	: $(item_html_id+"company"),
				street1_obj	: $(item_html_id+"street0"),
				street2_obj	: $(item_html_id+"street1"),
				street3_obj	: $(item_html_id+"street2"),
				street4_obj	: $(item_html_id+"street3"),
				town_obj	: $(item_html_id+"city"),
				county_obj	: {
					input		: $(item_html_id+"region"),
					list		: $(item_html_id+"region_id")
				},
				country_obj	: $(item_html_id+"country_id")
			}
		});
	}
	window.setTimeout(function() { _cp_check_and_attach(); }, 500);
}

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
