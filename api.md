## Route

|HTTP Method|URL|POST Body|Reselt|
|---|---|---|---|
|POST|/users|JSON String|新增一位使用者|
|GET|/users/?id|empty|取得用戶資料|
|PUT|/users/:id|none|更新用戶資料|
|DELETE|/users/
|POST|/login|JSON String|加入 Token|
|GET|/logout|empty|刪除 Token|

## Add a user

To add a user, you have to POST user's information in JSON format.

Acceptable field:
- **Email**
- **Password**
- **Name**
- **Gender**
- **Birthday**
- Phone Number

The blod items are required, if one of them is null, server will return an error message.
`gender` has only two option: `male` and `female`.
`Birth` field has to use [Date][1] Format.


Example:

```json
{
  "username": "chunyu",
  "email": "junyussh@gmail.com",
  "password": "user12345",
  "name": "Chun Yu Chen",
  "gender": "male",
  "birth": "2000-08-15T16:00:00.000Z",
  "phone": "0987987487"
}
```

## Login

Send an JSON Object to server.

```json
{
  "username": "user",
  "password": "12345"
}
```
## 
[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/
