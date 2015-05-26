// Created by Larry Ullman, www.larryullman.com, @LarryUllman
// Posted as part of the series "Processing Payments with Stripe"
// http://www.larryullman.com/series/processing-payments-with-stripe/
// Last updated April 14, 2015

// This page is intended to be stored in a public "js" directory.

// This function is just used to display error messages on the page.
// Assumes there's an element with an ID of "payment-errors".

function  myStripeToken() {}

myStripeToken.prototype.reportError = function reportError(msg) {
	// Show the error in the form:
    //alert(msg);
	$('#payment-errors').text(msg).addClass('alert alert-error');
	return false;
};


myStripeToken.prototype.getStripeToken = function getStripeToken () {
		// Flag variable:
		var error = false;

	    $('#form-submit').text("Payment processing. Please wait!").addClass('alert alert-error');
		// Get the values:
		var ccNum = $('.card-number').val(), cvcNum = $('.card-cvc').val(), expMonth = $('.card-expiry-month').val(), expYear = $('.card-expiry-year').val();

		// Validate the number:
		if (!Stripe.card.validateCardNumber(ccNum)) {
			error = true;
			this.reportError('The credit card number appears to be invalid.');
		}

		// Validate the CVC:
		if (!Stripe.card.validateCVC(cvcNum)) {
			error = true;
			this.reportError('The CVC number appears to be invalid.');
		}

		// Validate the expiration:
		if (!Stripe.card.validateExpiry(expMonth, expYear)) {
			error = true;
			this.reportError('The expiration date appears to be invalid.');
		}

		// Validate other form elements, if needed!

		// Check for errors:
		if (!error) {

			// Get the Stripe token:
			Stripe.card.createToken({
				number: ccNum,
				cvc: cvcNum,
				exp_month: expMonth,
				exp_year: expYear
			}, this.stripeResponseHandler);

		}

},

// Function handles the Stripe response:
myStripeToken.prototype.stripeResponseHandler =  function stripeResponseHandler(status, response) {

	// Check for an error:
	if (response.error) {

		this.reportError(response.error.message);

	} else { // No errors, submit the form:


	  var frm = $("#payment-form");

	  // Token contains id, last4, and card type:
	  var token = response['id'];

	  // Insert the token into the form so it gets submitted to the server
	  frm.append("<input type='hidden' name='stripeToken' value='" + token + "' />");

	  // ajax Submit the form:
      // 
      frm.submit(function (ev) {
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: frm.serialize(),
            success: function (data) {
                // close the popup
                $("#minicart-close").click();
                // extract content between tag <myresult></myresult>
                // from ajax response and put into current page's
                // <div id="result> </div>
                //var text = data.match(/<myresult[^>]*>([^<]+)<\/myresult>/)[1];
                var startTag = data.indexOf('<myresult>');
                var endTag = data.indexOf('</myresult>');
                var text = data.substring(startTag + 10, endTag - 11);
                $("#result").html(text);
            }
        });

        ev.preventDefault();
      });
      frm.submit();
   }

} // End of stripeResponseHandler() function.

module.exports = myStripeToken
