'use strict';


var Cart = require('./cart'),
    View = require('./view'),
    config = require('./config'),
    myStripe= require('./myStripe'),
    minicart = {},
    cartModel,
    confModel,
    viewModel;


/**
 * Renders the Mini Cart to the page's DOM.
 *
 * @param {object} userConfig Configuration overrides
 */
minicart.render = function (userConfig) {
    confModel = minicart.config = config.load(userConfig);
    cartModel = minicart.cart = new Cart(confModel.name, confModel.duration);
    minicart.myStripe= new myStripe();
    viewModel = minicart.view = new View({
        config: confModel,
        cart: cartModel
    });

    cartModel.on('add', viewModel.addItem, viewModel);
    cartModel.on('change', viewModel.changeItem, viewModel);
    cartModel.on('remove', viewModel.removeItem, viewModel);
    cartModel.on('destroy', viewModel.hide, viewModel);
};


/**
 * Resets the Mini Cart and its view model
 */
minicart.reset = function () {
    cartModel.destroy();

    viewModel.hide();
    viewModel.redraw();
};




// Export to either node or the brower window
if (typeof window === 'undefined') {
    module.exports = minicart;
} else {
    if (!window.stripe) {
        window.stripe = {};
    }

    window.stripe.minicart = minicart;
}
function myfocus(e) {
          if (window.mobilecheck()) {
          e = e || window.event;
          //var target = e.target || e.srcElement;
          //console.log(target.id);
          //console.log(e);
          var top = $('#'+ e.target.id).offset().top;
          var ptop = $('#PPMiniCart').offset().top;
          var adjust = ptop - top + 100;
          //console.log(top);
          //console.log(ptop);
          $('#PPMiniCart').css('top', adjust  + 'px');

          //console.log($('#name').offset());
          //$('#PPMiniCart').css('top','-10px');
          //console.log(e);
          //var offset = $(this).offset();
          //var relativeX = (e.pageX - offset.left);
          //var relativeY = (e.pageY - offset.top);

          //console.log("X: " + relativeX + "  Y: " + relativeY);
          }
}
