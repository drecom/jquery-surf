/***********************

 jquery-surf.js

 Copyright (C) Drecom Co.,Ltd

 Licensed under MIT

***********************/
(function($) {
  var name_space = 'surf';
  $.fn[name_space] = function(options) {

    var element = this;
    var default_options = {
      axis : 'x',
      duration : '200',
      page_template : -1,
      page_template_url : './templates/default.tpl',
      main_view : '#ui-surf-main-view',
      page_holder : '#ui-surf-page-holder',
      surf_page_num : 'ui-surf-page-',
      surf_page : '.ui-surf-page',
      prev_button : '#ui-surf-prev-link',
      next_button : '#ui-surf-next-link',
      ui_surf : '.ui-surf',
      ui_surf_axis : 'ui-surf-axis-',
      prev_button_html : '<div id="ui-surf-prev-link">△</div>',
      next_button_html : '<div id="ui-surf-next-link">▼</div>',
      next : function(page, surf) {
        if (page < 1) {
          return false;
        }
        $.ajax( {
          url : './json/' + page + '.json',
          success : function(data) {
            var html = surf.RenderTemplate( {
              rankings : data
            });
            surf.insertAndMoveTo(page, html);
          },
          dataType : 'json'
        });
        return true;
      },
      prev : function() {
      }
    };
    var settings = $.extend(default_options, options);
    if (typeof (settings.page_template) == 'string') {
      var surf_template = $.createTemplate(settings.page_template);
    } else {
      var surf_template = $.createTemplateURL(settings.page_template_url);
    }

    function surfRenderedPage(page) {
      var holder = $(settings.main_view).children(
          'ul' + settings.page_holder);
      var rendered_page = holder
          .children('li' + settings.surf_page + ':nth-child(' + page + ')');
      if (rendered_page.length > 0) {
        return rendered_page;
      } else {
        return 0;
      }
    }
    ;
    function surfPageNumber(page) {
      var page_elements = $('ul' + settings.page_holder + ' li' + settings.surf_page);
      return (page_elements.index(page) + 1);
    }
    ;
    function surfRenderTemplate(data) {
      return $.processTemplateToText(surf_template, data);
    }
    ;
    function surfInsertAndMoveTo(page, html) {
      var holder = $(settings.main_view).children(
          'ul' + settings.page_holder);
      if (surfRenderedPage(page) == 0) {
        holder.append('<li id="' + settings.surf_page_num + page
            + '" class="' + settings.surf_page.replace('.','') + '">' + html + '</li>');
      }
      surfMoveTo(holder.children('li' + settings.surf_page + ':last'));
    }
    ;
    function surfMoveTo(to) {
      var view = $(settings.main_view);
      view.scrollTo(to, settings.duration, {
        axis : settings.axis
      });
      var page_number = surfPageNumber(to);
      if (page_number < 1) {
        page_number = 1;
      }
      $.data($(settings.ui_surf).get(0), name_space).current_page = page_number;
    }
    ;

    var surf = {
      renderTemplate : surfRenderTemplate,
      insertAndMoveTo : surfInsertAndMoveTo,
      pageNumber : surfPageNumber,
      renderedPage : surfRenderedPage,
      moveTo : surfMoveTo
    };

    return element
        .each(function() {
          $(this).addClass(settings.ui_surf.replace('.',''));
          $(this).addClass(settings.ui_surf_axis + settings.axis);

          $(settings.prev_button_html).appendTo($(this));
          $(
              '<div id="' + settings.main_view.replace("#",'') + '"><ul id="' + settings.page_holder.replace('#','') + '"></ul></div>')
              .appendTo($(this));
          $(settings.next_button_html).appendTo($(this));

          var ui_surf = $(this);
          var ui_surf_page_holder = $(settings.page_holder);
          $.data(ui_surf.get(0), name_space, {
            current_page : 0
          });

          $(this)
              .children(settings.next_button)
              .click(
                  function() {
                    var current_page = $.data(ui_surf
                        .get(0), name_space).current_page;
                    var rendered_page = surfRenderedPage(current_page + 1);
                    if (rendered_page) {
                      return surfMoveTo(rendered_page);
                    }
                    $.data(ui_surf.get(0), name_space).processing = 1;
                    settings.next(current_page + 1, surf);
                    $.data(ui_surf.get(0), name_space).processing = 0;
                  });
          $(this)
              .children(settings.prev_button)
              .click(
                  function() {
                    var current_page = $.data(ui_surf
                        .get(0), name_space).current_page;
                    var rendered_page = surfRenderedPage(current_page - 1);
                    if (rendered_page) {
                      return surfMoveTo(rendered_page);
                    }
                    settings.prev(current_page - 1, surf);
                  });
          $(this).children(settings.next_button).click();
        });
  };

})(jQuery);
