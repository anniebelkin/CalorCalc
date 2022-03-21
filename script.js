(() => {

    const nutrients = ["cal", "protein", "carbs", "fat"];

    const state = {
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
        }
    };

    DOM.form.fieldset = DOM.form.modal.children("fieldset")
    DOM.form.fieldset.find("input").each( function(){
        if (this.name != "") {
            DOM.form.inputs[this.name] = $(this);
        }
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
                $(target).closest("li").remove();
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
            state.update.pointer.replaceWith(listItem);
            state.update.resolve();
        } else {
            DOM.ingredientsList.append(listItem);
        }
        DOM.form.close();
    });

    DOM.form.inputs.cancel.click(() => DOM.form.close());

})();