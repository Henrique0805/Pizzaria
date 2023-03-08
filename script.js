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
pizzaJson.forEach((item, index)=>{
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
            if(sizeIndex == 1) {
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
    selector('.pizzaInfo--actualPrice').removeAttribute('data-preco');
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
        updatePizzaPrice(sizeIndex);
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
    selector('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        selector('aside').classList.add('show');
        selector('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id;
            });

            let cartItem = selector('.models .cart--item').cloneNode(true);
            let pizzaSizeName = '';
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    subtotal += (pizzaItem.price/2) * cart[i].qtd;
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    subtotal += pizzaItem.price * cart[i].qtd;
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    subtotal += (pizzaItem.price * 1.5) * cart[i].qtd;
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if(cart[i].qtd > 1) {
                    cart[i].qtd--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                cart[i].qtd++;
                updateCart();
            });

            selector('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        selector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        selector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        selector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        selector('aside').classList.remove('show');
    }
}
function updatePizzaPrice(sizeIndex) {
    let preco = selector('.pizzaInfo--actualPrice');
    let dataPreco = preco.getAttribute('data-preco');
    if(dataPreco == null) {
        preco.setAttribute('data-preco', preco.innerHTML);
    }

    let novoPreco = 0;
    let precoDefault = 0;
    let array = [];
    
    switch(sizeIndex) {
        case 0:
            array = preco.getAttribute('data-preco').split(' ');
            precoDefault = parseFloat(array[1]);
            novoPreco = precoDefault / 2;
            selector('.pizzaInfo--actualPrice').innerHTML = `R$ ${novoPreco.toFixed(2)}`;
            break;
        case 1:
            array = preco.getAttribute('data-preco').split(' ');
            precoDefault = parseFloat(array[1]);
            novoPreco = precoDefault;
            selector('.pizzaInfo--actualPrice').innerHTML = `R$ ${novoPreco.toFixed(2)}`;
            break;
        case 2:
            array = preco.getAttribute('data-preco').split(' ');
            precoDefault = parseFloat(array[1]);
            novoPreco = precoDefault * 1.5;
            selector('.pizzaInfo--actualPrice').innerHTML = `R$ ${novoPreco.toFixed(2)}`;
            break;
    }
}