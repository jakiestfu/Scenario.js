Scenario
========

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

test.complete();
```

## API

* <b>`Scenario( String testName )`</b>: Initializes a new test and returns two functions, `test`, and `go`.
* <b>`test([, String name, Number weight, Function fn] )`</b>: Adds a test variant. `name` is the name of the variant, `weight` is the tests weight (compared to the default `1`), and `fn`, a function, may be passed in that will execute if the test case is chosen. In addition, the `body` has the test cases name added to it in the form of a slug, so `"Test Case A"` will be added to the body as `"test-case-a"`. <br />It is useful to note that the order of parameters do not matter.
* <b>`go()`</b>: Rolls the dice and calls one of the variants. Returns the instance based method(s) `complete`.
* <b>`complete(Function fn)`</b>: Finishes the test sequence. An optional function may be passed as a mixpanel callback. Good for delaying links so he mixpanel call may finish before the page changes.

## MixPanel Integration
MixPanel is required with Scenario.

Once the `go()` function has been called, the initial tracking event occurs:


Shortly after a test is chosen, a tracking event occurs. This one records the test case used:

```javascript
mixpanel.track("My Test Name Start", {
    test: "Test A"
});
```

Once the `complete()` function has been called, the final tracking occurs: 

```javascript
mixpanel.track( "My Test Name Finish" );
```


## Creating the Funnel

Navigate to MixPanel and click Funnels. Create a funnel that includes the testName Start and testName Finish, then click `Save`.

<img src="http://i.imgur.com/CXZzolm.png">

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
