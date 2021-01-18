## Customer
Endpoint: `/customer`      
Method: `get`  
Require User Login: `false`  


1.没有登录时`data`为返回空对象 `{}`


**Returns**

| field | type | notes |  
| :------------ |:---------------:| -----:|
| id | integer | 用户id |
| identity | string | 国际区号-手机号 | 
| name | string | 用户名 |
| avatar_url | string | 头像链接 |
