|HTTP Method|URL|POST Body|Reselt|
|---|---|---|---|
|POST|/users|JSON String|新增一位使用者|
|GET|/users/:id|empty|取得用戶資料|
|PUT|/users/:id|none|更新用戶資料|
|POST|/login|JSON String|加入 Token|
|GET|/logout|empty|刪除 Token|

## POST data

```json
{
  "username": "chunyu",
  "email": "junyussh@gmail.com",
  "password": "user12345",
  "name": "Chun Yu Chen",
  "gender": "male",
  "birth": "2000-08-15T16:00:00.000Z"
}
```
