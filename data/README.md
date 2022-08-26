# Data Description
The UNEP Pollution Dashboard displays the global state of air pollution, major sources, the impact on human health, and national efforts to tackle this critical issue. The dashboard shows different sets of data:

* Data for PM2.5 exposure and attributable deaths comes from [Global Burden of Disease Study 2019](https://vizhub.healthdata.org/gbd-results/). Source: Institute for Health Metrics and Evaluation (IHME), 2020. The IHME is an independent global health research center at the University of Washington. 
* Data for sectors breakdown comes from McDuffie, E.E., Martin, R.V., Spadaro, J.V. et al. [Source sector and fuel contributions to ambient PM2.5 and attributable mortality across multiple spatial scales](https://www.nature.com/articles/s41467-021-23853-y) Nat Commun 12, 3594 (2021)
 -  Data for the sector section was reaggregated from country data into UNEP regions, which are different from the ones used in the study.
* Data for policy implementations comes from [Actions on Air Quality: A Global Summary of Policies and Programmes to Reduce Air Pollution](https://www.unep.org/resources/report/actions-air-quality-global-summary-policies-and-programmes-reduce-air-pollution). Source: UNEP, 2021. 
<em>The boundaries and names shown, and the designations used on these maps, do not imply official endorsement or acceptance by the United Nations.</em>
* [Ambient particulate matter pollution exposure summary estimates](https://ghdx.healthdata.org/sites/default/files/record-attached-files/IHME_GBD_2019_AIR_POLLUTION_1990_2019_PM.zip)
* [Total deaths and deaths per 100,000 people attributable to ambient particulate matter pullution](https://vizhub.healthdata.org/gbd-results?params=gbd-api-2019-permalink/6e3468190433cfde61c4d81616db6945) (You need to register)
* [Percent of deaths from a selected set of illnesses attributable to ambient particulate matter pullution](https://vizhub.healthdata.org/gbd-results/?params=gbd-api-2019-permalink/0e754a60c0fefcbbe6801c994e9ab274) (You need to register)

TK TK Links to methodologies on the resources themselves

# Codebook
TK TK For exposure:
| :variable_name | :description                                                                                 |
|----------------|----------------------------------------------------------------------------------------------|
| TK TK          | TK TK                                                                                        |

TK TK For total deaths 'Health impacts' section:
| :variable_name | :description                                                                                 |
|----------------|----------------------------------------------------------------------------------------------|
| TK TK          | TK TK                                                                                        |

TK TK For 'Health impacts' by disease:

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

Residential pollution, mostly from cooking, heating and generating electricity for our homes, is the main human-made source of fine particles globally while windblown dust is a major source in much of Africa and West Asia.
[Data for sectors and regions was filtred](https://docs.google.com/spreadsheets/d/1riat7SmYFjJ8IHVrxD3BjcqEqZA7CM-T321Z_IBscxI/edit#gid=0) from this source: AQ Actions Report - Country Data (Survey_06 July 2022)],(https://docs.google.com/spreadsheets/d/1r89KtMNU6ffW9bthFZLjkSjZ2-GqIz5X/edit#gid=275222536)   

| :variable_name | :description                                                                                 |
|----------------|----------------------------------------------------------------------------------------------|
| ind-1          | INDUSTRY- Clean production incentives                                                        |
| tra-1          | TRANSPORT- Vehicle emission standards                                                        |
| tra-2          | TRANSPORT- Fuel Sulphur content                                                              |
| waste-1        | WASTE- Solid Waste Burning                                                                   |
| res-1          | RESIDENTIAL (HOUSEHOLD AIR POLLUTION). Number of countries that promote use of clean energy  |
|                | in households for cooking and heating.                                                       |
| agri-1         | AGRICULTURE- Sustainable agricultural practices                                              |
| aqms-1         | AIR QUALITY MANAGEMENT STRATEGIES (AQMS)- Countries with an AQMS, framework or plan of action|                                 
| aqm-1          | AIR QUALITY MONITORING                                                |  
| aq-1           | AIR QUALITY STANDARDS                                               |
                                                 |
## Minor data transformations
 
TK TK Links to ObservableHQ notebooks
