Scenario
========

A lightweight A/B Testing library for use with MixPanel


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

* `Scenario( String testName )`: Initializes a new test and returns two functions, `test`, and `go`.
* `test( String name[, function fn] )`: Adds a test variant. `name` is the name of the variant, and an optional function may be passed in the second parameter that will execute if the test case is chosen. In addition, the `body` has the test cases name added to it in the form of a slug, so `"Test Case A"` will be added to the body as `"test-case-a"`
* `go()`: Rolls the dice and calls one of the variants. Returns the instance based method(s) `complete`.
* ================================================
* `complete()`: Finishes the test sequence.

## MixPanel Integration
MixPanel is required with Scenario.

Once the `go()` function has been called, the initial tracking event occurs:

```javascript
mixpanel.track( "My Test Name Load" );
```

Shortly after a test is chosen, another tracking event occurs. This one records the test case used:

```javascript
mixpanel.track("My Test Name", {
    variant: "Test A"
});
```

Once the `complete()` function has been called, the final tracking occurs: 

```javascript
mixpanel.track( "My Test Name Finish" );
```


## Creating the Funnel

Navigate to MixPanel and click Funnels. Create a funnel that includes the testName Load, testName, and testName Finish, then click `Save`.

<img src="http://i.imgur.com/CXZzolm.png">


## Licensing
MIT
