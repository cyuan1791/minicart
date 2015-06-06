<?php
require('config.inc.php');
// Uses sessions to test for duplicate submissions:
session_start();

// to allow https ajax request
//On the HTTPS page (that you are requesting from the HTTP page) set the header:
//Access-Control-Allow-Origin: http://www.example.com
//You can do this in PHP with:
//
//header("Access-Control-Allow-Origin: _HOST_");

?><!DOCTYPE html>
<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<title></title>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js" type="text/javascript" language="javascript"></script>
<script type="text/javascript" src="https://js.stripe.com/v2/"></script>
</head>
<body>

// myresult are special tag used by myStripe.js to parse out result
// this file is for ajax request to communicate to stripe server to 
// process payment
<myresult>
<?php

#var_dump($_POST);
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

	$email = ''; 
	if (isset($_POST['business'])) {
	    $email = $_POST['business']; 
    }

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

                echo "Payment process was successfully.";
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

?>

		<?php // Show PHP errors, if they exist:
		if (isset($errors) && !empty($errors) && is_array($errors)) {
			echo '<div class="alert alert-error"><h4>Error!</h4>The following error(s) occurred:<ul>';
			foreach ($errors as $e) {
				echo "<li>$e</li>";
			}
			echo '</ul></div>';
		}?>

</myresult>
</body>
</html>
