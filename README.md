# library-search-compare

## Github:

Repo: 
  - library-search-compare [https://github.com/IMLS/library-search-compare](https://github.com/IMLS/library-search-compare)  

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
    [https://imls.github.io/library-search-compare/v05](https://imls.github.io/library-search-compare/v05/)

  - Deployment branch push
  ```
  git subtree push --prefix apps/v05 origin canton/deployment
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

### Deployment branch with just app code, no v05, etc

New site structure

index.html - Labs landing page

search-compare directory:
  - index.html - S&C main page

### Canton-Dev branch 

Place where Canton can push deployment issues
