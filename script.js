(() => {

    const nutrients = ["cal", "protein", "carbs", "fat"];

    const state = {
        ingredientsList: [],
        counter: 0
    };

    const DOM = {
        form: {
            modal: $("form"),
            inputs: {
                updateTotal: function(type, value, amount){
                    const ans = (value / 100) * amount;
                    console.log(type);
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
            }
        }
    }

    DOM.form.fieldset = DOM.form.modal.children("fieldset")
    DOM.form.fieldset.find("input").each( function(){
        if (this.name != "") {
            DOM.form.inputs[this.name] = $(this);
        }
    });

    const openModal = () => {
        DOM.form.modal.removeClass("hidden");
        DOM.form.inputs["name"].focus();
    };

    const closeModal = () => {
        DOM.form.modal.addClass("hidden");
        DOM.form.modal[0].reset();
    };

    $("#add-new-btn").click(openModal);

    DOM.form.fieldset.children("table").change((e) => {
        DOM.form.inputs.updateTable(e.target);
    });

    DOM.form.modal.submit(() => {
        addNewIngredient();
        closeModal();
    });

    DOM.form.inputs.cancel.click(closeModal);

})()