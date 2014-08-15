requirejs.config({
	baseUrl: 'js/vendor',
	waitSeconds: 15,
	paths: {
		//'jquery': ['//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min', 'jquery-1.10.2.min'],
		//'history': ['//cdnjs.cloudflare.com/ajax/libs/history.js/1.8/bundled/html4+html5/jquery.history.min', 'jquery.history'],
		//'dust': ['//cdnjs.cloudflare.com/ajax/libs/dustjs-linkedin/2.2.2/dust-core.min', 'dust-core-2.2.2.min'],
		'jquery': 'jquery-1.10.2.min',
		'history': 'jquery.history',
		'touchSwipe': 'jquery.touchSwipe.min',
		'dust': 'dust-core-2.3.5.min',
		'dustTemplate1': '../../templates/_cws.tmplcompiled_v42'
	},
	shim: {
		'history': {
			deps: ['jquery'],
			exports: 'History'
		},
		'touchSwipe': {
			deps: ['jquery'],
			exports: 'swipe'
		},
		'dust': {
			exports: 'dust'
		},
		'dustTemplate1': {
			deps: ['dust']
		}
	}
});

// Load the main app module to start the app
requirejs(['../main']);