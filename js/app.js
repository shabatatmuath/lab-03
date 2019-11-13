$(function() {
    'use strict';
  
    let sortedBy = 'title';
    let currentPage = 'data/page-1.json';
  
    
    function Horn(data) {
      this.imageurl = data.image_url;
      this.title = data.title;
      this.description = data.description;
      this.keyword = data.keyword;
      this.horns = data.horns;
    }
  
    Horn.all = {};
    Horn.allKeywords = new Set();
  
    
    Horn.prototype.toHtml = function() {
      let $template = $('#photo-template').html();
      let compiledTemplate = Handlebars.compile($template);
      return compiledTemplate(this);
    };
  
    Horn.readJSON = (filePath) => {
      $.get(filePath, 'json')
        .then((data) => {
          let allAnimals = [];
          data.forEach((item) => {
            allAnimals.push(new Horn(item));
            Horn.allKeywords.add(item.keyword);
          });
          Horn.all[filePath] = allAnimals;
          Horn.populateFilter();
        })
        .then(() => {
          Horn.loadHorns(filePath);
        });
    };
  
    Horn.populateFilter = () => {
      $('option')
        .not(':first')
        .remove();
  
      Horn.allKeywords.forEach((keyword) => {
        $('#filterList').append(
          `<option value="${keyword}">${keyword.charAt(0).toUpperCase() +
            keyword.slice(1)}</option>`
        );
      });
    };
  
    Horn.loadHorns = (filePath) => {
      Horn.all[filePath] = Horn.all[filePath].sort((a, b) => {
        let sortType = $('.sortBtns:checked').val();
        if (sortType === 'title') {
          if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
          if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
          return 0;
        } else if (sortType === 'horns') {
          return b.horns - a.horns;
        }
      });
  
      Horn.all[filePath].forEach((data) => {
        $('#animal-wrap').append(data.toHtml());
      });
    };
  
    let _filterImages = () => {

      $('#filterList').on('change', () => {
        let selectedKeyword = $('select option:selected').val();
  
        if (selectedKeyword === 'default') {
          $('.animal:hidden').show();
        } else {
         

          $('.animal')
            .toArray()
            .forEach((val) => {
              val = $(val);
              if (!val.hasClass(selectedKeyword)) {
                val.fadeOut(200);
              } else {
                val.fadeIn(200);
              }
            });
        }
      });
    };
    let navBtns = () => {
      $('#navigation').append(
        '<button class="navButtons" id="data/page-1.json" type="button">Page 1</button>' +
          '<button class="navButtons" id="data/page-2.json" type="button">Page 2</button>'
      );
      $('.navButtons').click(function(event) {
        currentPage = event.target.id;
        $('.animal').remove();
        Horn.loadHorns(currentPage);
      });
    };
    let sortBtns = () => {
      $('#sort').append(
        '<input class="sortBtns" value="title" type="radio" name="sort" checked> Sort by Title </input>' +
          '<input class="sortBtns" value="horns" name="sort" type="radio"> Sort by Horns </input>'
      );
      $('.sortBtns').on('click', function() {
        let checked = $('.sortBtns:checked').val();
        if (sortedBy !== checked) {
          sortedBy = checked;
          $('.animal').remove();
          Horn.loadHorns(currentPage);
        }
      });
    };
    $(() => {
      Horn.readJSON('data/page-1.json');
      Horn.readJSON('data/page-2.json');
      _filterImages();
      navBtns();
      sortBtns();
    });
  });
 
 
 
