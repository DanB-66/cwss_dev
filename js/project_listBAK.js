;(function ( $, window, undefined ) {

    $.get('templates/_cws.tmpl.html', function(templates) {

        $.ajaxSetup({ cache: false });
        $.getJSON('json/cws.json', function(data) {

            var projectsTemplate = $(templates).filter('#projectsTemplate').html();
            var compiled = dust.compile(projectsTemplate, 'cwsProjects');
            dust.loadSource(compiled);

            $.each(data.cwsData.projects, function(i, val) {
              dust.render('cwsProjects', val, function(err, output){
              $('#projects').append(output);
            });

          });

        });

    });

}(jQuery, window));