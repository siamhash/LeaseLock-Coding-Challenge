
# LeaseLock Coding Challenge

Write a program to consume API responses and create a report. Based on the requirements given. in the test document link is proved below:
https://gist.github.com/sam-perez/2a6760901dea4d8da4987df7752ac2c8



## Tech Stack
NodeJs 16.13.2  


## Run Locally

Clone the project

```bash
  git clone https://github.com/siamhash/LeaseLock-Coding-Challenge/
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the project

```bash
  node index 1,2
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_URL_PROD`


## Demo

![](https://raw.githubusercontent.com/siamhash/LeaseLock-Coding-Challenge/main/readme/assets/ezgif.com-gif-maker.gif)


## About Implementation
The given problems have three level of data which need transformation.  
- Company level data
- Certificates level data
- Properties level data
- Certificates and Properties relationship with each other  
and solved it one by one. Below you will find how each data is mapped from an api to a given schema
```JSON
    {
      company_name: String,
      company_id: String,
      total_units: Number,
      total_certs: Number,
      total_coverage: Number,
      monthly_revenue: Number,
      annual_revenue: Number,
    }
```
| Key             | Value From Api                                                                |
| ----------------- | ------------------------------------------------------------------ |
| company_name | Got data from company api ``` id ``` |
| company_name | Got data from company api ``` name ``` |
| total_units | Got data from property api and counting all the ``` units ``` of all the properties |
| total_certs | Got data from certs api and counting total Number of all the certs |
| total_coverage | Got data by using formula ``` total_certs/total_units ``` |
| monthly_revenue | Got data by counting the monthly revenue of all the properties and sum them together to get total ```monthly_revenue``` |
| annual_revenue | Got data by using the formula ```monthly_revenue * 12``` |

then properties level schema

``` JSON
properties: [
        {
          "property_id": String,
          "certs": Number,
          "units": Number,
          "coverage": Number,
          "monthly_revenue": Number
        }
      ]
```
| Key             | Value From Api                                                                |
| ----------------- | ------------------------------------------------------------------ |
| property_id | Got data from property api ``` id ``` |
| certs | Got data from certs api and than mapping them according to ``` property_id ``` and than counting total |
| units | Got data from property api ``` units ``` |
| total_certs | Got data from certs api and counting total Number of all the certs |
| coverage | Got data by using formula ``` certs/units ``` |
| monthly_revenue | Got data by related cert and checking if ``` PAY_IN_FULL ``` than got value from ``` down_payment/12 ``` if it's ``` INSTALLMENTS ``` tha calculating value using formula ``` installment_payment + monthly_fee ```|

Last data - certs 

```JSON
certs: [
        {
          "product_id": String,
          "amount": Number,
          "percent": Number
        }
      ]
```
| Key             | Value From Api                                                                |
| ----------------- | ------------------------------------------------------------------ |
| product_id | Got data from cert api ``` product_id ``` |
| amount | Got data from certs api by counting total occurance of product in certs |
| percent | calculated percent by using formula ``` (certs_of_that_type * 100) / total_certs ``` |

and at the end mapping all the data togeter.

## Optimizations

I have tried to reduce the time complexity as much as possible through keeping the time complexity of each loop to ```O (n) ``` by using data structures like array, stacks, and hash maps.


## Pros and cons

***Pros*** 
- the data will be mapped according to the information given if the schema is given as described.
- all the error handling will ensure code is reliable.
***Cons*** 
- If there are lot of id's the code, will take time to fetch all the data because each id required to have 3 requests sent to BE. So at a time this code is sending 3 requests.
## Lessons Learned

I have learned how to manipulate data and experimenting with it, and tackling multiple errors during the process.

## License

[MIT](https://choosealicense.com/licenses/mit/)

