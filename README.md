Scenario.js
===========

A lightweight A/B Testing library for use with MixPanel

<a href="http://slid.es/jacobkelley/scenario-js" target="_blank">View Slide</a>

## Install

```html
<script type="text/javascript" src="mixpanel.js"></script>
<script type="text/javascript" src="scenario.js"></script>
```

## Usage

```javascript
var test = new Scenario('My Test Name')
           .test('Test A')
           .test('Test B')
           .go();

// At a later point
test.complete();
```

## API

* <b>`Scenario( String testName )`</b>: Initializes a new test and returns two functions, `test`, and `go`.
* <b>`test([, String testName, Int weight, Function fn] )`</b>: Adds a test variant. `testName` is the name of the variant, `weight` is the tests weight (compared to the default `1`), and `fn`, a function, may be passed in that will execute if the test case is chosen. In addition, the `body` has the test cases name added to it in the form of a slug, so `"Test Case A"` will be added to the body as `"test-case-a"`. <br />It is useful to note that the order of parameters do not matter.
* <b>`go()`</b>: Rolls the dice and calls one of the variants. Returns the instance based method(s) `complete`.
* <b>`complete(Function fn)`</b>: Finishes the test sequence. An optional function may be passed as a mixpanel callback. Good for delaying links so he mixpanel call may finish before the page changes.


## Creating the Funnel

Navigate to MixPanel and click Funnels. Create a funnel that includes the testName Start and testName Finish, then click `Save`.

<img src="http://i.imgur.com/PvazGJc.png">

## Practical Examples

```javascript
var test = new Scenario( 'Homepage Signup Conversions' )
           .test( 'Home V1', 10 ) // Test weight is 10/15, or 66%
           .test( 'Home V2', 5 ) // Test weight is 5/15, or 33%
           .go();

signup.on('click', function(){
    test.complete();
});
```

This results in the body tag being appended with a css class like the following:

```html
<body class="home-v1">
```

Alternatively, you can handle your test differences with JavaScript:

```javascript
var test = new Scenario( 'Homepage Signup Conversions' )
           .test( 'Home V1', function(info){
               // Do something optional
               // `info` contains information about the chosen test, including weights and odds
           })
           .test( 'Home V2', function(info){
               // Do something optional
               // `info` contains information about the chosen test, including weights and odds
           })
           .go();

signup.on('click', function(){
    test.complete(fn);
});
```


## Licensing
MIT
Copyright (c) 2013 Maker Studios

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
