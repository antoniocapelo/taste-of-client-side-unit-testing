### A Taste of
# Unit Testing
#### for the Client-side

[@antoniocapelo](http://www.twitter.com/antoniocapelo)

---

## Unit Tests

----

#### Cool, right?
![cool](https://media.giphy.com/media/6htA45chmBJYI/giphy.gif)

----

### Advantages
+ unit tests can serve as a 'code' documentation of your running component (in case of a lack of documentation)
+ they give you more confidence on the code you're pushing to master
    + ensure that we're warned if new features/refactors break the expected behavior

----

### Advantages
+ they enforce you to write more organized code (and testable) code, or else the unit testing proccess is painful
+ they make your source code clearer - sometimes you find out that a certain logic is invalid/useless because you just can't test it

----

### and..
* JavaScript is a dynamically typed language so it comes with almost no help from the compiler - more easier to break if something changes (or if we code it wrong)

----


        // Cannot read property 'length' of undefined

        // undefined is not a function

anyone?

----

### Obstacles
![Obstacle](https://media.giphy.com/media/dbtDDSvWErdf2/giphy.gif)
- it takes time, and we got features to deliver - we have to make space (i.e. give adequate points to US's) on the sprint grooming


----

![Obstacle](http://media.giphy.com/media/R6xi8dXsRhIjK/giphy.gif)
- it can involve some refactoring when begining to test an already existing codebase - start as soon as possible

---


# JS Unit Testing 

----
## Test individually each app component

----

* This means that when testing the component X, each interaction with components Y and Z will be mocked, because:
    * we're not testing the other components behavior, that belongs on Y and Z unit tests
    * we have control on our tests scenarios (component X state)

----

*Rule of thumb*
---
* test the returned value of *'public methods'* and current value of *'public properties'* of the component

---

# Writing Testable JS code

----

##  [Sample app](./demo/example.html)
![Sample App](/img/sample_app.png)


----

## Typical jQuery-ish code

	$(document).ready(function(){
		var listDiv = $('.available'),
		myList      = $('.my-list'),
		itemCount   = getItemCount( '.item' );

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

----

### (Not testable)

----

### Why?

* All logic is hidden inside a ready() function
* CSS classes and jquery selectors sprayed accross the snippet
* anonymous functions harder to test
* (not related with tests) - code harder to reuse and customize

----

## Testability++

----


	function MyListComponent($context) {
		var compClasses = {
			item: 'item'
		};
		var compSelectors = {
			item : '.item',
			component : '.my-list',
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

		initComponent();

		// Public API
		this.addItem = function(text) {
			$component.append(buildItem(text));
			updateItemCount();
		};

		this.getItemCount = getItemCount;

	}

	module.exports = {
		create: function($context, handleAvailableListClick) {
			return new AvailableListComponent($context, handleAvailableListClick);
		}
	};

----

### What happened?

----

By creating the ``MyListComponent`` we can:

* **focus** on what the component should do
* test it **individually**
* quickly **pinpoint** the broken logic spot on future regressions or refactors
* **divide work** when creating the tests (one dev can test just this component while another tests its sibling)

----

* besides that, we:
	* increased **reusability**
	* separated concerns
	* are happier :)

![happier](https://media.giphy.com/media/YVPkjfe2E0XAs/giphy.gif)


----

We can break it down even more (on my current project, we started creating a file for 'business' logic and a file for View logic (which includes more visual Components) for each app module)

----

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
				...
		};

		// delegate click handler
		$component.on('click', handleAvailableListClick);
	}

	module.exports = {
		create: function($context, handleAvailableListClick) {
			return new AvailableListComponent($context, handleAvailableListClick);
		}
	};

----


	// ListChooser Page definition
	function ListChooserPage() {
		var $page = $('#container');

		var myListComponent= MyListComponent.create($page);
		var availableListComponent = AvailableListComponent.create($page, handleAvailableListClick);

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

	ListChooserPage.create();

---

## What to do with this?

----

### Test *AvailableList*  component more easily

----

### At first glance:
* check if it's being correctly initiated:
	* if it finds the items throught the selectors
	* if the ``removeItem`` public method has the expected behavior
* check if the click event delegation is correctly set up
 

----

### Testing the *ListChooserPage* Component:
* check if it initiates correctly
	* if searches (and finds) its selectors
	* if instantiates its dependencies
* if its click handler function is called when clicking its bound element and if it does what's expected:
	* ajax call with certain parameters and on success:
	* call availableComponent ``removeItem``
	* call myListComponent ``addItem``


----

### In the end we realize that
* *List* component became responsible for its internal representational logic + internal jQuery stuff and for wiring up their event handlers - that's what we're going to test
* *Page* component is in charge of the page logic, making ajax calls, setting up the event handler functions, etc - that's what we're going to test


---

## Key Concepts

----

### Test files

Normally all the test cases related to the same part of the app are grouped into the same test file. In our previous example, we'd have 3 test files (one forEach() component).

----

### describe

A ``describe`` is a function that defines a test suite.

----

### spec === test

A spec contains one or more expectations that test the state of the code.
A spec with all true expectations is a passing spec. A spec with one or more false expectations is a failing spec.

----

### What it looks like

	describe("the component/behavior we're testing", function() {
		var myComp;

		beforeEach() {
			myComp = new myComponent();
		}

		it("should return true when getBoolValue is called", function() {
			var fnReturnValue = myComp.getBoolValue();

			expect(fnReturnValue).toBe(true);
		});
	});

----

### Matchers 
#### *helper functions used in expectations*


    .toEqual({yo: true}) // 'strict equal' and more general equals
    .toBeUndefined()
    .toHaveBeenCalled()
    .toBeTruthy() 
    .toContain()
    .toThrow(e)
    .not.to....();

----

### spies
Spies are utilities for stubbing any function and tracking calls to it and all arguments.

A spy only exists in the describe or it block in which it is defined, and will be removed after each spec. 

----


#### how they look like
	it("should call the myComp method", function() {
		spyOn(myComp, 'getBoolValue');
		myComp.methodThatAlsoCallsGetBoolValue();

		expect(myComp.getBoolValue).toHaveBeenCalled();
	});


----

### fixtures
On **AngularJS**, testing is given straight out-of-the-box, the framework itself can detect templates used in directives, **ngMock** module can inject and mock dependencies.

An initial approach is well documented [here](https://docs.angularjs.org/guide/unit-testing).

----

### fixtures
On **jQuery** apps, the dev is more responsible for organizing the code so that it's testable.

Also, for testing components with DOM logic, it's necessary to inject HTML content into the tests so that jQuery has something to run against - **fixtures**.

---

# Tools of the Trade

![Folder Structure](https://media.giphy.com/media/kftafApR3TYcg/giphy.gif)

----

* [Karma](http://karma-runner.github.io/) - 'Spectacular' Test Runner for Javascript
* Test runners
	* [mocha](https://mochajs.org/) - test framework for JS, normally used with:
		* [chai](http://chaijs.com/) - assertion library (stuff lik ``assert``, ``should`` and ``expect``)
		* [sinon](http://sinonjs.org/) - test spies, stubs and mocks
	* [Jasmine](jasmine.github.io) - simpler solution (although less powerfull) gives you a behavior-driven development testing framework + ``expect``, spies, etc in one package

----

* [Karma-Browserify](https://github.com/nikku/karma-browserify) - Karma plugin for testing our browserifiy code (used in this demo)
* [Jasmine-jQuery](https://github.com/velesin/jasmine-jquery) - set of matchers and fixture loaders for jquery
* Reporters
	* [Karma Coverage](https://github.com/karma-runner/karma-coverage) - gives statement, line, function and branch coverage
	* and more...


---

## Let's do some testing, then!
![do it!](https://media.giphy.com/media/87xihBthJ1DkA/giphy.gif)

----

## Testing *ListChooserPage* Component

    describe('ListChooserPage', function () {
        var ListChooserPage = require('../../components/ListChooserPageComponent');
        var listChooser;
        (...)

      beforeEach(function () {
        loadFixtures('listChooserPage.html');
        myList = jasmine.createSpyObj('myList', ['addItem']);
        availableList = jasmine.createSpyObj('availableList', ['removeItem']);
      });

      it('should initiate correctly', function () {
        // should check if the ListChooserPage instantiates its dependencies
        // set up spies
        spyOn(AvailableComponent, 'create');
        spyOn(MyListComponent, 'create');
        var $container = $('#container');

        listChooser = ListChooserPage.create();

        expect(MyListComponent.create).toHaveBeenCalled();
        expect(AvailableComponent.create)
            .toHaveBeenCalledWith($container, listChooser.handleAvailableListClick);
      });

      it('should call endpoint X and on success removeItem from available and addItem do myList', function () {
        spyOn(MyListComponent, 'create').and.callFake(function() {
                return myList;
            });
        spyOn(AvailableComponent, 'create').and.callFake(function() {
            return availableList;
        });
        spyOn($, 'ajax').and.callFake(function() {
            var d = $.Deferred();
            d.resolve({});
            return d.promise();
        });
        var $container = $('#container');

        listChooser = ListChooserPage.create();
        listChooser.handleAvailableListClick();

        expect(myList.addItem).toHaveBeenCalled();
        expect(availableList.removeItem).toHaveBeenCalled();
      });

      it('should call endpoint X and if error should not call any other fn', function () {
          spyOn(MyListComponent, 'create').and.callFake(function() {
                  return myList;
              });
          spyOn(AvailableComponent, 'create').and.callFake(function() {
              return availableList;
          });
          spyOn($, 'ajax').and.callFake(function() {
              var d = $.Deferred();
              d.reject();
              return d.promise();
          });
          var $container = $('#container');

          listChooser = ListChooserPage.create();
          listChooser.handleAvailableListClick();

          expect(myList.addItem).not.toHaveBeenCalled();
          expect(availableList.removeItem).not.toHaveBeenCalled();
      });
    });

----

## Testing *AvailableList* Component

    describe('AvailableComponent', function () {
        var availableList;

        beforeEach(function () {
            loadFixtures('availableListFixture.html');
        });

        it('should initiate correctly', function () {
            // set up spies
            var $context = $('#jasmine-fixtures');
            spyOn($context, 'find').and.callThrough();
            spyOn(AvailableListComponent, 'create').and.callThrough();

            availableList = AvailableListComponent.create($context);
            expect($context.find).toHaveBeenCalledWith('.available');
        });

        it('should call the handleAvailableListClick callback', function () {
            // set up spies
            var handleAvailableListClickSpy = jasmine.createSpy('callback');
            var $context = $('#jasmine-fixtures');
            var $available = $('.available');

            availableList =  AvailableListComponent.create($context, handleAvailableListClickSpy);
            $available.find('li').trigger('click');
            expect(handleAvailableListClickSpy).toHaveBeenCalled();
        });
    });

---

## Typical Setup
### jQuery Project

![Folder Structure](/img/structure.png)

----

### Angular Project

![Folder Structure](/img/structure2.png)

----

### This Demo Project

![Folder Structure](/img/demo_structure.png)

----

#### Entry point: karma.conf.js

        // list of files / patterns to load in the browser
        files: [
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
            'test/fixtures/*.html*',
            'test/**/*-spec.js'
        ],

        // frameworks to use
        frameworks: ['jasmine-jquery','jasmine', 'browserify'],

        // preprocess matching files before serving them to the browser
        preprocessors: {
            'test/**/*.js': [ 'browserify' ]
        },

        plugins: [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-jasmine-jquery',
            'karma-jasmine',
            'karma-browserify'
        ],

----

#### Running tests


        // on package.json
        ...
        "scripts": {
             "test": "./node_modules/.bin/karma start karma.conf.js"
        },

        // on terminal
        npm test

----

### it's flexible
![flexible](https://media.giphy.com/media/D7MPavzY5YsKY/giphy.gif)

----


### Reporting

![Coverage Example](https://raw.githubusercontent.com/martinmicunda/martinmicunda.github.io/master/images/posts/coverage.png)

---


# Questions?

---

## Reference links

* [Introduction To JavaScript Unit Testing](http://www.smashingmagazine.com/2012/06/introduction-to-javascript-unit-testing/)
* [Writing Testable JavaScript](https://www.youtube.com/watch?v=OzjogCFO4Zo)
* [Unit Testing JavaScript Using Jasmine ](http://bittersweetryan.github.io/jasmine-presentation)

---


``git checkout`` [this](https://github.com/antoniocapelo/taste-of-client-side-unit-testing)

![git repo](http://img-comment-lol.9cache.com/media/10cf151a142541505822654970_700wa_0.gif)

Thanks!
