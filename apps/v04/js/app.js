var search = instantsearch({
  // Replace with your own values
  appId: 'CDUMM9WVUG',
  apiKey: '3cc392a5d139bd9131e42a5abb75d4ee', // search only API key, no ADMIN key
  indexName: 'imls_v04',
  urlSync: true,
  searchParameters: {
    hitsPerPage: 50
  }
});

// search input widget  
search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search-input'
  })
);

// number of hits
search.addWidget(
  instantsearch.widgets.stats({
    container: '#count',
    templates: {
      body: function(data) {
        var result = data.hasOneResult ? "result" : "results";
        return data.nbHits + ' ' + result;
      }
    }
  })
);

// display results
search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: document.getElementById('hit-template').innerHTML,
      empty: "We didn't find any results for the search <em>\"{{query}}\"</em>"
    }
  })
);

// pagination
search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination'
  })
);

// clear all filters
search.addWidget(
  instantsearch.widgets.clearAll({
    container: '#clear-all',
    templates: {
      link: 'Reset filters'
    }
  })
)

// state facet
search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#state-refinement',
    attributeName: 'state',
    limit: 5,
    showMore: true,
    templates: {
      header: 'State'
    }
  })
);

// locale facet
search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#locale-refinement',
    attributeName: 'locale_string',
    templates: {
      header: 'Locale'
    }
  })
);

// total circulation slider  
search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: '#total-circulation-refinement',
    attributeName: 'total_circulation',
    templates: {
      header: 'Total Circulation'
    },
    tooltips: {
      format: function(rawValue) {
        return Math.round(rawValue).toLocaleString();
      }
    }
  })
);

// total revenue slider  
search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: '#total-revenue-refinement',
    attributeName: 'total_revenue',
    templates: {
      header: 'Total Revenue'
    },
    tooltips: {
      format: function(rawValue) {
        return Math.round(rawValue).toLocaleString();
      }
    }
  })
);

// total staff slider  
search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: '#total-staff-refinement',
    attributeName: 'total_staff',
    templates: {
      header: 'Total Staff'
    },
    tooltips: {
      format: function(rawValue) {
        return Math.round(rawValue).toLocaleString();
      }
    }
  })
);

// service area population slider  
search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: '#service-area-population-refinement',
    attributeName: 'service_area_population',
    templates: {
      header: 'Service Area Population'
    },
    tooltips: {
      format: function(rawValue) {
        return Math.round(rawValue).toLocaleString();
      }
    }
  })
);

// start the search UI
search.start();
