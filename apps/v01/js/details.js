// var algoliasearch = require('algoliasearch');
// var algoliasearch = require('algoliasearch/reactnative');
// var algoliasearch = require('algoliasearch/lite');
// or just use algoliasearch if you are using a <script> tag
// if you are using AMD module loader, algoliasearch will not be defined in window,
// but in the AMD modules of the page

var client = algoliasearch('CDUMM9WVUG', '3cc392a5d139bd9131e42a5abb75d4ee');
var index = client.initIndex('imls');

// parse url params
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var fscs_id = getParameterByName('fscs_id');

// only query string
var query = 'fscs_id ' + fscs_id;
index.search({ 
    query: query,
    exactOnSingleWordQuery: 'attribute', 
    typoTolerance: false
  }, function searchDone(err, content) {
  if (err) {
    console.error(err);
    return;
  }

  for (var h in content.hits) {
    res = content.hits[h];
    document.getElementById("name").innerHTML = res.library_name;
    document.getElementById("address").innerHTML = res.mailing_address;
    var city = res.mailing_city + ', ' + res.state
    document.getElementById("city").innerHTML = city;
    var county = 'County: ' + res.county + ' Population: ' + res.county_population;
    document.getElementById("county").innerHTML = county;
    var fscs_id = 'fscs_id: ' + res.fscs_id;
    document.getElementById("fscs-id").innerHTML = fscs_id;
    // var clusters = ' Clusters: <a href="#" id=service" data-type="service", data-value="' + res.cluster_service + '">Service: ' + res.cluster_service + '</a> Staff: ' + res.cluster_staff + ' Finance: ' + res.cluster_finance + ' Collection: ' + res.cluster_collection;
    // document.getElementById("clusters").innerHTML = clusters;

    var service = document.querySelector('#service-link');
    service.setAttribute("data-cluster",res.cluster_service);

    var staff = document.querySelector('#staff-link');
    staff.setAttribute("data-cluster",res.cluster_staff);

    var finance = document.querySelector('#finance-link');
    finance.setAttribute("data-cluster",res.cluster_finance);

    var collection = document.querySelector('#collection-link');
    collection.setAttribute("data-cluster",res.cluster_collection);

    document.getElementById("json").innerHTML = JSON.stringify(content.hits[0], undefined, 2);

    // Event handler for cluster link
    var similar_links = document.querySelector('#similar-links');
    similar_links.onclick = function(el) {
      getSimilarLibraries(el);
    }
  }
});

// Get and display cluster data
function getSimilarLibraries(el) {
  var cluster_type = el.target.getAttribute("data-type");
  var cluster_value = el.target.getAttribute("data-cluster");
  index.search({ 
      filters: cluster_type + ' = ' + cluster_value,
    }, function searchDone(err, content) {
    if (err) {
      console.error(err);
      return;
    }

    document.getElementById("similar-libraries").innerHTML = "";
    for (var h in content.hits) {
      res = content.hits[h]
      console.log(res[cluster_type]);
      var cluster_data = res[cluster_type];
      var cluster_div = document.createElement("div");
      var cluster_item = document.createTextNode(res.fscs_id + ' ' + res.library_name + ': ' + cluster_data);
      cluster_div.appendChild(cluster_item)
      document.getElementById("similar-libraries").appendChild(cluster_div);
    }
  });
}

