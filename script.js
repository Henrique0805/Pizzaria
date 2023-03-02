let cart = [];
let modalQtd = 1;
let modalKey = 0;

const selector = (e)=> {
    return document.querySelector(e);
}
const selectorAll = (e)=> {
    return document.querySelectorAll(e);
}

//Listagem das pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem = selector('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQtd = 1;
        modalKey = key;
    
        selector('.pizzaBig img').src = pizzaJson[key].img;
        selector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        selector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        selector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        selector('.pizzaInfo--size.selected').classList.remove('selected');
        selectorAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        selector('.pizzaInfo--qt').innerHTML = modalQtd;

        selector('.pizzaWindowArea').style.opacity = 0;
        selector('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            selector('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        
    });

    selector('.pizza-area').append(pizzaItem);
});

// Eventos do Modal
function closeModal() {
    selector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        selector('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
selectorAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
});
selector('.pizzaInfo--qtmenos').addEventListener('click', () =>{
    if(modalQtd > 1) {
        modalQtd--;
        selector('.pizzaInfo--qt').innerHTML = modalQtd
    }
});
selector('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modalQtd++;
    selector('.pizzaInfo--qt').innerHTML = modalQtd;
});
selectorAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e) => {
        selector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
selector('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let tamanho = parseInt(selector('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identificador = pizzaJson[modalKey].id+'@'+tamanho;
    let key = cart.findIndex((item) => {
        return item.identificador == identificador;
    });
    if(key > -1) {
        cart[key].qtd += modalQtd;
    }else{
        cart.push({
            identificador,
            id:pizzaJson[modalKey].id,
            size:tamanho,
            qtd:modalQtd
        });
    }
    updateCart();
    closeModal();
});

function updateCart() {
    if(cart.length > 0) {
        selector('aside').classList.add('show');
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id;
            });
        }
    }else{
        selector('aside').classList.remove('show');
    }
}