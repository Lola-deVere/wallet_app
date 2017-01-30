
var UIController = (function() {

	var DOMStrings = {
		navAddExpense: 'nav-add-exp',
		navAllTransac: 'nav-all-transac',
		// navBudgetRep: '.nav-budget-rep',
		allTransacDiv: 'all-transactions',
		addExpDiv: 'add_expense',
		expValue: 'exp-value',
		expComment: 'exp-comment',
		expForm: 'exp-form',
		expBtn: 'add-exp-btn',
		allTransacList: '.transactions-list',
		expCategoryList:'.categories'
	};

	var navBar = function(el) {
		var el, divs, visibleDivId;

		el = el;
		divs = [DOMStrings.allTransacDiv, DOMStrings.addExpDiv];
		visibleDivId = null;

		function toggleVisibility() {
			if(visibleDivId === el) {
			} else {
				visibleDivId = el;
			}
				hideNonVisibleDivs();
		}

		function hideNonVisibleDivs() {
			
			var i, divId, div;
			for(i = 0; i < divs.length; i++) {
				el = divs[i];
				div = document.getElementById(el);
				
				if(visibleDivId === el) {
					div.style.display = "block";
				} else {
					div.style.display = "none";
				}
			}
		}
		toggleVisibility();
	}

	function parseCatString(string) {
		var string;

		string = string.replace(/-/g , " ");
		string = string.slice(3);
		
		return string;
	}

	return {
		addListItem: function(obj, type) {
			var html, newHtml, element, category;
			// console.log(obj.category);
			category = parseCatString(obj.category);
			
			if(type === 'exp') {
				element = DOMStrings.allTransacList;
				html = '<li id="exp-%id%"><i class="ion-ios-telephone-outline"></i><div><span class="expense-category">%description%</span><span class="expense-amount">- %value%</span></div></li>'
			} else if (type === 'inc') {
				console.log(obj);
			}
			//Replace the place holder with new text
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', category);
			newHtml = newHtml.replace('%value%', obj.value);

			// NOw insert new text into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		getItemDescription: function(el) {
			var el;

			el = document.getElementById(el);
			
			el.classList.toggle('backgr-red');
			el.classList.toggle('select-category');
			return el;
		},

		clearFields: function() {
			var fields, fieldsArr;

			fields = [document.getElementById(DOMStrings.expValue), document.getElementById(DOMStrings.expComment)];

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(curr, index, array) {
				curr.value = "";
			});

			fieldsArr[0].focus();
		},

		getInputValue: function() {
			var category;

			category = document.querySelector('.select-category').id;

			return {
				value: parseFloat(document.getElementById(DOMStrings.expValue).value),
				comment: document.getElementById(DOMStrings.expComment).value,
				category: category
			};
		},

		getNavBar: function(el) {
			return navBar(el);
		},

		getDOMStrings: function() {
			return DOMStrings;
		}
	};

})();

var budgetController = (function() {

	var Expense = function(id, value, comment, category) {
		this.id = id;
		this.value = value;
		this.comment = comment;
		this.category = category;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		total: {
			exp: 0,
			inc: 0
		}
	}

	return {
		addItem: function(type, value, comment, category) {
			var newItem, ID;

			if(data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			if (type === 'exp') {
				newItem = new Expense(ID, value, comment, category);
			} else if (type === 'inc') {
				console.log('not set up yet');
			}

			data.allItems[type].push(newItem);

			return newItem;
		},

		test: function() {
			console.log(data);
		}
	}

})();

var controller = (function(budgetCtrl, UICtrl) {
	
	var setupEventListners = function() {
		var DOM, form, category; 
		DOM = UICtrl.getDOMStrings();

		var otherEl = document.getElementById(DOM.navAddExpense)
	
		var el = document.getElementById(DOM.navAllTransac);

			el.onclick = handleTransacClick;
			otherEl.onclick = handleExpClick;
			
			function handleExpClick(el) {
				UICtrl.getNavBar(DOM.addExpDiv);
			}

			function handleTransacClick(otherEl) {
				UICtrl.getNavBar(DOM.allTransacDiv);
			}

		//Submit add expense
		form = document.getElementById(DOM.expBtn);
		form.addEventListener('click', ctrlAddItem);
		// form.addEventListener('keypress', function(event) {
		// 	if (event.keyCode === 13 || event.which === 13) {
		// 		ctrlAddItem();
		// 	}
		// });
	}

	var ctrlAddItem = function() {
		var input, newItem;

		input = UICtrl.getInputValue();

		if (input.comment !== "" && !isNaN(input.value) && input.value > 0) {
			newItem = budgetCtrl.addItem('exp', input.value, input.comment, input.category);
			console.log(newItem);
		}

		//Clear input fields
		UICtrl.clearFields();
		//Add item to the UI
		UICtrl.addListItem(newItem, 'exp');
	}

	return {
		init: function() {
			console.log('I control stuff');
			setupEventListners();
		}
	};

})(budgetController, UIController);

window.onload = controller.init();