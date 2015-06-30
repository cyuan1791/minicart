// Created by Larry Ullman, www.larryullman.com, @LarryUllman
// Posted as part of the series "Processing Payments with Stripe"
// http://www.larryullman.com/series/processing-payments-with-stripe/
// Last updated April 14, 2015

// This page is intended to be stored in a public "js" directory.

// This function is just used to display error messages on the page.
// Assumes there's an element with an ID of "payment-errors".

var config = require('./config')

function  myStripe() {}

myStripe.prototype.reportMessage = function reportMessage(msg) {
	// Show the error in the form:
    //alert(msg);
	$('#payment-message').text(msg).addClass('alert alert-warning');
	return false;
};


myStripe.prototype.submit = function submit () {
		// Flag variable:
		var error = false;

		this.reportMessage('Payment processing. Please wait!');
		// Get the values:
		//var ccNum = $('.card-number').val(), cvcNum = $('.card-cvc').val(), expMonth = $('.card-expiry-month').val(), expYear = $('.card-expiry-year').val();
		var ccNum = $('.card-number').val().replace(/-|\s/g,""), cvcNum = $('.card-cvc').val().replace(/-|\s/g,""), expMonth = $('.card-expiry-month').val().replace(/-|\s/g,""), expYear = $('.card-expiry-year').val().replace(/-|\s/g,"");

		// Validate the number:
		if (!Stripe.card.validateCardNumber(ccNum)) {
			error = true;
			this.reportMessage('The credit card number appears to be invalid.');
		}

		// Validate the CVC:
		if (!Stripe.card.validateCVC(cvcNum)) {
			error = true;
			this.reportMessage('The CVC number appears to be invalid.');
		}

		// Validate the expiration:
		if (!Stripe.card.validateExpiry(expMonth, expYear)) {
			error = true;
			this.reportMessage('The expiration date appears to be invalid.');
		}
		if (config.userInfoRequired) {
        		if ($('#name').val() === "") {
				error = true;
				this.reportMessage('Please enter Name');
			}
        		if ($('#email').val() === "") {
				error = true;
				this.reportMessage('Please enter Email');
			}
		}
		if (config.userAddressRequired) {
        		if ($('#address_zip').val() === "") {
				error = true;
				this.reportMessage('Please enter zip');
			}
        		if ($('#address_state').val() === "") {
				error = true;
				this.reportMessage('Please enter state');
			}
        		if ($('#address_city').val() === "") {
				error = true;
				this.reportMessage('Please enter city');
			}
        		if ($('#address_line1').val() === "") {
				error = true;
				this.reportMessage('Please enter Address');
			}
		}

		// Validate other form elements, if needed!

		// Check for errors:
		if (!error) {

		$('#submitBtn').attr("disabled", "disabled");
            // remove form button
	        $('#payment-processing').text('');
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
myStripe.prototype.stripeResponseHandler =  function stripeResponseHandler(status, response) {

	// Check for an error:
	if (response.error) {

		this.reportMessage(response.error.message);

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
                //$("#minicart-close").click();
                // extract content between tag <myresult></myresult>
                // from ajax response and put into current page's
                // <div id="result> </div>
                //var text = data.match(/<myresult[^>]*>([^<]+)<\/myresult>/)[1];
                var startTag = data.indexOf('<myresult>');
                var endTag = data.indexOf('</myresult>');
                var text = data.substring(startTag + 10, endTag);
                //$("#result").html(text);
                //$(stripe.minicart.config.result).html(text);
		$('#payment-message').html(text + '<br /><span id="paymentDone" class="btn btn-info" style="text-align:center;">Done(Click Me)</span>').addClass('alert alert-danger');
		$('#paymentDone').click( function() {
                   stripe.minicart.reset();
		});
		//$('#payment-message').html(text).addClass('alert alert-danger');
                //stripe.minicart.reset();
            }
        });

        ev.preventDefault();
      });
   
      frm.submit();
   }

} // End of stripeResponseHandler() function.

myStripe.prototype.myfocus =  function myfocus(e) {
     // use by form input fields onfocusin event
     // Adjust input field to be 150px from absolute top
     // 
     if (this.mobilecheck()) {
	  // only mobile device need to adjust
          e = e || window.event;
          var top = $('#'+ e.target.id).offset().top;
          var ptop = $('#PPMiniCart').offset().top;
          var adjust = ptop - top + 150;
          $('#PPMiniCart').css('top', adjust  + 'px');
     }
}


myStripe.prototype.mobilecheck =  function mobilecheck() {
// check if this is a mobile device
var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = 
true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}


module.exports = myStripe
