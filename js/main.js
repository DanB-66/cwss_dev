/*global swipe:true, dust:true, History:true, Modernizr:true */

require(['jquery', 'history', 'touchSwipe', 'dust', 'dustTemplate1'], function ($) {

'use strict';

	var CwsC = {
	
		multiple : 3,//default 3, no of items per carousel page
		lang : 'en',//default en
		carouselContent : '',// data
		carouselUiContent : '',// ui label data
		carouselContainer : '',
		carouselContentLength : '',
		contentIndex : '',//index of the last shown project item in a page
		bHasCssTransforms : false,// test with modernizer
		History : window.History,//history lib in use
		pageTitle : document.title,
		startItem: '',
		currentPage: '',
		newMultiple: '',
		langChangedByUI: false,
		newDirection: '',
		introShow: true,
		newIntroShow: undefined,
		actionIntro: false,//this var redundant?
		isTransitioning: false,

		pushPageState : function(direction, index, newLang, newMultiple, newIntroShow){
			console.log('OOO pushPageState input vals: - direction: '+direction+', index: '+index+', newLang: '+newLang+', newMultiple: '+newMultiple+', newIntroShow: '+newIntroShow);

			if (newMultiple !== undefined) {
				this.multiple = newMultiple;
			}
			if (index !== undefined){
				this.contentIndex = index;
			}
			if (newLang !== undefined) {
				this.lang = newLang;
			}
			if (newIntroShow !== undefined){
				this.introShow = newIntroShow;
			}
			if (direction === 'forward'){
				this.contentIndex += this.multiple;
			}
			if (direction === 'back'){
				this.contentIndex -= this.multiple;
			}
			this.currentPage = this.contentIndex/this.multiple;

			console.log('PUSH STATE: content index- '+this.contentIndex +'- page title' + this.pageTitle + ' page=' + this.currentPage + ' multiple=' + this.multiple + ' lang=' + this.lang + ' intro=' + this.introShow);
			this.History.pushState({state: this.contentIndex,
										rand: Math.random(),
										direction: direction,
										lang: this.lang,
										multiple: this.multiple,
										introShow: this.introShow},
									this.pageTitle + ' - Page ' + this.currentPage,
									'?page=' + this.currentPage + '+multiple=' + this.multiple + '+lang=' + this.lang + '+intro=' + this.introShow);
			
		},

		buildControls : function(){// build the controls and intro with lang
			var output;
			dust.render("cwsUI", this.carouselContent, function(err, out) {//'cwsUI' is a compiled dust template already registered. Its loaded by requirejs
				if(err !== null){
					alert("dust ui templ error: " + err);
				}
				output = out;
			});
			return output;
		},


		buildUI : function() {// build ui on load. Bind ui btns, swipe and statechange event
			var renderTarget = $('.carouselWrap');//elem to create it inside

			renderTarget.html(this.buildControls());
			this.carouselContainer = renderTarget.children('.carousel');
			this.carouselContainer.addClass('multiple'+CwsC.multiple);
			renderTarget.on('click','.cwsCprev, .cwsCnext', function(event) {
				if(CwsC.isTransitioning){
					return false;
				} else {
					if (!$(this).hasClass('disabled')){
						var direction = 'forward';
						if ($(this).hasClass('cwsCprev')){
							direction = 'back';
						}
						CwsC.transitionContent(direction);
					}
				}
				event.preventDefault();
			});

			// delegate click on 'set multiple' control
			renderTarget.on('click', '#setMultipleControl button', function() {
				var currMultiple = $(this).parent().index()+1;
				if(currMultiple !== CwsC.multiple){
					CwsC.setMultiple(currMultiple);
					CwsC.newDirection = undefined;
				}
			});
			
			// delegate click on 'set lang' control
			renderTarget.on('click', '#setLangControl li', function() {
				var currId = $(this).attr('id');
				if(currId !== CwsC.lang){
					CwsC.setLang(currId);
				}
			});

			// delegate click on 'home/intro/contact' overlay close
			renderTarget.on('click', '#intro > .hide', function(event) {
				CwsC.introShow = false;
				CwsC.actionIntro = true;
				CwsC.pushPageState(undefined, undefined, undefined, undefined, CwsC.introShow);
				event.preventDefault();
			});

			// delegate click on 'home/intro/contact' overlay open
			renderTarget.on('click', '#toggleIntro', function() {
				CwsC.introShow = true;
				CwsC.actionIntro = true;
				$('#intro').removeClass('noTransition');
				CwsC.pushPageState(undefined, undefined, undefined, undefined, CwsC.introShow);
			});

			if (Modernizr.touch){// activate touchSwipe
				this.swipeListener();
			}

			/* STATECHANGE BINDING */
			History.Adapter.bind(window,'statechange', function() {// ie both browser back/fwd btn and app ui btns and initial load - all logic to manipulate page should be here
				var State = History.getState();
				console.log('STATECHANGE event, state info: ' + State.data.state + ' direction: ' + State.data.direction + ' mult: ' + State.data.multiple+ ' lang: ' + State.data.lang+ ' intro: ' + State.data.introShow);
				
				//fix Object.keys for ie8 - http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
				Object.keys = Object.keys || (function () {
					var hasOwnPropertyFlag = Object.prototype.hasOwnProperty,
						hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
						DontEnums = [
							'toString',
							'toLocaleString',
							'valueOf',
							'hasOwnProperty',
							'isPrototypeOf',
							'propertyIsEnumerable',
							'constructor'
						],
						DontEnumsLength = DontEnums.length;
					return function (o) {
						if (typeof o != "object" && typeof o != "function" || o === null)
							throw new TypeError("Object.keys called on a non-object");
						var result = [];
						for (var name in o) {
							if (hasOwnPropertyFlag.call(o, name))
								result.push(name);
						}
						if (hasDontEnumBug) {
							for (var i = 0; i < DontEnumsLength; i++) {
								if (hasOwnPropertyFlag.call(o, DontEnums[i]))
									result.push(DontEnums[i]);
							}
						}
						return result;
					};
				})();
				//end Object.keys fix

				if (Object.keys(State.data).length !== 0) {
					if (State.data.direction !== CwsC.newDirection) {
						CwsC.newDirection = State.data.direction;
					}
					if (State.data.introShow !== CwsC.introShow) {// back pressed after toggle intro or value in pasted url
						if (State.data.introShow !== true){//only when back btn from intro after lang change
							$('#intro').addClass('hidden');
							$('#controls').addClass('shown');
						} else { // back btn from intro without lang change
							$('#intro').removeClass('noTransition hidden');
							$('#controls').addClass('noTransition shown');
						}
						CwsC.introShow = State.data.introShow;
						return;
					}
					if (CwsC.introShow !== true && CwsC.actionIntro !== true){//when refresh page
						//alert('dingggg');
						//$('#intro').addClass('noTransition');
						//$('#controls').addClass('noTransition');
					}
					if (CwsC.introShow !== true){
						$('#intro').addClass('hidden');
						$('#controls').addClass('shown');
					} else {
						$('#intro').removeClass('hidden');
						$('#controls').removeClass('shown');
					}

					if(CwsC.actionIntro === true){
						CwsC.actionIntro = false;
						return;
					}

					if (State.data.state !== CwsC.contentIndex) {// back button pressed, go to previous page
						console.log('back button pressed, go to previous page. cont index= '+CwsC.contentIndex+ 'state = '+State.data.state+' direction: '+State.data.direction);
						
						if(State.data.state < CwsC.contentIndex){// back buttn pressed, determine which direction to restore
							CwsC.newDirection = 'back';
						} else if (State.data.state > CwsC.contentIndex){
							CwsC.newDirection = 'forward';
						}
						console.log('CwsC.newDirection= '+CwsC.newDirection);
						if (State.data.multiple === CwsC.multiple) {// back button NOT pressed, ie from ui
							CwsC.transitionContent(CwsC.newDirection, true);
						}
						
						CwsC.contentIndex = State.data.state; //set so correct state from history when fade below
					}

					CwsC.carouselContainer.fadeTo(500, 0, function() {
						console.log('F@de.......................CwsC.lang:'+ CwsC.lang+' State.data.lang: '+State.data.lang);
						if(CwsC.langChangedByUI !== false){// change lang via ui btns
							console.log('changed lang');
							CwsC.loadData(1);
							CwsC.langChangedByUI = false;
						}
						else if (State.data.lang !== CwsC.lang) {// back button pressed, go to previous lang
							console.log('lang2 change ??back?');
							CwsC.newDirection = undefined;
							CwsC.lang = State.data.lang;
							CwsC.loadData(1);
						} else if (State.data.multiple !== CwsC.multiple) {// back button pressed, go to previous multiple
							CwsC.newDirection = undefined;
							CwsC.multiple = State.data.multiple;
							CwsC.renderItems(false);
						} else {// all other renders. ie: normal load and ui btns AND back l/r states driven by history
							CwsC.renderItems(false);
						}
					});

				} else {
					history.back();//no State.data left, so do NORMAL history back to prev location (note lowercase h)
				}

			});

			this.pushPageState(undefined, CwsC.startItem, undefined, undefined, CwsC.introShow);//show first set on load, potentially based on referrer
			this.markLang(this.lang);// mark on page initial load

		},

		loadData : function(bIsRebuild) {// load json - todo use beforeSend to set spinner
			$.ajax({
				url: 'json/cws_'+CwsC.lang+'.json',
				dataType: 'json',
				cache: false,
				success: function(data) {
					CwsC.carouselContent = data.cwsData;//data
					CwsC.carouselUiContent = data.cwsData.i18n;//ui labels data
					CwsC.carouselContentLength = CwsC.carouselContent.projects.length;// length of the projects data 
					if (!bIsRebuild){
						CwsC.buildUI();
					} else {
						CwsC.renderItems(true);
					}
				},
				error: function() {
					alert('json failed to load...');
				}
			});
		},

		renderItems : function(refreshLang) {
			var projData, uiData, mergedJson,
				carouselBuffer = '',
				incrementBuffer = function(err, output){
					if(err !== null){
						alert("dust error proj templ: " + err);
					}
					carouselBuffer += output;
				};

			if (refreshLang === true){
				//rebuild controls with new lang  after lang change
				console.log('rebuild controls with new lang ');
				//alert('CwsC.introShow : '+CwsC.introShow);
				var buffer = $(CwsC.buildControls());
				$('#intro').replaceWith(buffer.slice(0,1));
				$('#controls').replaceWith(buffer.slice(1,2));
				if(CwsC.introShow !== true){
					$('#intro').addClass('noTransition hidden');//remove hidden and prevent transitions
					//$('#intro').removeClass('noTransition');
					$('#controls').addClass('shown');
				} else {
					alert('never?'+CwsC.introShow);//?????????????????????????????????????????????????????????????????????????????????
					//$('#intro').addClass('hidden');//and add hidden if req
					//$('#controls').addClass('shown');
				}

				buffer = '';
				CwsC.markLang(CwsC.lang);
			} 

			CwsC.carouselContainer.empty().removeClass('multiple1 multiple2 multiple3 multiple4').addClass('multiple'+CwsC.multiple);//cant remove fwd-back classes here as they will animate
			CwsC.markMultiple(CwsC.multiple);

			//reduce CwsC.contentIndex by multiple and iterate dust
			CwsC.contentIndex = CwsC.contentIndex - CwsC.multiple;
			for (var i=0; i < CwsC.multiple; i++) {
				projData = CwsC.carouselContent.projects[CwsC.contentIndex];
				uiData = CwsC.carouselUiContent;
				mergedJson = dust.makeBase(uiData);
				mergedJson = mergedJson.push(projData);
				if (CwsC.contentIndex < CwsC.carouselContentLength) {
					dust.render('cwsProjects', mergedJson, incrementBuffer);//'cwsProjects' is a compiled dust template already registered. Its loaded by requirejs
				}
				CwsC.contentIndex++;
			}

			var transitionInClass;
			console.log('new dir: '+CwsC.newDirection);
			if (CwsC.newDirection === 'back'){
				transitionInClass = 'forward';
			} else if (CwsC.newDirection === 'forward'){
				transitionInClass = 'back';
			} else {
				transitionInClass = '';
			}
			CwsC.carouselContainer.html(carouselBuffer).addClass('noTransition').removeClass(CwsC.newDirection).addClass(transitionInClass);
			var dummy = CwsC.carouselContainer[0].offsetWidth;//force repaint 
			CwsC.carouselContainer.removeClass('noTransition').removeClass(transitionInClass);

			CwsC.carouselContainer.fadeTo(500, 1, function(){
				CwsC.setNav();
				CwsC.isTransitioning = false;
			});
			
			console.log('________________________________end renderItems');
		},

		transitionContent : function(direction, bIsHistoryDriven) {
			//console.log('xxxxxx TRANSITION CONTENT DIRECTION: '+direction+' bIsHistoryDriven: '+bIsHistoryDriven);
			CwsC.isTransitioning = true;
			if (CwsC.bHasCssTransforms){// wait for n transitions to end (sequenced)
				var transitionCount = 0;
				CwsC.carouselContainer.addClass(direction).on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
					transitionCount++;
					if (transitionCount === CwsC.carouselContainer.children().length){
						CwsC.carouselContainer.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
						if(bIsHistoryDriven !== true){// ie from ui btns
							CwsC.pushPageState(direction, undefined, undefined, undefined, undefined);
						}
					}

				});

			} else {// no css transitions support
				if(bIsHistoryDriven !== true){
					CwsC.pushPageState(direction, undefined, undefined, undefined, undefined);
				}
			}
		},
		markMultiple : function(newMultiple) {// mark the menu selection for multiple
			var multipleMenu = $('#setMultipleControl');
			multipleMenu.find('button').removeClass('active');
			multipleMenu.find('li:eq('+ --newMultiple +')>button').addClass('active');
		},

		setMultiple : function(newMultiple) {// action the new multiple
			this.multiple = newMultiple;
			this.pushPageState(undefined, CwsC.multiple, undefined, newMultiple, CwsC.introShow);
		},

		markLang : function(newLang) {// mark the menu selection for language
			var langMenu = $('#setLangControl');
			langMenu.find('button').removeClass('active');
			langMenu.find('#'+ newLang +'>button').addClass('active');
		},

		setLang : function(newLangChoice) {// action the new lang
			this.langChangedByUI = true;
			CwsC.pushPageState(undefined, undefined, newLangChoice, undefined, undefined);
		},

		setNav : function() {// ui paging back/fwd buttons toggle inactive state
			var next = $('.cwsCnext'),
				prev = $('.cwsCprev');
			if (this.contentIndex < this.carouselContentLength ) {
				next.removeClass('disabled').attr('title', this.carouselContent.i18n.uInext);
			} else {
				next.addClass('disabled').attr('title', '');
			}
			if (this.contentIndex <= this.multiple) {
				prev.addClass('disabled').attr('title', '');
			} else {
				prev.removeClass('disabled').attr('title', this.carouselContent.i18n.uIprevious);
			}
		},


		swipeListener : function() {
			CwsC.carouselContainer.swipe({
				// swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
				//	console.log("You swiped " + direction );
				// },
				swipeLeft:function() {
					$('.cwsCprev').trigger('click');
				},
				swipeRight:function() {
					$('.cwsCnext').trigger('click');
				},
				//Default 75px
				threshold:75
			});
		},


		init : function() {
			var pageFromUrl = 0,
				urlLocationType = '';
			if (Modernizr.csstransforms3d){
				this.bHasCssTransforms = true;
			}

			// extract the page no, multiple and lang from url, if its present (eg bookmark, refresh, pasted/shared url)
			if (window.location.search !== ''){//history-enabled
				urlLocationType = window.location.search;
			} else if (window.location.hash !== ''){//non-history enabled
				urlLocationType = window.location.hash;
			}
			if (urlLocationType !== ''){
				pageFromUrl = parseInt((urlLocationType.split('=')[1]).split('+')[0], 10);
				this.multiple = parseInt(urlLocationType.split('+multiple=')[1].split('+lang=')[0], 10);
				this.lang = urlLocationType.split('+lang=')[1].split('+intro=')[0];
				this.introShow = urlLocationType.split('+intro=')[1] == 'true' ? true : false;//ie convert string 'true' to a bool
			}

			if(pageFromUrl !== 0){//ie it's a bookmarked/pasted url
				this.startItem = pageFromUrl*this.multiple;
			} else {
				this.startItem = this.multiple;
			}

			this.loadData(0);//0= rebuild full ui


		}

	};

	$(document).ready(CwsC.init());

});
