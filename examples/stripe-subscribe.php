<?php
require('config.inc.php');
// Uses sessions to test for duplicate submissions:
session_start();
require_once('../vendor/autoload.php');

?><!DOCTYPE html>
<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<title></title>
</head>
<body>
<?php
\Stripe\Stripe::setApiKey(STRIPE_PRIVATE_KEY);
?>
<form action="buy-subscribe.php" method="POST">
    <input type="hidden" name="stripePlan" value="monthly" />
    <script
      src="https://checkout.stripe.com/checkout.js" class="stripe-button"
      data-key="<?php echo STRIPE_PUBLIC_KEY; ?>"
      data-description="Monthly $10 Plan"
      data-name="www.webcmsnow.com"
      data-label="Monthly $10 Plan">
    </script>
  </form>
</body>
</html>
