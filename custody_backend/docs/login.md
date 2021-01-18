## Login Send Code
Endpoint: `/customer/login/send_code`      
Method: `post`  
Require User Login: `false`  
Params  

| field | required | type | notes
| :------------ |:---------------:| -----:| -----:| 
| zone | true | string(16) | example: 86 |
| phone | true | string(64) | example: 15623561234 | 


## Customer Login
Endpoint: `/customer/login`  
Method: `post`  
Require user login: `false`  
Params:   

| field      | required | type | notes |
| :------------ |:---------------:| -----:| -----:|
| zone | true | string(16) | example: 86 |
| phone | true | string(64) | example: 15623561234 | |
| code | true | string(64) | example: `234523` |

Returns:  

| field | type | notes |
| :------------ |:---------------:| -----:|
| access_token | string | You should contain this token in your header if need login. |
| customer_id | string | You need this param when request customer detail. |
| status | string | `new` or `exist`. |
