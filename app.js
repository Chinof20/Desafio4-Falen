const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')
const handlebars = require('express-handlebars')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/src/views")
app.set("view engine", "handlebars")
app.use(express.static(path.join(__dirname, '/src/public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req,res)=>{
    res.render("index.hbs")
})

let products = []

io.on("connection", (socket)=>{
    console.log("Un cliente se ha conectado")
    socket.on('newProduct', (product)=>{
        const ultimoId = products.length > 0 ? products[products.length-1].id : 0
        const nuevoId = ultimoId + 1
        const nuevoProducto = {id: nuevoId, ...product}
        products.push(nuevoProducto)
        socket.emit('products', products)
    })

    socket.on('deleteProduct', (id)=>{
        products = products.filter( (product)=> product.id !== Number(id))
        socket.emit('products', products)
    })

})


const PORT = process.env.PORT || 8080
server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})