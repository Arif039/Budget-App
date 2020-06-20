
var budgetController = (function () {

	var Expenses = function (id, description, value) {

		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;

	};

	var Income = function (id, description, value) {

		this.id = id;
		this.description = description;
		this.value = value;

	};


	// -------------------Calculate Percentage ---------------

	Expenses.prototype.calcPercentage = function (totalIncome) {

		if (totalIncome > 0) {

			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {

			this.percentage = -1;
		}


	};

	Expenses.prototype.getPercentage = function () {

		return this.percentage;
	};

	// -----------------------------------------------------------

	var allExpenses = [];
	var allIncome = [];
	var totalExpenses = 0;
	var totalIncome = 0;


	var calculateTotal = function (type) {

		var sum = 0;
		data.allItem[type].forEach(function (cur) {

			sum += cur.value;

		});

		data.total[type] = sum;

	};


	var data = {

		allItem: {

			exp: [],
			inc: []
		},

		total: {

			exp: 0,
			inc: 0
		},

		budget: 0,
		percentage: -1


	};

	// -------------

	return {

		addItem: function (type, des, val) {

			var newItem, ID;

			// Create ID
			if (data.allItem[type].length > 0) {

				ID = data.allItem[type][data.allItem[type].length - 1].id + 1;
			} else {

				ID = 0;
			}

			// Create Type based on 'inc' or 'exp'.
			if (type === 'exp') {

				newItem = new Expenses(ID, des, val);
			} else if (type === 'inc') {

				newItem = new Income(ID, des, val);
			}

			// Insert data into data structure.
			data.allItem[type].push(newItem);

			// return newItem
			return newItem;
		},

		// -------------------------

		deleteItem: function (type, id) {

			var ids, index;
			// ids = [2, 4, 6, 8, 10]
			ids = data.allItem[type].map(function (current) {

				return current.id;

			});

			index = ids.indexOf(id);

			if (index !== -1) {

				data.allItem[type].splice(index, 1);
			}

		},

		// ---------------------------

		calculateBudget: function () {

			// 1.Calculate total Income and total Expenses.
			calculateTotal('exp');
			calculateTotal('inc');

			// 2.Calculate Budget: totalIncome - totalExpenses
			data.budget = data.total.inc - data.total.exp;

			// 3.Calculate percentage.
			if (data.total.inc > 0) {
				data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
			} else {
				data.percentage = -1;
			}

		},

		getBudget: function () {

			return {

				budget: data.budget,
				totalinc: data.total.inc,
				totalexp: data.total.exp,
				percentage: data.percentage
			};
		},


		// -------------------Calculate Percentage ---------------

		calculatePercentages: function () {

			data.allItem.exp.forEach(function (cur) {

				cur.calcPercentage(data.total.inc);
			});

		},

		getPercentages: function () {

			var allPerc = data.allItem.exp.map(function (cur) {

				return cur.getPercentage();

			});

			return allPerc;
		},

		// -------------------------------------------------------



		testing: function () {

			console.log(data);
		}
	};


})();





var UIController = (function () {

	var DOMstring = {

		inputType: '.add_type',
		inputDescription: '.add_description',
		inputValue: '.add_value',
		inputBtn: '.add_btn',
		incomeContainer: '.income_list',
		expensesContainer: '.expenses_list',

		// --------------------
		budgetLabel: '.budget_value',
		incomeLabel: '.budget_income--value',
		expenseLabel: '.budget_expenses--value',
		percentageLabel: '.budget_expenses--percentage',
		// -------------------------------

		container: '.container',

		// ------------ExpPercentageLabel -----------------
		ExpensesPercLabel: '.item_percentage',

		// --------------dateLabel------------------------
		dateLabel: '.budget_title--month'



	};



	// ---------------formating Number-------------------

	var formatNumber = function(num, type){

		var numSplit, int, deci, type ;
		/*
			+ or - before number.
			exactly 2 decimal point.
			coma separating the thousands.
		*/

		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');

		int = numSplit[0];

		deci = numSplit[1];

		if(int.length > 3){

			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
		}

		// type === 'exp' ? sign = '-' : sign = '+';

		return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + deci;

		
	};

	// ------------------- nodeListForEach -------------------------------

	var nodeListForEach = function (list, callback) {

		for (var i = 0; i < list.length; i++) {

			callback(list[i], i);
		}
	};

	// -------------------------------------------------------------------------


	return {
		getInput: function () {

			return {
				type: document.querySelector(DOMstring.inputType).value,
				description: document.querySelector(DOMstring.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstring.inputValue).value)
			};
		},

		addListItem: function (obj, type) {

			var html, newHtml;

			// Create HTML string with placeholder.

			if (type === 'inc') {

				element = DOMstring.incomeContainer;

				html = '<div class="item clearfix" id="inc-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete--btn"> <img src="criss-cross.png" alt="criss-cross.png" style="width: 14px;" > </button></div></div></div>';

			} else if (type === 'exp') {

				element = DOMstring.expensesContainer;

				html = '<div div class="item clearfix" id="exp-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_percentage">21%</div><div class="item_delete"><button class="item_delete--btn"> <img src="criss-cross.png" alt="criss-cross.png" style="width: 14px;" > </button></div></div></div>';

			}


			// Replace thr placeholder with actual data.

			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			// Insert the HTML into the DOM.

			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		// ----------------------------------------

		deleteListItem: function (selectorID) {

			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);

		},

		// --------------------------------------

		clearFields: function () {

			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstring.inputDescription + ' , ' + DOMstring.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function (current, index, array) {

				current.value = "";
			});

			fieldsArr[0].focus();
		},

		// ----------------

		displayBudget: function (obj) {

			var type;

			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalinc,'inc') ;
			document.querySelector(DOMstring.expenseLabel).textContent = formatNumber(obj.totalexp, 'exp') ;


			if (obj.percentage > 0) {

				document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstring.percentageLabel).textContent = '---';
			}


		},

		// ---------------


		// --------------Display Percentages------------

		displayPercentages: function(percentages){

			var fields = document.querySelectorAll(DOMstring.ExpensesPercLabel);
			
			
			
			nodeListForEach(fields, function(current, index){

				if(percentages[index] > 0){

					current.textContent = percentages[index] + '%';					
				}else{

					current.textContent = '---';
				}
				
			});
		},

		// ---------------Display Month-------------

		displayMonth: function(){
			
			var now, month, year;

			now = new Date();

			// christnas = new date(2020, 6, 16);

			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			month = now.getMonth();
			year = now.getFullYear();

			document.querySelector(DOMstring.dateLabel).textContent = months[month] + ' ' + year;


		},

		// ---------------------Changed Type-------------------------

		changedTyped: function (){

			var fields = document.querySelectorAll(DOMstring.inputType + ',' + DOMstring.inputDescription + ',' + DOMstring.inputValue);

				
			
				nodeListForEach(fields, function(cur){

					cur.classList.toggle('red-focus');
                    
				});

				document.querySelector(DOMstring.inputBtn).classList.toggle('red,');
                
		},

		// -----------------------------------------------------------


		getDOMstring: function () {
			return DOMstring;
		}

	};

})();

var controller = (function (budgetCtrl, UICtrl) {

	var setupEventListener = function () {

		var DOM = UICtrl.getDOMstring();
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function (event) {

			if (event.keycode === 13 || event.which === 13) {

				ctrlAddItem();
			}
		});

		// --------------------------

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

		// -------------Change Event--------------

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedTyped);

		// ------------------------------------------



	};



	var updateBudget = function () {

		//1.Calculate the Budget.
		budgetCtrl.calculateBudget();

		// 2.return the budget.
		var budget = budgetCtrl.getBudget();

		//3.Display budget in the UI.
		// console.log(budget);
		UICtrl.displayBudget(budget);

	};

	// -----------------updatePercentages--------------

	var updatePercentages = function () {

		// Calculate percentages.
		budgetCtrl.calculatePercentages();

		// 2.Read the percentages from budgetController.
		var percentages = budgetCtrl.getPercentages();

		// 3.Update the UI with the New percentages
		// console.log(percentages);
		UICtrl.displayPercentages(percentages);

	};

	// -------------------------------------------------------------

	var ctrlAddItem = function () {

		var input, newItem;

		//1.Get the field data.

		input = UICtrl.getInput();
		console.log(input);

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

			//2.Add the data to the budget controller.

			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//3.Add the data to the UI.

			UICtrl.addListItem(newItem, input.type);

			// 4.Clear the fields.

			UICtrl.clearFields();

			// 5.Calculate and update Budget
			updateBudget();

			//6. Calculate and Update percentages.
			updatePercentages();

		}

	};

	// --------------------------------------

	ctrlDeleteItem = function (event) {
		var itemID, splitID, type, id;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		console.log(itemID);

		if (itemID) {

			splitID = itemID.split('-');
			console.log(splitID);

			type = splitID[0];
			console.log(type);

			id = parseInt(splitID[1]);
			console.log(id);

			// 1.Delete the item from Data Structure.
			budgetCtrl.deleteItem(type, id);


			// 2.Delete the item from the UI
			UICtrl.deleteListItem(itemID);

			// 3.Update and Show the new budget
			updateBudget();

			//4. Calculate and Update percentages.
			updatePercentages();
		}

	};

	// -----------------------------------------

	return {

		init: function () {

			console.log('App is working');

			UICtrl.displayMonth();
			
			UICtrl.displayBudget({

				budget: 0,
				totalinc: 0,
				totalexp: 0,
				percentage: -1
			});

			setupEventListener();
		}
	};



})(budgetController, UIController);

controller.init();
