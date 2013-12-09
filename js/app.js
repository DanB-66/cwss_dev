requirejs.config({
	'baseUrl': 'js/',
	'paths': {
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
		'history': '//cdnjs.cloudflare.com/ajax/libs/history.js/1.8/bundled/html4+html5/jquery.history.min',
		'dust': '//cdnjs.cloudflare.com/ajax/libs/dustjs-linkedin/1.2.3/dust-core.min',
		'dustTemplate1': '../templates/_cws.tmplcompiled_v42'
	}
});

requirejs(["main"]);