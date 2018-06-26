[![Build Status](https://travis-ci.org/kgamer007/08-09-http-routing-rest.svg?branch=master)](https://travis-ci.org/kgamer007/08-09-http-routing-rest)

![cf](https://i.imgur.com/7v5ASc8.png)    
# Lab 08: Vanilla REST API w/ Routing and In Memory Persistence

## Heroku deployed version
https://lab-08-test.herokuapp.com/

## Resource: Cats
I picked cats as my resource for this following lab. The cats have these properties.

```
Cats {
  _id: a unique id that is created on instantiation
  title: string (optional)
  content: string (optional)
  weight: string (optional)
  age: string (optional)
  color: string (optional)
}
```
## API Endpoints
POST api/v1/cat
```
  // example post request body
  request.body: {
  title: 'test title',
  content: 'test content',
  age: 'test age',
  weight: 'test weight', 
  color: 'test color',
}
```
GET api/v1/cat?id={body_id}

//example of query string #111
```
 api/v1/cat?id=111
```

DELETE api/v1/cat?id={body_id}

//example of deleting with query string

```
api/v1/cat?id=111
```
