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
			What's this? Its a WIP... so far it's mostly javascsript with not much work on the visual side... and the data is a bit rough! Still reading? It uses <a href="json/cws_en.json">json</a> content files, <a href="js/project_carousel_v42.js">js</a> to render that out into a carousel/paging system via a <a href="templates/_cws.tmpl.txt">dust template</a>, which is pretty simple so far but does demo conditional logic eg absent nodes in the data. <a href="sass/main_sass_eg.txt">Sass</a> helps (a lot...) with the styling. Native browser back/fwd will drive the UI and state is maintained cross-browser eg bookmarking retaining 'page', 'multiple' and 'lang' selections. Works in IE8. 3D transitions: just a start ;) There will be some sort of <a href="projects_php.php">non js</a> content rendered by <a href="modules/_project_list_seo.php.txt">php</a> from the same json. Completely incomplete!
			<a href="#" onclick="$(this).parent().slideUp(); return false;">hide this</a>
		</p>

		<div class="cwsCarousel">
			<a href="projects_php.php">non js content...</a>
		</div>

	</div><!-- /#pageContent -->
</div><!-- /#pageWrapper -->

<?php include("includes/_footer_global.php"); ?>

<?php include("includes/_body_end_content.php"); ?>
<script src="templates/_cws.tmplcompiled_v42.js"></script>
<script src="js/project_carousel_v42.js?"></script>

</body>
</html>