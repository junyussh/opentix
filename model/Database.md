# Database Model

## Users

### User Information Model

Example:

```json
{  
  "_id": "",
  "email" : "junyussh@gmail.com",
  "password" : "3c4faa9ad3c5fd6aad0d535ffd879679bd71de2b9a0b04cec08d957650e73d49",
  "name" : "Chun Yu",
  "gender" : "male",
  "birth" : "2000-08-15T16:00:00.000Z",
  "type" : "admin",
  "phone": "0987987487",
  "register_date" : "2017-04-27T16:00:00.000Z",
  "last_date" : "2017-04-27T16:00:00.000Z",
}
```

## Ticket

```json
{
  "_id": "",
  "name": "Coldplay 世界巡迴演唱會台灣場",
  "description": "Coldplay first live at Taiwan",
  "location": "高鐵桃園站",
  "status": "active",
  "start_at": "2017-03-20T15:56:14.032Z",
  "end_at": "2017-03-20T15:56:14.032Z",
  "from": "2017-03-20T15:56:14.032Z",
  "to": "2017-03-20T15:56:14.032Z",
  "field": ,
  "types": {
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
  },
  "order": [
    {"_id": "", "username": "", "type": {"ordinary": 10, "elder": 5}, "fee": 9487, "status": "", "order_at": "2017-03-20T15:56:14.032Z"}
  ]
}
```
