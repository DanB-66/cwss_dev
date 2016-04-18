# cwss_dev
My old folio... Completely incomplete!

* It uses _(json/cws_en.json)_ content files - the (ok, rubbish!) French translations are really just to demo data loading
* Javascript _(js/main.js)_ via a require.js _(js/app.js)_ stub renders data into a carousel/paging system 
* Uses _(templates/_cws.tmpl.js)_ Dust client side templates, which are very simple so far but do demo conditional logic eg absent nodes in the data 
* Sass _(sass/screen_v42.scss)_ helps (a lot...) with the styling 
* State management - Native browser back/fwd will drive the UI and state is maintained cross-browser eg bookmarking retaining "page", "multiple" and "lang" selections. 
* ~~Fully functional in IE8~~ hmm, seems borken now... it *was* working fine (using hashchange rather than statechange event). Wont fix ;)
* Touch enabled
* 3D transitions: just a start... 
* There is a basic _(projects.php)_ non js content page rendered by php from the same json, aiming to get this to recreate an SEO view

##Edit 2016: 
Oh dear... This was a start of a portfolio site originally written around 2012 which ended up turning into a bit of a strange beast... and then abandoned (apart from json content files). At the time, I had been involved in some js-heavy presentational sites and wanted specifically to practice and develop skills in data parsing and manipulation, "SPA style" state management and responsive/adaptive css. 

I resisted the usual temptation to spend ages in Photoshop and to try and adopt a "minimum viable product" approach as to what I wanted to achieve technically without worrying about the visual representation at all. 

This meant going straight to writing a json data file, manipulating said data into a carousel/paging system and adding some styling and transitions while retaining the lightest possible DOM structure.

I've since spent time with Backbone etc, but the end result is really a simple MVC approach - the model is the json, the views are the Dust client side templates and the controller is the History.js library - eg the UI is listening for state changes and UI actions are all triggered by pushing to the url.

Although it was certainly a good learning exercise I wont be taking it much further for the following reasons:

* I'm obviously more interested in emerging component-based approaches rather than what Addy Osami would rightly describe as "a tangled mess of jQuery selectors and callbacks, all desperately trying to keep data in sync between the HTML for your UI, the logic in your JavaScript, and calls to your API for data."
* The UX is rubbish - what's with all those tiny scrolling panels?
* A "js only" project no longer cuts it in 2016... and the isomorphic approach would be a challenge with this setup (although not impossible, and I had already been thinking around that area).

Unless you are a highly visual developer, I'm not sure it's really worth spending much time on a folio in comparison to putting up a simple list of urls and code samples.

Thanks for reading!


