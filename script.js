(() => {

    const nutrients = ["cal", "protein", "carbs", "fat"];

    const state = {
        meal: {
            amount: 0,
            cal: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            getRatio: function(type){
                return this[type] / this.amount;
            },
            add: function(data){
                for (type of ["amount", ...nutrients]){
                    this[type] += parseInt(data[type]);
                }
            },
            remove: function(target){
                const data = JSON.parse(target.attr("data-json"));
                for (type of ["amount", ...nutrients]){
                    this[type] -= parseInt(data[type]);
                }
            }
        },
        update: {
            isActive: false,
            pointer: {},
            data: {},
            init: function(item){
                this.isActive = true;
                this.pointer = item;
                this.data = JSON.parse(item.attr("data-json"));
            },
            resolve: function(){
                this.isActive = false;
                this.pointer = {};
                this.data = {};
            }
        }
    };

    const DOM = {
        ingredientsList: $("#ingredients-list"),
        form: {
            modal: $("form"),
            inputs: {
                updateTotal: function(type, value, amount){
                    const ans = (value / 100) * amount;
                    this[type].val(parseFloat(ans).toFixed(2));
                },
                updatePercent: function(type, value, amount){
                    const ans = (value / amount) * 100;
                    this[type + "-100"].val(parseFloat(ans).toFixed(2));
                },
                updateTable: function(target){
                    if (target.name === "amount"){
                        for (type of nutrients){
                            this.updateTotal(type, this[type + "-100"].val(), target.value);
                        }
                    } 
                    else if (target.required){
                        this.updatePercent(target.name, target.value, this.amount.val());
                    }
                    else {
                        this.updateTotal(target.name.slice(0,-4), target.value, this.amount.val())
                    }
                }
            },
            open: function(){
                this.modal.removeClass("hidden");
                this.inputs.name.focus();
            },
            close: function(){
                this.modal.addClass("hidden");
                this.modal.trigger("reset");
            },
            editItem: function(item){
                this.inputs.name.val(item.name);
                this.inputs.amount.val(item.amount);
                for (type of nutrients){
                    this.inputs[type].val(item[type]);
                    this.inputs[type].trigger("change");
                }
                this.open();
            }
        },
        totalDisplay: {
            section: $("#total-meal-display"),
            data: {}
        }
    };

    DOM.form.fieldset = DOM.form.modal.children("fieldset")
    DOM.form.fieldset.find("input").each( function(){
        if (this.name != "") {
            DOM.form.inputs[this.name] = $(this);
        }
    });

    DOM.totalDisplay.pieChart = DOM.totalDisplay.section.children(".pie-chart");
    DOM.totalDisplay.section.find("i, span, input").each( function(){
        DOM.totalDisplay.data[this.id] = $(this);
    });

    const createIngredientListItem = (ingredient) => {
        const { name, amount, cal, protein, carbs, fat } = ingredient;
        return `
            <li class="ingredient flexed frame" title="${name}" 
                data-json='${JSON.stringify(ingredient)}'>
                <header> 
                    ${name} (${amount}<sub>g</sub>)<hr/>
                    <small>
                        Cal: ${cal} | 
                        Protein: ${protein} | 
                        Carbs: ${carbs} | 
                        Fat: ${fat}
                    </small>
                </header>
                <nav>
                    <i title="edit"></i>
                    <i title="delete"></i>
                </nav>
            </li>`
    };

    const getData = () => {
        const data = {
            name: DOM.form.inputs.name.val(),
            amount: DOM.form.inputs.amount.val()
        }
        for (type of nutrients) data[type] = DOM.form.inputs[type].val();
        return data;
    };

    const updateMealDisplay = () => {
        const display=  DOM.totalDisplay.data,
            data = state.meal;
        const portion = display.portion.val();
        for (type of nutrients){
            display["total-"+type].text(Math.round(data.getRatio(type) * portion));
            if (type !== "cal") {
                const percent = Math.round(data.getRatio(type) * 100) + "%";
                display[type+"-%"].text(percent);
            };
        }
    };

    DOM.totalDisplay.data.portion.change(updateMealDisplay);

    DOM.ingredientsList.parent().click((e) => {
        const target = e.target;
        switch (target.title) {
            case "add":
                DOM.form.open();
                break;
            case "edit":
                state.update.init($(target).closest("li"));
                DOM.form.editItem(state.update.data);
                break;
            case "delete":
                const item = $(target).closest("li");
                state.meal.remove(item);
                item.remove();
                updateMealDisplay();
                break;  
        }
    });

    DOM.form.fieldset.children("table").change((e) => {
        DOM.form.inputs.updateTable(e.target);
    });

    DOM.form.modal.submit(() => {
        const data = getData();
        const listItem = createIngredientListItem(data);
        if (state.update.isActive){
            state.meal.remove(state.update.pointer);
            state.update.pointer.replaceWith(listItem);
            state.update.resolve();
        } else {
            DOM.ingredientsList.append(listItem);
        }
        state.meal.add(data);
        updateMealDisplay();
        DOM.form.close();
    });

    DOM.form.inputs.cancel.click(() => DOM.form.close());

})();