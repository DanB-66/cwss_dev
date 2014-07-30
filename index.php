<?php 
	$title = "Code Workshop - Projects";
 ?>
<!DOCTYPE html>
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

<!--
			DEV NOTES:
			What's this then? It's strictly a WIP...  
			...and it's early stages. Still reading? It uses *json/cws_en.json*  content files, *js/main.js* (via a require.js *js/app.js* stub) to render that out into a carousel/paging system via *templates/_cws.tmpl.js* dust templates, which are very simple so far but do demo conditional logic eg absent nodes in the data. *sass/screen_v42.scss* Sass helps (a lot...) with the styling. Native browser back/fwd will drive the UI and state is maintained cross-browser eg bookmarking retaining 'page', 'multiple' and 'lang' selections. Works in IE8. 3D transitions: just a start... There will be some sort of *projects.php* non js content rendered by php from the same json. Completely incomplete!
-->

		<div class="carouselWrap">
			<a href="projects.php">sitemap...</a>
		</div>

	</div><!-- /#pageContent -->
</div><!-- /#pageWrapper -->

<?php include("includes/_footer_global.php"); ?>

<?php include("includes/_body_end_content.php"); ?>

</body>
</html>