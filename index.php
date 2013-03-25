<?php 

	$title = "Code Workshop - Projects";
	
 ?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title><?php if(isset($title)) { echo $title; } else { echo "Code Workshop"; } ?></title>
	<meta name="description" content="Code Workshop">

<?php include("includes/_head_assets.php"); ?>

</head>
<body>

<div id="pageWrapper">
	<div id="pageContent">
<?php include("includes/_header_global.php"); ?>

		<p class="caveat">
			Under (slow) construction... keep getting hired! So this time round, I left photoshop and my sketchbooks in the bottom of the drawer and started with a <a href="json/cws.json">json</a> content file, then some <a href="js/project_carousel.js">js</a> to render that out via a <a href="templates/_cws.tmpl.html">dust template</a> into the beginnings of a carousel. <a href="sass/main_sass_eg.txt">Sass</a> helped to make a start on the styling. Currently finishing work on the history manipulation. There will eventually be some sort of <a href="projects_php.php">non js</a> seo content rendered by <a href="modules/_project_list_seo.php.txt">php</a> from the same json. Completely incomplete!
			<a href="#" onclick="$(this).parent().remove();">hide this</a>
		</p>

		<div class="cwsCarousel">
			<a href="projects_php.php">non js content...</a>
		</div>

	</div><!-- /#pageContent -->
</div><!-- /#pageWrapper -->

<?php include("includes/_footer_global.php"); ?>

<?php include("includes/_body_end_content.php"); ?>

	<script src="templates/_cws.tmplcompiled.js"></script>
	<script src="js/project_carousel.js"></script>

</body>
</html>