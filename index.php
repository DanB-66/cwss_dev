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

		<p class="caveat">
			What's this then? It's strictly a WIP... <a href="#" onclick="$(this).hide().next('.more').show(); return false;">more</a> 
			<span class="more" style="display:none"> and it's early stages. Still reading? It uses <a href="json/cws_en.json">json</a> content files, <a href="js/main.js">js</a> (via a require.js <a href="js/app.js">stub</a>) to render that out into a carousel/paging system via a <a href="templates/_cws.tmpl.txt">dust template</a>, which is very simple so far (and as yet has zero css applied) but does demo conditional logic eg absent nodes in the data. <a href="sass/main_sass_eg.txt">Sass</a> helps (a lot...) with the styling. Native browser back/fwd will drive the UI and state is maintained cross-browser eg bookmarking retaining 'page', 'multiple' and 'lang' selections. Works in IE8. 3D transitions: just a start... There will be some sort of <a href="projects.php">non js</a> content rendered by <a href="modules/_project_list_seo.php.txt">php</a> from the same json. Completely incomplete!
			<a href="#" onclick="$(this).parent().hide().prev().show(); return false;">hide this</a></span>
		</p>

		<div class="cwsCarousel">
			<a href="projects.php">non js stuff...</a>
		</div>

	</div><!-- /#pageContent -->
</div><!-- /#pageWrapper -->

<?php include("includes/_footer_global.php"); ?>

<?php include("includes/_body_end_content.php"); ?>

</body>
</html>