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

const contenedor = require('./src/contenedorProd')

io.on("connection", async(socket)=>{
    console.log("Un cliente se ha conectado")

    const productos = await contenedor.getAll()
    socket.emit('products', productos)

    socket.on('newProduct', (product)=>{
        contenedor.save(product)
    })

    socket.on('deleteProduct', (id)=>{
        contenedor.deleteId(id)
    })

})


const PORT = process.env.PORT || 8080
server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})