<?php 

    $title = "Code Workshop Systems Limited - Dev tests";
    
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

<div id="pageWrapper">
    <div id="pageContent">
<?php include("includes/_header_global.php"); ?>
        <h3>All placeholder, no styling and very much WIP :) Thx!</h3>
        <p>The following dl is rendered from <a href="json/cws.json">json</a> using <a href="js/project_list.js">js</a> via a <a href="templates/_cws.tmpl.html">dust template</a> (template compiled at browse time for now, in prod will be cacheable script. Note template logic for handling absent nodes.)</p>
        <p>Similar <a href="projects_php.php">non js content</a> can be rendered by <a href="modules/_project_list_seo.php.txt">php</a> from the same json.</p>
        <p>The beginning of a <a href="carousel.php">carousel</a> (still working on history manipulation!)</p>
        <hr>
        <div id="projects">

        </div>
    </div><!-- /#pageContent -->
<?php include("includes/_footer_global.php"); ?>
</div><!-- /#pageWrapper -->
<?php include("includes/_body_end_content.php"); ?>

    <script src="js/project_list.js"></script>

</body>
</html>