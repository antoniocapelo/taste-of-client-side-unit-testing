# 1 Intro

## Testing

### Pluses
+ unit tests can serve as a 'code' documentation of your running component (in case of a lack of documentation)
+ they give you more confidence on the code you're pushing to master
    + ensure that we're warned if new features/refactors break the expected behavior
+ they enforce you to write more organized code (and testable) code, or else the unit testing proccess is painfull
+ they make you're source code clearer -> sometimes you find out that a certain logic is invalid/useless because you just can't test it


### Minuses
- it takes time, and we got features to deliver -> we have to make space (i.e. give adequate points to US's) on the sprint grooming
- it can involve some refactoring when begining to test an already existing codebase -> start as soon as possible

 
## Quick mention on BDD?

# Objectives of JS Unit Testing
## Test individually each app component

* This means that when testing the component X, each interaction with components Y and Z will be mocked, because
    * we're not testing the other components behavior, that belongs on Y and Z unit tests
    * we have control on our tests scenarios (component X state)
* test the returned value of 'public' methods and current value of 'public' properties of the component
* JavaScript is a dynamically typed language so it comes with almost no help from the compiler -> more easier to break if something changes (or if we code it wrong)
    ``Cannot read property 'length' of undefined``, ``undefined is not a function``, anyone?

# Writing Testabe JS code
## Typical jQuery-ish code (Not testable)

	$(document).ready(function(){
		var listDiv   = $('.available'),
		myList    = $('.my-list'),
		itemCount = getItemCount( '.item' );

		$(.items-count).html(itemCount);

		listDiv.on('click',function(){
			var $clickedEL = $(this);
			$.ajax(...);
			function onSucces() {
				$clickedEL.remove();
				var $newEl; 
				itemCount+=1;
				$(.items-count).html(itemCount);
				$newEl = $('<li class="item">').text($clickedEL.text());
				myList.append($newEL);
			}
		});

		function getItemCount( selector ){
			return $( selector ).length;
		}
	});

### But why?

* All logic is hidden inside a ready() function
* CSS classes and jquery selectors sprayed accross the snippet
* anonymous functions harder to test
* (not related with tests) -> code harder to reuse and customize

## Testability++
	function MyListComponent($context) {
		var compClasses = {
			item: 'item'
		};

		var compSelectors = {
			component : '.my-list',
			item      : '.item',
			itemCount : 'item-count'
		};

		// Private
		var $component = $context.find(compSelectors.component);

		function initComponent() {
			updateItemCount();
		}

		function updateItemCount() {
			$context.find(compSelectors.itemCount).text(getItemCount());
		}

		function getItemCount() {
			return $context.find(compSelectors.item).length;
		}

		function buildItem(text) {
			return $('<li>').addClass(compClasses.item).text(text);
		}

		// Public API
		this.addItem = function(text) {
			$component.append(buildItem(text));
			updateItemCount();
		};

		this.getItemCount = getItemCount;

		initComponent();
	}

### What happened?
* by creating the ``MyListComponent`` we can:
	* **focus** on what the component should do
	* test it **individually**
	* quickly **pinpoint** the broken logic spot on future refactors
	* **divide work** when creating the tests (one DEV can test just this component while another tests its sibling)

* besides that, we:
	* increased **reusability**
	* separated concerns
	* are happier :)

* Note: we can break it down even more (on NAP Extranet project, we started creating a file for 'business' logic, a file for View logic (which includes more visual Components) for each app module)

### Applying the same logic:

	// Available Component Definition
	function AvailableComponent($context, handleAvailableListClick) {
		var compClasses = {
				...
		};
		var compSelectors = {
				...
		};

		// Private
		var $component = $context.find(compSelectors.component);

		// Public
		this.removeItem = function($item) {
		};

		$component.on('click', handleAvailableListClick);
	}

	// ListChooser Page definition
	function ListChooserPage() {
		var $page = $('#container');

		var myListComponent    = new MyListComponent($page);
		var availableComponent = new AvailableComponent($page, handleAvailableListClick);

	 function handleAvailableListClick() {
				var $clickedEL = $(this);
				$.ajax(...);
				function onSuccess() {
						availableComponent.removItem($clickedEL);
						myListComponent.addItem($clickedEL.text());
				}
		};

		// Public 
		this.handleAvailableListClick = handleAvailableListClick;
	}

new ListChooserPage();

## What to do with this?
### Testing **MyList** more easily, at first glance:
* check if's being correctly initiated:
	* if it finds the items throught the selectors
	* if the ``getItemCount`` public method returns the expected value
* check if the ``addItem`` method currectly builds the item correctly and appends it to the list
 
### (..Same logic on the other component..)

### Testing the **ListChooserPage** Component:
* check if it ınitates correctly
	* if if searches (and finds) it's selector
	* if it instantiates its components
* if its click handler function is called when clicking its bound element and if it does what's expected:
	* ajax call with certain parameters and on success:
	* call availableComponent ``removeItem``
	* call myListComponent ``addItem``

### In the end we realize that
* the **List** components become responsible of their internal representational logic + internal jQuery stuff and of wiring up and delegating their event handlers -> that's what we're going to test
* the **Page** component is in charge of  the page logic, making ajax calls, setting up the event handler functions, etc -> that's what we're going to test

## Key Concepts

Normally all the test cases related to the same part of the app are grouped into the same test file. In our previous example, we'd have 3 specs (one forEach() component).

### describe

A ``describe`` is a function that defines a test suite.

### spec === test

A spec contains one or more expectations that test the state of the code.
A spec with all true expectations is a passing spec. A spec with one or more false expectations is a failing spec.

### What it looks like

	describe("what component/behavior we're testing", function() {
		var myComp;

		beforeEach() {
			myComp = new myComponent();
		}

		it("should return a true value", function() {
			var fnReturnValue = myComp.getBoolValue();

			expect(fnReturnValue).toBe(true);
		});
	});

### Matchers - helper functions used in expectations

* .toBe('result') ; toEqual({yo: true}) // 'strict equal' and more general equals
* .toBeUndefined()
* .toHaveBeenCalled()
* .toBeTruthy() 
* .toContain()
* .toThrow(e)
* **.not**.to....();

### spies
Spies are utilities for stubbing any function and tracking calls to it and all arguments. A spy only exists in the describe or it block in which it is defined, and will be removed after each spec. 


	it("should call the myComp method", function() {
		spyOn(myComp, 'getBoolValue');
		myComp.methodThatAlsoCallsGetBoolValue();

		expect(myComp.getBoolValue).toHaveBeenCalled();
	});


### fixtures
On **AngularJS**, testing is given straight out-of-the-box, the framework itself can detect templates used in directives, **ngMock** module can inject and mock dependencies. An initial approach is well documented [here](https://docs.angularjs.org/guide/unit-testing).

On **jQuery** apps, it's on the DEV responsibility to organize the code so that it's testable. Also, for testing components with DOM logic, it's necessary to inject HTML content into the tests so that jQuery has something to run against -> **fixtures**.

## Tools of the Trade

* [Karma](http://karma-runner.github.io/) - Spectacular Test Runner for Javascript
* Test runnersjjjhhhjj
	* [mocha](https://mochajs.org/) - test framework for JS, normally used with:
		* [chai](http://chaijs.com/) - assertion library (for using ``assert``, ``should`` and ``expect``
		* [sinon](http://sinonjs.org/) - test spies, stubs and mocks
	* [Jasmine](jasmine.github.io) - simpler solution (although less powerfull) gives you a behavior-driven development testing framework + ``expect``, spies, etc in one package
* [Jasmine-jQuery](https://github.com/velesin/jasmine-jquery) - set of matchers and fixture loaders for jquery
* Reporters
	* [Karma Coverage](https://github.com/karma-runner/karma-coverage) - gives statement, line, function and branch coverage
	* and more...

# Let's do some testing, then!

