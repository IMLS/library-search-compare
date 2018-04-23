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
    TODO:  put gh-pages url here

## Creating json file for Algolia:



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


  
