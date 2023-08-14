const fs = require('fs')
class Contenedor{
    constructor(archivo){
        this.archivo = archivo
    }
    async save(objetoNuevo){
        try{
            const objetos = await this.objetosEnArchivo()
            const ultimoId = objetos.length > 0 ? objetos[objetos.length-1].id : 0
            const nuevoId = ultimoId + 1
            const nuevoObjeto = {id: nuevoId, ...objetoNuevo}
            objetos.push(nuevoObjeto)
            await this.guardarObjetos(objetos)
            return nuevoId
        }catch(error){
            console.log("Error al guardar el nuevo objeto", error)
        }
    }
    async getById(id){
        try{    
            const objetos = await this.objetosEnArchivo()
            const objetoBuscado = objetos.find( (objeto)=>objeto.id === id)
            return objetoBuscado || null
        }catch(error){
            console.log("Error al obtener el ID", error)
        }
    }

    async modifyById(id, modificaciones){
        try{
            const objetos = await this.objetosEnArchivo()
            const productIndex = objetos.findIndex((product) => product.id === id)
            objetos[productIndex] = {
                ...objetos[productIndex],
                ...modificaciones
            }
            await this.guardarObjetos(objetos)
            return objetos[productIndex] || null
        }catch(error){
            console.log("Error al modificar el producto", error)
        }
    }

    async getAll(){
        try{
            const objetos = await this.objetosEnArchivo()
            return objetos
        }catch(error){
            console.log("Error al obtener los objetos", error)
        }
    }
    async deleteId(id){
        try{
            let objetos = await this.objetosEnArchivo()
            objetos = objetos.filter( (objeto)=> objeto.id != id)
            await this.guardarObjetos(objetos)
        }catch(error){
            console.log("Error al eliminar el objeto",error)
        }
    }
    async deleteAll(){
        try{
            await this.guardarObjetos([])
        }catch(error){
            console.log("Error al eliminar todos objetos",error)
        }
    }
    async objetosEnArchivo(){
        try{
            const data = await fs.promises.readFile(this.archivo, 'utf-8')
            return data ? JSON.parse(data): []
        }catch(error){
            return []
        }
    }
    async guardarObjetos(objetos){
        try{
            await fs.promises.writeFile(this.archivo, JSON.stringify(objetos, null, 2))
        }catch(error){
            console.log("Error al guardar los objetos", error)
        }
    }

}


const contenedor = new Contenedor("productos.json")

module.exports = contenedor