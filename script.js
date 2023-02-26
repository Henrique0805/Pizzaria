const selector = (e)=> {
    return document.querySelector(e);
}
const selectorAll = (e)=> {
    return document.querySelectorAll(e);
}

pizzaJson.map((item, index)=>{
    let pizzaItem = selector('.models .pizza-item').cloneNode(true);

    selector('.pizza-area').append(pizzaItem);
});