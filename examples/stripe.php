<?php
require('config.inc.php');
// Uses sessions to test for duplicate submissions:
session_start();

?><!DOCTYPE html>
<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<title></title>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js" type="text/javascript" language="javascript"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
<script type="text/javascript" src="https://js.stripe.com/v2/"></script>
</head>
<body>
<div id="result"></div>
	<form  method="post">
		<fieldset>
			<input type="hidden" name="cmd" value="_cart" />
			<input type="hidden" name="add" value="1" />
			<input type="hidden" name="business" value="example@minicartjs.com" />
			<input type="hidden" name="item_name" value="Test Product" />
			<input type="hidden" name="quantity" value="1" />
			<input type="hidden" name="amount" value="1.00" />
			<input type="hidden" name="currency_code" value="USD" />
			<strong>Test Product</strong>
			<input type="submit" name="submit" value="Add to cart" />
		</fieldset>
	</form>

	<form method="post">
		<fieldset>
			<input type="hidden" name="cmd" value="_cart" />
			<input type="hidden" name="add" value="1" />
			<input type="hidden" name="business" value="labs-feedback-minicart@paypal.com" />
			<input type="hidden" name="item_name" value="Test Product 2" />
			<input type="hidden" name="quantity" value="1" />
			<input type="hidden" name="amount" value="1.00" />
			<input type="hidden" name="currency_code" value="USD" />
			<strong>Test Product 2</strong>
			<input type="submit" name="submit" value="Add to cart" />
		</fieldset>
	</form>




<?php


// Check for a form submission:
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

	// Stores errors:
	$errors = array();

	// Need a payment token:
	if (isset($_POST['stripeToken'])) {

		$token = $_POST['stripeToken'];

		// Check for a duplicate submission, just in case:
		// Uses sessions, you could use a cookie instead.
		if (isset($_SESSION['token']) && ($_SESSION['token'] == $token)) {
			$errors['token'] = 'You have apparently resubmitted the form. Please do not do that.';
		} else { // New submission.
			$_SESSION['token'] = $token;
		}

	} else {
		$errors['token'] = 'The order cannot be processed. Please make sure you have JavaScript enabled and try again.';
	}

	// Set the order amount somehow:
	$amount = 0; 
	if (isset($_POST['subTotal'])) {
	    $amount = intval($_POST['subTotal']) * 100; 
    }
	$currency_code = 'USD'; 
	if (isset($_POST['currency_code'])) {
	    $currency_code = $_POST['currency_code']; 
    }
	$email = 'cyuan123@live.com'; // $20, in cents

	// Validate other form data!

	// If no errors, process the order:
	if (empty($errors)) {

		// create the charge on Stripe's servers - this will charge the user's card
		try {

			// Include the Stripe library:
			// Assumes you've installed the Stripe PHP library using Composer!
			require_once('../vendor/autoload.php');

			// set your secret key: remember to change this to your live secret key in production
			// see your keys here https://manage.stripe.com/account
			\Stripe\Stripe::setApiKey(STRIPE_PRIVATE_KEY);

			// Charge the order:
			$charge = \Stripe\Charge::create(array(
				"amount" => $amount, // amount in cents, again
				"currency" => $currency_code,
				"source" => $token,
				"description" => $email
				)
			);

			// Check that it was paid:
			if ($charge->paid == true) {

                echo "Payment process successfully.";
				// Store the order in the database.
				// Send the email.
				// Celebrate!

			} else { // Charge was not paid!
				echo '<div class="alert alert-error"><h4>Payment System Error!</h4>Your payment could NOT be processed (i.e., you have not been charged) because the payment system rejected the transaction. You can try again or use another card.</div>';
			}

		} catch (\Stripe\Error\Card $e) {
		    // Card was declined.
			$e_json = $e->getJsonBody();
			$err = $e_json['error'];
			$errors['stripe'] = $err['message'];
		} catch (\Stripe\Error\ApiConnection $e) {
		    // Network problem, perhaps try again.
		} catch (\Stripe\Error\InvalidRequest $e) {
		    // You screwed up in your programming. Shouldn't happen!
		} catch (\Stripe\Error\Api $e) {
		    // Stripe's servers are down!
		} catch (\Stripe\Error\Base $e) {
		    // Something else that's not the customer's fault.
		}

	} // A user form submission error occurred, handled below.

} // Form submission.

// Set the Stripe key:
// Uses STRIPE_PUBLIC_KEY from the config file.
echo '<script type="text/javascript">Stripe.setPublishableKey("' . STRIPE_PUBLIC_KEY . '");</script>';
?>

		<?php // Show PHP errors, if they exist:
		if (isset($errors) && !empty($errors) && is_array($errors)) {
			echo '<div class="alert alert-error"><h4>Error!</h4>The following error(s) occurred:<ul>';
			foreach ($errors as $e) {
				echo "<li>$e</li>";
			}
			echo '</ul></div>';
		}?>


	<script src="../dist/minicart.js"></script>
	<script>
		paypal.minicart.render({
           action: 'buy.php'
        });

		paypal.minicart.cart.on('checkout', function (evt) {
			evt.preventDefault();
            paypal.minicart.myStripeToken.getStripeToken();
            //stripeToken.getStripeToken();
		});

	</script>
</body>
</html>
