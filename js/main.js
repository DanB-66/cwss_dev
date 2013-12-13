/*global dust:true, History:true, Modernizr:true */

define(['jquery', 'history', 'dust', 'dustTemplate1'], function ($) {

'use strict';

	var CwsC = {
	
		multiple : 3,//default 3, no if items per carousel page
		lang : 'en',//default en
		renderTarget : $('.cwsCarousel'),//elem to create it inside
		carouselContent : '',// data
		carouselUiContent : '',// ui label data
		carouselContainer : '',
		carouselBuffer : '',//temp store of rendered dust for each page "group"
		carouselContentLength : '',
		contentIndex : '',//index of the last shown project item
		bHasCssTransforms : false,// test with modernizer
		History : window.History,//history lib in use
		pageTitle : document.title,
		startItem: '',
		currentPage: '',
		newMultiple: '',
		newLang: '',
		prevBtn: $('.cwsCprev'),
		nextBtn: $('.cwsCprev'),
		isTransitioning: false,

		showPage : function(direction, index, newLang, newMultiple){
			console.log('OOO showPage - direction: '+direction+', index: '+index+', newLang: '+newLang+', newMultiple: '+newMultiple);

			if (newMultiple !== undefined) {
				this.multiple = newMultiple;
			}
			/*if (newLang !== undefined) {
				console.info('new lang');
				//LOAD DATA HERE?
				//this.multiple = newMultiple;
			}*/
			if (index !== undefined){
				this.contentIndex = index;
			}
			if (direction === 'forward'){
				this.contentIndex += this.multiple;
			}
			if (direction === 'back'){
				this.contentIndex -= this.multiple ;
			}

			this.currentPage = this.contentIndex/this.multiple;

			var that = this;
			this.carouselContainer.fadeTo(500, 0, function() {
				//here: push state and let statechange manipulate ui
		
				console.log('PUSH STATE: content index- '+that.contentIndex +'- page title' + that.pageTitle + ' page=' + that.currentPage + ' multiple=' + that.multiple + ' lang=' + that.lang);
				that.History.pushState({state: that.contentIndex, 
										rand: Math.random(), 
										direction: direction, 
										lang: that.lang, 
										multiple: that.multiple}, 
											that.pageTitle + ' - Page ' + that.currentPage, 
												'?page=' + that.currentPage + '+multiple=' + that.multiple + '+lang=' + that.lang);
			});
			
		},

		buildUI : function(bIsRebuild) {// build ui elems on load, on lang change refresh with new data
			var controls = '<section id="controls"><section id="setMultipleControl"><h4>'+this.carouselContent.i18n.uImultiItems+':</h4><ul><li>1</li><li>2</li><li>3</li><li>4</li></ul></section><section id="setLangControl"><h4>'+this.carouselContent.i18n.uImultiLang+':</h4><ul><li id="en">'+this.carouselContent.i18n.localeNames.uIen+'</li><li id="fr">'+this.carouselContent.i18n.localeNames.uIfr+'</li></ul></section></section>';
			var ui = '<a href="#" class="cwsCprev" title="'+this.carouselContent.i18n.uIprevious+'">'+this.carouselContent.i18n.uIprevious+'</a> <a href="#" class="cwsCnext" title="'+this.carouselContent.i18n.uInext+'">'+this.carouselContent.i18n.uInext+'</a><div class="carousel multiple'+CwsC.multiple+'"></div>';
			this.renderTarget.html(controls + ui);
			this.carouselContainer = this.renderTarget.children('.carousel');
			if (bIsRebuild){// ie from lang select
				console.log('*****lang selected, in buildUI');
				bIsRebuild = 0;
				this.showPage(undefined, undefined, CwsC.lang, undefined);
			} else {
				this.renderTarget.on('click','.cwsCprev, .cwsCnext', function(event) {
					if(CwsC.isTransitioning){
						return false;
					} else {
						if (!$(this).hasClass('disabled')){
							var direction = 'forward';
							if ($(this).hasClass('cwsCprev')){
								direction = 'back';
							}
							CwsC.isTransitioning = true;
							if (CwsC.bHasCssTransforms){// wait for n transitions to end (sequenced)
								var transitionCount = 0;
								CwsC.carouselContainer.addClass(direction).on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
									transitionCount++;
									if (transitionCount === CwsC.carouselContainer.children().length){
										CwsC.carouselContainer.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
										CwsC.showPage(direction, undefined, undefined, undefined);
									}

								});

							} else {
								//console.log('no transitions');
								CwsC.showPage(direction, undefined, undefined, undefined);
							}

						}
					}
					event.preventDefault();
				});

				/* STATECHANGE BINDING */
				History.Adapter.bind(window,'statechange', function() {// ie both browser back/fwd btn and app ui btns and initial load - all logic to manipulate page should be here
					var State = History.getState();
					console.log('STATECHANGE, state: ' + State.data.state + ' direction: ' + State.data.direction + ' mult: ' + State.data.multiple+ ' lang: ' + State.data.lang);
					console.log('LANGS, state:  lang: ' + State.data.lang + ' cws lang: '+CwsC.lang);
					
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


					if (Object.keys(State.data).length !== 0) {

						if (State.data.state !== CwsC.contentIndex) {// back button pressed, go to previous page
							CwsC.contentIndex = State.data.state;
						}
						CwsC.carouselContainer.fadeTo(500, 0, function() {
							if (State.data.lang !== CwsC.lang) {// back button pressed, go to previous lang
								CwsC.lang = State.data.lang;
								CwsC.loadData(false, true);
							} else if (State.data.multiple !== CwsC.multiple) {// back button pressed, go to previous multiple
								CwsC.multiple = State.data.multiple;
								CwsC.renderItems();
							} else {// all other renders. ie: load, paging, mult, lang
								CwsC.renderItems();
							}
						});

					} else {
						history.back();//no State.data left, so do NORMAL history back to prev site(note lowercase h)
					}

				});

				// delegate click on 'set multiple' control
				this.renderTarget.on('click', '#setMultipleControl li', function() {
					var currMultiple = $(this).index()+1;
					if(currMultiple !== CwsC.multiple){
						CwsC.setMultiple(currMultiple);
					}
				});
				
				// delegate click on 'set lang' control
				this.renderTarget.on('click', '#setLangControl li', function() {
					var currId = $(this).attr('id');
					if(currId !== CwsC.lang){
						CwsC.setLang(currId);
					}
				});
				this.showPage(undefined, CwsC.startItem, undefined, undefined);//show first set on load, potentially based on referrer

			}
			this.markLang(this.lang);// mark on page initial load and lang change

		},

		loadData : function(bIsRebuild, reloadData) {// load json - use beforeSend to set spinner?
			$.ajax({
				url: 'json/cws_'+CwsC.lang+'.json',
				dataType: 'json',
				cache: false,
				success: function(data) {
					CwsC.carouselContent = data.cwsData;//data
					CwsC.carouselUiContent = data.cwsData.i18n;//ui labels data
					CwsC.carouselContentLength = CwsC.carouselContent.projects.length;// length of the projects data 
					if (!reloadData){
						CwsC.buildUI(bIsRebuild);
					} else {
						// back button hit after a lang change
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
				incrementBuffer = function(err, output){
				if(err !== null){
					alert("dust error: " + err);
				}
				CwsC.carouselBuffer += output;
			};
			
			if (refreshLang){
				//rebuild controls with new lang
				$('#controls').html('<section id="setMultipleControl"><h4>'+this.carouselContent.i18n.uImultiItems+':</h4><ul><li>1</li><li>2</li><li>3</li><li>4</li></ul></section><section id="setLangControl"><h4>'+this.carouselContent.i18n.uImultiLang+':</h4><ul><li id="en">'+this.carouselContent.i18n.localeNames.uIen+'</li><li id="fr">'+this.carouselContent.i18n.localeNames.uIfr+'</li></ul></section>');
				CwsC.markLang(CwsC.lang);
			}

			CwsC.carouselContainer.empty().removeClass('forward back enterLeft enterRight multiple1 multiple2 multiple3 multiple4').addClass('multiple'+CwsC.multiple);
			CwsC.markMultiple(CwsC.multiple);
			CwsC.carouselBuffer = '';

			//reduce CwsC.contentIndex by multiple and iterate dust
			CwsC.contentIndex = CwsC.contentIndex - CwsC.multiple;
			for (var i=0; i < CwsC.multiple; i++) {
				projData = CwsC.carouselContent.projects[CwsC.contentIndex];
				uiData = CwsC.carouselUiContent;
				mergedJson = dust.makeBase(uiData);
				mergedJson = mergedJson.push(projData);
				if (CwsC.contentIndex < CwsC.carouselContentLength) {
					dust.render('cwsProjects', mergedJson, incrementBuffer);//'cwsProjects' is a compiled dust template already registered
				}
				CwsC.contentIndex++;
			}

			var transitionInClass = 'enterLeft';
			if (CwsC === 'back'){
				transitionInClass = 'enterRight';
			}
			CwsC.carouselContainer.html(CwsC.carouselBuffer).addClass(transitionInClass);
			
			CwsC.carouselContainer.fadeTo(500, 1, function(){
				CwsC.setNav();
				CwsC.isTransitioning = false;
			});
			
			console.log('________________________________end render items');
		},

		markMultiple : function(newMultiple) {// mark the menu selection for multiple
			var multipleMenu = $('#setMultipleControl');
			multipleMenu.find('li').removeClass('active');
			multipleMenu.find('li:eq('+ --newMultiple +')').addClass('active');
		},

		setMultiple : function(newMultiple) {// action the new multiple
			this.multiple = newMultiple;
			this.showPage(undefined, CwsC.multiple, undefined, newMultiple);
		},

		markLang : function(newLang) {// mark the menu selection for language
			var langMenu = $('#setLangControl');
			langMenu.find('li').removeClass('active');
			langMenu.find('#'+ newLang).addClass('active');
		},

		setLang : function(newLang) {// action the new lang
			console.log('action newLang: ' , newLang);
			this.lang = newLang;
			this.carouselContainer.fadeTo(500, 0, function(){
				//debugger;
				CwsC.loadData(1);//1= only refresh data
			});
		},

		setNav : function() {// paging back/fwd buttons toggle inactive state
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
				this.lang = urlLocationType.split('+lang=')[1].split('&')[0];
			}

			if(pageFromUrl !== 0){//ie it's a bookmarked/pasted url
				this.startItem = pageFromUrl*this.multiple;
			} else {
				this.startItem = this.multiple;
			}
			
			console.log('start item............................'+this.startItem);
			this.loadData(0);//0= rebuild full ui
		}

	}; 

	$(document).ready(CwsC.init());

});
