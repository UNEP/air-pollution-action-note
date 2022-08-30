# Data Description
The UNEP Pollution Dashboard displays the global state of air pollution, major sources, the impact on human health, and national efforts to tackle this critical issue. The dashboard shows different sets of data:

* Data for PM2.5 exposure and attributable deaths comes from [Global Burden of Disease Study 2019](https://vizhub.healthdata.org/gbd-results/), the most comprehensive worldwide observational epidemiological study to date, led by the Institute for Health Metrics and Evaluation (IHME), an independent global health research center at the University of Washington, Seattle (USA). Examining trends from 1990 to the present, the latest GBD study includes data on mortality and morbidity in 204 countries and territories, 369 diseases and injuries, and 87 risk factors.  
* Data for sectors breakdown comes from McDuffie, E.E., Martin, R.V., Spadaro, J.V. et al. [Source sector and fuel contributions to ambient PM2.5 and attributable mortality across multiple spatial scales](https://www.nature.com/articles/s41467-021-23853-y) Nat Commun 12, 3594 (2021)
 -  Data for the sector section was reaggregated from country data into UNEP regions, which are different from the ones used in the study.
* Data for policy implementations comes from [Actions on Air Quality: A Global Summary of Policies and Programmes to Reduce Air Pollution](https://www.unep.org/resources/report/actions-air-quality-global-summary-policies-and-programmes-reduce-air-pollution). Source: UNEP, 2021. 
<em>The boundaries and names shown, and the designations used on these maps, do not imply official endorsement or acceptance by the United Nations.</em>
* [Ambient particulate matter pollution exposure summary estimates](https://ghdx.healthdata.org/sites/default/files/record-attached-files/IHME_GBD_2019_AIR_POLLUTION_1990_2019_PM.zip)
* [Total deaths and deaths per 100,000 people attributable to ambient particulate matter pullution](https://vizhub.healthdata.org/gbd-results?params=gbd-api-2019-permalink/6e3468190433cfde61c4d81616db6945) (You need to register)
* [Percent of deaths from a selected set of illnesses attributable to ambient particulate matter pullution](https://vizhub.healthdata.org/gbd-results/?params=gbd-api-2019-permalink/0e754a60c0fefcbbe6801c994e9ab274) (You need to register)

-- Methodology for [information on how Global Burden Diseases](https://www.thelancet.com/gbd) estimates are produced.

# Codebook
In 2021, in response to increases in quality and quantity of evidence of air pollution impacts, the WHO updated the PM2.5 annual mean Air Quality Guideline (AQG) to 5µg/m3. The update halves the previous 2005 guideline level of 10µg/m3.
For current state:
| :variable_name | :description                                                                                 |
|----------------|----------------------------------------------------------------------------------------------|
|AQG 2021        | 5 µg/m3 a year
|Interim Target 4| 10 µg/m3 
|Interim Target 3| 15 µg/m3 
|Interim Target 2| 25 µg/m3 
|Interim Target 1| 35 µg/m3 

Air pollution exposure contributes to a number of key illnesses globally but its contribution is not borne equally across the world. For exposure:
| :variable_name | :description                                                                                 |
|----------------|----------------------------------------------------------------------------------------------|
| TK TK          | TK TK   

Air pollution is a major global health epidemic and causes one in nine deaths worldwide. Exposure to PM2.5 reduced average global life expectancy by approximately one year in 2019. For total deaths 'Health impacts' section:
| :variable_name | :description                                                                                 |
|----------------|----------------------------------------------------------------------------------------------|
|name            | Country
|id              | Identification from the [Country-dictionary]
|deaths          | Number of deaths by country in 2019 caused by air pollution

The deadliest illnesses linked to PM2.5 air pollution are stroke, heart disease, lung disease and cancer. High levels of fine particles also contribute to other illnesses, like diabetes, can hinder cognitive development in children and also cause mental health problems. 
For 'Health impacts' by disease:

| :variable_name | :description                                                                                 |
|----------------|----------------------------------------------------------------------------------------------|
| measure_name   | Indicator for which the estimates are produced — Deaths, percent, rate by 100,000 people ... |
| location_name  | Country name                                                                                 |
| sex_name       | Sex or Both                                                                                  |
| cause_name     | A type of injury or disease —or a group of them— that causes the death or disability         |
| rei_name       | A risk causally associated with an increased probability of that disease or injury.          |
| metric_name    | The unit in which measure_name is expressed                                                  |
| year           | Year of the estimate                                                                         |
| val            | Median                                                                                       |
| upper          | Upper bound of the 95% uncertainty interval                                                  |
| lower          | Lower bound of the 95% uncertainty interval                                                  |

Residential pollution is the main human-made source of fine particles globally, while windblown dust is a major source in much of Africa and West Asia. [Data for sectors and regions was filtred](https://docs.google.com/spreadsheets/d/1riat7SmYFjJ8IHVrxD3BjcqEqZA7CM-T321Z_IBscxI/edit#gid=0) from this source: [AQ Actions Report - Country Data (Survey_06 July 2022)](https://docs.google.com/spreadsheets/d/1r89KtMNU6ffW9bthFZLjkSjZ2-GqIz5X/edit#gid=275222536). 

| :variable_name | :description                                                                                 |
|----------------|----------------------------------------------------------------------------------------------|
| ind-1          | INDUSTRY- Clean production incentives                                                        |
| tra-1          | TRANSPORT- Vehicle emission standards                                                        |
| tra-2          | TRANSPORT- Fuel Sulphur content                                                              |
| waste-1        | WASTE- Solid Waste Burning                                                                   |
| res-1          | RESIDENTIAL (HOUSEHOLD AIR POLLUTION). Number of countries that promote use of clean energy in households for cooking and heating.                                                       |
| agri-1         | AGRICULTURE- Sustainable agricultural practices                                              |
| aqms-1         | AIR QUALITY MANAGEMENT STRATEGIES (AQMS)- Countries with an AQMS, framework or plan of action|                                 
| aqm-1          | AIR QUALITY MONITORING                                                |  
| aq-1           | AIR QUALITY STANDARDS                                               |

                                                 
Government actions on air quality are steadily growing, but implementation and capacity gaps hinder progress towards clean air. 
Actions taken towards cleaner air are classified into [four categories and an assigned value](https://docs.google.com/spreadsheets/d/1riat7SmYFjJ8IHVrxD3BjcqEqZA7CM-T321Z_IBscxI/edit#gid=0): Target met (1), On track (2), Not met (3), No data (4). 
| Policies actions classifications | Description                                                                                                                                                                                     |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Target met (1)                  | This classification denotes countries that have adopted policies or similar instruments to help achieve desired air quality improvements                                                        |
| On track (2)                     | Countries that are on the way to adopting policies and strategies for air quality improvement but acceleration needed                                                                           |
| Not met (3)                     | Countries that have no policy or similar instrument in place to achieve desired air quality improvements                                                                                        |
| No data (4)                     | This classification denotes instances where no internationally comparable data were available for a country or, when available, these data were not deemed recent enough to use in the analysis |


## Minor data transformations
[ObservableHQ notebooks](https://observablehq.com/@levarez/unep-pollution-health-data)
 
