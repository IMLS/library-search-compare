# library-search-compare

## Install
Requires nodejs and git.

```
git clone git@github.com:IMLS/library-search-compare
cd library-search-compare/search-compare
npm install
npm start
```

Then open a browser to the URL specified in your terminal.


## Build
```
OLD_VERSION="v08"
NEW_VERSION="v09"
git clone git@github.com:IMLS/library-search-compare
cd libary-search-compare
cp -r apps/$OLD_VERSION apps/$NEW_VERSION
rm -r apps/$NEW_VERSION/search-compare
cd search-compare
npm install
npm run build 
cd ..
cp -r search-compare/build/default apps/$NEW_VERSION/search-compare 
git add apps/$NEW_VERSION
git commit -m "build $NEW_VERSION"
git tag $NEW_VERSION
git push origin master
git push origin $NEW_VERSION
```

## Test

```
git clone git@github.com:IMLS/library-search-compare
cd library-search-compare/search-compare
npm install
npm run test 
```


## Github:

### Current Version:

  - v08 
  - The current codebase is always in apps/( version #)

### Overview:

The IMLS Search and compare tool provides an interface to both search the 2016 Public Library Survey data via faceted and filtered search and to compare data between the libraries.  The faceted search capabilities are provided by [Algolia](https://www.algolia.com/apps/CDUMM9WVUG/dashboard).  The widgets that make up the search box, search facets, slider filters and display of the search results are provided by Algolia's [InstantSearch.js](https://community.algolia.com/instantsearch.js/) JavaScript library.  The site also uses the direct [Algolia search API](https://www.algolia.com/doc/api-reference/).

In addition the site uses the following JS libraries:
  - jQuery(3.3.1), lodash, vanilla-datatables

CSS files are located in:
  - search-compare/css/
    - bootstrap-min.css
    - style.css

There are two pages to the application:

Search page:
  - search-compare/index.html
  - search-compare/js/app.js
  - search-compare/js/common.js

Details page:
  - search-compare/detail.html  
  - search-compare/js/details.js

Repo: 
  - library-search-compare [https://github.com/IMLS/library-search-compare](https://github.com/IMLS/library-search-compare)  


Project Schedule:
RTI is working under two contracts - Base contract and modification/extension.  The schedule for each is kept in a [Google Calendar](https://calendar.google.com/calendar/b/1/r/month/2018/8/1?tab=wc)

Branches:
  - master
  - gh-pages
  - Other branches as needed  

Workflow:

  - Work locally on master or another branch  
  - If using a different branch:
    - Add/Commit/Push branch  
    - Checkout master  
    - git merge <branch-name>  
  - Checkout master  
  - push master to origin  
  - **Push only /apps to gh-pages**
  ```
  git subtree push --prefix apps origin gh-pages
  ```
  - View at 
    [https://imls.github.io/library-search-compare/v06](https://imls.github.io/library-search-compare/v06/)

  - Deployment branch push
  ```
  git subtree push --prefix apps/[current_version] origin canton/deployment
  ```

## Creating json file for Algolia:

## Data sources
Uses IMLS Public Libraries Survey data described here:
[https://www.imls.gov/research-evaluation/data-collection/public-libraries-survey/explore-pls-data/pls-data](https://www.imls.gov/research-evaluation/data-collection/public-libraries-survey/explore-pls-data/pls-data)

Using the API available on data.imls.gov at [this endpoint](https://data.imls.gov/resource/yqs5-dnp6.json) described here:
[https://data.imls.gov/Public-Libraries-Survey/Public-Libraries-Survey-2016-Library-Systems-Admin/grpq-tgei](https://data.imls.gov/Public-Libraries-Survey/Public-Libraries-Survey-2016-Library-Systems-Admin/grpq-tgei)

## Clusters and Variables   

4 clusters:
  - Finance  
    - TOTINCM - total_revenue   
    - STAFFEXP - total_staff_expenditures   
    - TOTEXPCO - total_collection_expenditures   
    - CAP_REV - total_capital_revenue   
    - CAPITAL - capital_expenditures   
  - Service  
    - POPU_LSA  - Variable created by Alan based on service_area_population  
    - HRS_OPEN  - hours  
    - VISITS - visits
    - REFERENC - references  
    - REGBOR - users 
    - TOTCIR - total_circulation   
    - LOANTO - loans_to   
    - TOTPRO - total_programs   
    - GPTERMS - computers   
  - Collection  
    - BKVOL - print_materials   
    - EBOOK - ebooks   
    - AUDIO_PH - audio_materials   
    - VIDEO_PH - video_materials   
    - ELECCOLL - total_databases 
    - SUBSCRIP - print_serials   
  - Staff  
    - MASTER - mls_librarian_staff   
    - LIBRARIA - librarian_staff 
    - OTHPAID - other_staff  

Mean and Percentile Rank Calculations for 23 variables:  


## Deployment:

### Deployment branch with just app code, no v06, etc

New site structure

index.html - Labs landing page

search-compare directory:
  - index.html - S&C main page

### Canton-Dev branch 

Place where Canton can push deployment issues
