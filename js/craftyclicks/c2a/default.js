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

	if (!$(magentoCfg.prefix+'_cc_search_input')) {
		var tmp_html = '<li class="'+li_class+'"><label>Address Search</label><div class="input-box"><input id="'+magentoCfg.prefix+'_cc_search_input" type="text"/></div></li>';
		magentoCfg.fields.street1_obj.up('li').insert( {before: tmp_html} );
	}
	cc_search.attach({
		search: 	$(magentoCfg.prefix+'_cc_search_input'),
		line_1: 	magentoCfg.fields.street1_obj,
		line_2: 	magentoCfg.fields.street2_obj,
		town:		magentoCfg.fields.town_obj,
		company:	magentoCfg.fields.company_obj,
		postcode:	magentoCfg.fields.postcode_obj,
		county:		magentoCfg.fields.county_obj
	});
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
		texts: {
			default_placeholder: 'Typo here where you wanna go'
		},
		cssPath: false
		/*
		onResultSelected: function(address){
			console.log(address);
			var address_data = {
				line_1: address.line_1,
				line_2: address.line_2,
				town:	address.locality,
				postal_code: address.postal_code
			};
			new Ajax.Request(c2a_config.cc_hash_url,{
				method:		"post",
				postBody:	JSON.stringify(address_data),
				onSuccess:	function(transport){
					console.log(transport);
					var response = transport.responseText || "no response text";
					alert("Success! \n\n" + response);
				},
				onFailure:	function(){ alert('Something went wrong...') }
			});
		}*/
	};
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
				county_obj	: $('billing:region'),
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
				county_obj		: $('shipping:region'),
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
				county_obj		: $('region'),
				country_obj		: $('country')
			}
		});
	}
});
