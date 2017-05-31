# MongoDB 結構

## UserDB

### Admin

Admin 擁有發行票券的權限。

`ticket.name`、`ticket.start`, `ticket.end`, `ticket.info`, `ticket.type` 裡的所有內容為必填。

```json
{  
  "email" : "junyussh@gmail.com",
  "password" : "3c4faa9ad3c5fd6aad0d535ffd879679bd71de2b9a0b04cec08d957650e73d49",
  "name" : "Chun Yu",
  "gender" : "male",
  "birth" : ISODate("2000-08-15T16:00:00.000Z"),
  "type" : "admin",
  "register_date" : ISODate("2017-04-27T16:00:00.000Z"),
  "register_ip" : "",
  "last_date" : ISODate("2017-04-27T16:00:00.000Z"),
  "last_ip" : "",
  "ticket": [{
    "_id": "94627699",
    "name": "內中高瞻資訊班 NHCS 5th 成果發表會 - 2025",
    "start": ISODate("2017-05-20T15:56:14.032Z"),
    "end": ISODate("2017-05-20T15:56:14.032Z"),
    "info": {
      "time": ISODate("2017-05-20T15:56:14.032Z"),
      "location": "臺北市內湖區文德路218號國際會議聽"
    },
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
          "price": 0
        }
      }
    }]
}
```

## User

```json
{  
  "email" : "abc@gmail.com",
  "password" : "831c237928e6212bedaa4451a514ace3174562f6761f6a157a2fe5082b36e2fb",
  "name" : "Jerry Smith",
  "gender" : "male",
  "birth" : ISODate("1999-07-27T16:00:00.000Z"),
  "telephone" : "0968927773",
  "type" : "user",
  "register_date" : ISODate("2017-04-27T16:00:00.000Z"),
  "register_ip" : "",
  "last_date" : ISODate("2017-04-27T16:00:00.000Z"),
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
