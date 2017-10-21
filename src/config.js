'use strict';


var mixin = require('./util/mixin');


var defaults = module.exports = {

    name: 'PPMiniCart',

    parent: (typeof document !== 'undefined') ? document.body : null,

    action: 'https://www.paypal.com/cgi-bin/webscr',

    target: '',

    duration: 30,

    template: '$TEMPLATE$',

    styles: '$STYLES$',

    userInfoRequired: 0,

    userAddressRequired: 0,

    strings: {
	email: 'Email',
	phone: 'Phone',
	name: 'Name',
	address: 'Addr',
	zip: 'Zip',
	country: 'Country',
	card: 'Card',
	expire: 'Expire',
	payment: 'Payment',
	shoppingCart: 'Shopping Cart',
        button: 'Check Out',
        subtotal: 'Subtotal:',
        discount: 'Discount:',
        invalidCarditCardNumber: 'The credit card number appears to be invalid.',
        invalidCVC: 'The CVC number appears to be invalid.',
        invalidExpireDate: 'The expiration date appears to be invalid.',
        paymentProcessing: 'Payment processing. Please wait!',
        pleaseEnter: 'Please enter ',
	doneMsg: 'Finished/Click Me',
        empty: 'Your shopping cart is empty'
    }

};


/**
 * Mixes in the user config with the default config.
 *
 * @param {object} userConfig Configuration overrides
 * @return {object}
 */
module.exports.load = function load(userConfig) {
    return mixin(defaults, userConfig);
};
