# MongoDB 結構

## User

## Admin

Admin 擁有發行票券的權限。

```
{  
  "email" : "junyussh@gmail.com",
  "password" : "3c4faa9ad3c5fd6aad0d535ffd879679bd71de2b9a0b04cec08d957650e73d49",
  "name" : "Chun Yu",
  "gender" : "male",
  "birth" : "2000-08-16",
  "type" : "admin",
  "register_date" : "2017-04-28",
  "register_ip" : "",
  "last_date" : "2017-04-28",
  "last_ip" : "",
  "ticket": [{
    "_id": "94627699",
    "start": ISODate("2017-05-20T15:56:14.032Z"),
    "end": ISODate("2017-05-20T15:56:14.032Z"),
    "info": {
      "time": ISODate("2017-05-20T15:56:14.032Z")
    }
    "field": [{

      }],
      "type": {
        "ordinary": {
          "quantity": 500,
          "limit": 1,
          "price": 280
        },
        "elder": {
          "quantity": 500,
          "limit": 1,
          "price": 0;
        }
      }
    }]
}
```

## User

```
{  
  "email" : "abc@gmail.com",
  "password" : "831c237928e6212bedaa4451a514ace3174562f6761f6a157a2fe5082b36e2fb",
  "name" : "Jerry Smith",
  "gender" : "male",
  "birth" : "1990-07-28",
  "telephone" : "0968927773",
  "type" : "user",
  "register_date" : "2017-04-28",
  "register_ip" : "",
  "last_date" : "2017-04-28",
  "last_ip" : "",
  "billing" : [
    {
      "_id" : ,
      "serial" : "",
      "orgnization" : "",
      "event" : "",
      "status" : "pending",
      "value" : "200",
      "order_time" : "",
      "custom" : ""
    }
  ]
}
```
