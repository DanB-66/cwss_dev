<?php 

    //$title = "Code Workshop Systems Limited";
    
 ?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title><?php if(isset($title)) { echo $title; } else { echo "Code Workshop Systems Limited"; } ?></title>
    <meta name="description" content="Code Workshop Systems Limited">
    
<?php include("includes/_head_assets.php"); ?>

</head>
<body>

<?php include("includes/_header_global.php"); ?>

<div id="pageWrapper">
    <div id="pageContent">
        <?php include("includes/_standard_content_template.php"); ?>
    </div><!-- /#pageContent -->
<?php include("includes/_footer_global.php"); ?>
</div><!-- /#pageWrapper -->
<?php include("includes/_body_end_content.php"); ?>

</body>
</html>