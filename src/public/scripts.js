const socket = io()

document.getElementById('addProduct').addEventListener('submit', (e)=>{
    e.preventDefault()
    const productInputTitle = document.getElementById('title')
    const productInputPrice = document.getElementById('price')

    const title = productInputTitle.value
    const price = productInputPrice.value

    productInputTitle.value = ""
    productInputPrice.value = ""

    socket.emit('newProduct', {title, price})
})


function viewProducts(id, title, price){
    const productList = document.getElementById('listProducts')
    const productElement = document.createElement('div')
    productElement.innerHTML = `<strong>Producto:</strong> ${title} 
    <strong>Precio:</strong> ${price} 
    <button class="delete" data-id="${id}"> X </button>
    `
    productList.appendChild(productElement)
    const botonDelete = productElement.querySelector('.delete')
    botonDelete.addEventListener('click', ()=>{
        socket.emit('deleteProduct', botonDelete.dataset.id)
    })
}

socket.on('products', (products)=>{
    const productList = document.getElementById('listProducts')
    productList.innerHTML = ""
    products.forEach( (prod)=>{
        viewProducts(prod.id, prod.title, prod.price)
    })
})


