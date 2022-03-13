(() => {

    const state = {
        ingredientsList: [],
        counter: 0
    };

    const modal = $("form");
    const fieldset = modal.children("fieldset")
    const table = fieldset.children("table");
    const form = table.find("input");
    const ingredientName = fieldset.children("#i-name");

    const currInputs = {};
    for (i in form) {
        if (form[i].required){
            currInputs[form[i].name] = $(form[i]);
        };
    };

    const openModal = () => {
        modal.removeClass("hidden");
        ingredientName.focus();
    };

    const closeModal = () => {
        modal.addClass("hidden");
        modal[0].reset();
    };

    const addNewIngredient = () => {
        const newIngredient = {
            id: state.counter,
            name: ingredientName.val()
        };
        for (i in currInputs){
            if (currInputs[i][0].required){
                newIngredient[i] = currInputs[i].val();
            }
        }
        state.ingredientsList.push(newIngredient);
        state.counter++;
        console.log(state);
    }

    const calcPercent = (part, total) => Math.round((part / total) * 100);

    const calcPartofTotal = (percent = 0, total) => Math.round((percent / 100) * total);

    const getPrevCell = (target) => target.parent().prev().children().first();

    const getNextCell = (target) => target.parent().next().children().first();

    const updatePrev = (target, total) => {
        getPrevCell(target).val(calcPercent(target.val(), total));
    }

    const updateNext = (target, total) => {
        getNextCell(target).val(calcPartofTotal(target.val(), total));
    }

    const updateTable = (total) => {
        const resCal = calcPartofTotal(getPrevCell(currInputs.cal).val(), total),
              resProtein = calcPartofTotal(getPrevCell(currInputs.protein).val(), total),
              resCarbs = calcPartofTotal(getPrevCell(currInputs.carbs).val(), total),
              resFat = calcPartofTotal(getPrevCell(currInputs.fat).val(), total);
        currInputs.cal.val(resCal);
        currInputs.protein.val(resProtein);
        currInputs.carbs.val(resCarbs);
        currInputs.fat.val(resFat);
    }

    $("#add-new-btn").click(openModal);

    table.change((e) => {
        console.log("event");
        const target = e.target;
        const amount = currInputs.amount.val();
        if (target.name === "amount") updateTable(amount);
        else if (target.required) updatePrev($(target), amount);
        else updateNext($(target), amount);
    });

    modal.submit(() => {
        addNewIngredient();
        closeModal();
    });

    fieldset.children("#cancel-btn").click(closeModal);


})()