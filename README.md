# Minicart.js

The goal of this project is to convert from paypal to stripe payment by integrating Larry Ullman's stripe blog sample.

1. http://minicartjs.com/ 
2. http://www.larryullman.com/series/processing-payments-with-stripe/

The minicart is a great way to improve your Stripe shopping cart integration. One simple change and your users will be able to manage their shopping cart directly from your website. Additional APIs provide you the power to customize the behavior to your needs.


1. [Basic Setup](#basic-setup)
2. [Advanced API](#advanced-api)
3. [API Examples](#api-examples)
4. [Customization](#customization)
5. [Localization](#localization)
6. [FAQ](#faq)



## Sample Setup

Currently, there is only one sample program on Apache, PHP environment.

1. Goto to https://www.stripe.com and sign up.
2. Find your public and private keys.
3. Clone the source and update keys in examples/config.inc.php.
4. Visit example/stripe.php

It's that simple! Now the minicart will appear when a user views or adds a product to their cart.

## Demo
   See http://s_stripe.webcmsnow.com/

## Advanced API

The minicart has a JavaScript API for advanced users to customize the behavior.


### General

`stripe.minicart.render(config)`
Renders the minicart to the page. Config is optional and can have the following properties:

 * `parent` - HTMLElement the minicart should render to.
 * `target` - HTML target property for the checkout form.
 * `template` - HTML template for rendering. See [customization](#customization) for details.
 * `styles` - CSS styles for rendering. See [customization](#customization) for details.
 * `strings` - An object of text strings: `button`, `buttonAlt`, `subtotal` and `discount`.
 * `userInfoRequired` - When set, user will require to enter name and email during checkout.
 * `userAddrssRequired` - When set, user will require to enter address during checkout.

`stripe.minicart.reset()`
Resets the minicart back to its default state.


### View

`stripe.minicart.view.show()`
Triggers the minicart to show by adding a "minicart-showing" CSS class to the document.

`stripe.minicart.view.hide()`
Triggers the minicart to hide by removing the "minicart-showing" CSS class on the document.

`stripe.minicart.view.toggle()`
Toggles the visibility of the minicart.

`stripe.minicart.view.bind(form)`
Binds an HTMLFormElement's submit event to the minicart. Useful for forms which may have been added to the page after the initial load.


### Cart

`stripe.minicart.cart.add(data)`
Adds an item to the cart. Fires the *add* event. Example data object:

    { "business": "user@example.com", "item_name": "Product", "amount": 5.00, "currency_code": "USD" }

`stripe.minicart.cart.remove(idx)`
Removes an item from the cart by index. Fires the *remove* event.

`stripe.minicart.cart.items(idx)`
Returns an array of items from the cart. If an index is passed then only that item is returned.

`stripe.minicart.cart.settings(key)`
Returns an object of global cart settings. If a key is passed then only that value is returned.

`stripe.minicart.cart.discount(config)`
Calculates the cart discount amount. *config* can be used for formatting.

`stripe.minicart.cart.subtotal(config)`
Calculates the cart total minus discounts. *config* can be used for formatting.

`stripe.minicart.cart.total(config)`
Calculates the cart total. *config* can be used for formatting.

`stripe.minicart.cart.destroy()`
Destroys the cart data and resets it back to the default state. Fires the *destroy* event.

`stripe.minicart.cart.on(event, fn, scope)`
Subscribe to cart events. Events include:
 * `add` - Fired when an item is added. *function (idx, product, isExisting)*
 * `remove` - Fired when an item is removed. *function (idx, product)*
 * `checkout` - Fired on checkout. *function (evt)*
 * `destroy` - Fired when the cart is destroyed. *function ()*

`stripe.minicart.cart.off(event, fn)`
Unsubscribe from cart events.


### Products

`product.get(key)`
Returns a properties object for the product. If a key is passed then only that value is returned.

`product.set(key, value)`
Sets a property for the product. Fires a *change* event.

`product.options()`
Returns the options.

`product.discount(config)`
Calculates the product discount. *config* can be used for formatting.

`product.amount(config)`
Calculates the product amount discounts. *config* can be used for formatting.

`product.total(config)`
Calculates the product total. *config* can be used for formatting.

`product.isEqual(product2)`
Determines if the current product is the same as another.

`product.destroy()`
Destroys the product. Fires the *destroy* event.

`product.on(event, fn, scope)`
Subscribe to cart events. Events include:
 * `change` - Fired when a value is changed. *function (key)*
 * `destroy` - Fired when the product is destroyed. *function ()*

`product.off(event, fn)`
Unsubscribe from product events.



## Customization

The minicart HTML template and CSS can be fully customized using two different approaches: configuration and custom themes. In both approaches, all functionality from the [API](#advanced-api) is available using [Embedded JavaScript Template](https://github.com/visionmedia/ejs) syntax.


### Configuration

The HTML template and CSS can be overridden using the *config* object.

```js
var myTemplate = "<div><%= config.strings.subtotal %> <%= cart.total({ format: true, showCode: true }) %></div>";

stripe.minicart.render({
    template: myTemplate
});
```

### Custom Themes

Custom themes can be created and bundled into your own custom version of the minicart.js file.

Before creating a custom theme you'll need to have [node.js](http://nodejs.org/) installed. Once install is complete, open a terminal window and run `npm install -g grunt-cli` to install Grunt.

To create a theme follow these steps:

1. [Fork and clone this repo](https://github.com/jeffharrell/minicart/fork) so you can make your own changes. If you're not sure what this means you can find out more on [Github's Help](https://help.github.com/articles/fork-a-repo).
2. In your new fork, create a  directory under `src/themes` with your theme name. For example, let's create `src/themes/myAwesomeTheme`.
3. Next add your HTML template into `src/themes/myAwesomeTheme/index.html`. The templates use [Embedded JavaScript Template](https://github.com/visionmedia/ejs) syntax for logic.
4. Finally add your CSS styles into `src/themes/myAwesomeTheme/styles.css`.
5. With all that behind you it's now time to generate your custom minicart JavaScript file. In a terminal window run `grunt build --theme=myAwesomeTheme`. This will output a bundled JavaScript file complete with the minicart and your new theme at `dist/minicart.myAwesomeTheme.js`.
6. Include this file into your HTML page instead of the normal JavaScript file and you'll see your new theme!

If you're new to the building a theme it's a good idea to copy the one at `src/themes/default` and start there.



## Localization

Localization is supported using the *strings* object.

```js
stripe.minicart.render({
    strings: {
        button: "Caisse",
        buttonAlt: "Total:",
        discount: "Reduction:"
    }
});
```

The currency symbol will be automatically updated based on the *currency_code* setting of your button.




## FAQ

### Is the minicart free? How is it licensed?
Yes, it's free and licensed under the [MIT License](https://github.com/jeffharrell/MiniCart/raw/master/LICENSE.md).

### Which browsers are supported?
The minicart supports Chrome, Safari, Firefox, and Internet Explorer 8+.

### I made a change and want to contribute it. Do you accept pull requests?
Yes, absolutely! Please submit a pull request on Github.

### Help, I found a bug!
Please submit the issue on the [issue tracker](https://github.com/jeffharrell/MiniCart/issues) including a link or sample code to reproduce it.

### The minicart isn't appearing the same as on this page. Why?
This can occur if your page is being rendered in [quirks mode](http://en.wikipedia.org/wiki/Quirks_mode). You can check for this issue, validate and correct your HTML using the [W3C Markup Validator](http://validator.w3.org/).




### Does the minicart work with frames?
Frames are not officially supported. You may be able to get some mileage with the *target* configuration setting.
