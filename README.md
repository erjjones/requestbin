#RequestBin

## Getting Started

* `git clone git://github.com/erjjones/requestbin.git`
* Install mongodb 1.8 or newer
* Install nodejs
* Create a `data` folder locally (i.e. d:/requestbin/data)
* Navigate to mongo/bin folder `mongod.exe --dbpath: d:/requestbin/data`
* Run `node app` in the root directory 
* Navigate to [http://localhost:3000/] (http://localhost:3000/)

## Create a bin

Returns a new bin id

### URL
> GET /bin

### Example

> GET http://localhost:3000/bin

> Response
```js
{
    "id": "rgVmI7r"
}
```

## Post to a bin

Returns a posted payload and id of bin

### URL
> POST /{id}

### Example

> POST http://localhost:3000/rgVmI7r

> Request

```js
{
  "customprop1": "value for prop 1"  
}
```

> Response
```js
{
    "id": "rgVmI7r",
    "payload": {
        "customprop1": "value for prop 1"
    }
}
```

## Get Collection of posts from a bin

Returns top 50 post from a bin 

### URL
> GET /{id}

### Example

> GET http://localhost:3000/rgVmI7r

> Response
```js
{
    "posts": [
        {
            "id": "rgVmI7r",
            "payload": "{\"customprop1\":\"value for prop 1\"}",
            "_id": "51599a995d82da7029000001",
            "timestamp": "2013-04-01T14:32:57.000Z"
        }
    ],
    "id": "rgVmI7r"
}
```
