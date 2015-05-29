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
echo '<script type="text/javascript">Stripe.setPublishableKey("' . STRIPE_PUBLIC_KEY . '");</script>';
?>
	<script src="../dist/minicart.js"></script>
	<script>
		stripe.minicart.render({
           action: 'buy.php'
        });

		stripe.minicart.cart.on('checkout', function (evt) {
			evt.preventDefault();
        
            // stripe submit 
            // (1) gether credit cart info and send to stripe.com to get token            // (2) Insert token into form and submit the form (action)
            // (3) Form action will communicate to stripe.com and charge
            stripe.minicart.myStripe.submit();
		});

	</script>
</body>
</html>
