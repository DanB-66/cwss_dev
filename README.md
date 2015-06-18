# cwss_dev
My folio wip...

Adopting a "minimum viable product" approach... Which meant starting with data, then manipulating said data... and worrying about the visual representation later ;)

It uses *json/cws_en.json*  content files, 
javascript *js/main.js* (via a require.js *js/app.js* stub) to render that out into a carousel/paging system 
via *templates/_cws.tmpl.js* dust templates, which are very simple so far but do demo conditional logic eg absent nodes in the data. 
*sass/screen_v42.scss* Sass helps (a lot...) with the styling. 
Native browser back/fwd will drive the UI and state is maintained cross-browser eg bookmarking retaining 'page', 'multiple' and 'lang' selections. 
Fully functional in IE8. 
3D transitions: just a start... 
There will be some sort of *projects.php* non js content rendered by php from the same json. 

Completely incomplete!
