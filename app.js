const express = require("express");
const { randomUUID } = require("crypto");
const { request } = require("http");
const { response } = require("express");
const fs = require("fs");

const app = express();

app.use (express.json());

/*app.get("/primeira-rota", (request, response) => {
    return response.json({
        message: "Acessou a primeira rota"
    })
});*/

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    }
    else {
        products = JSON.parse(data);
    }
})

// POST => INSERIR UM DADO
// GET => BUSCAR UM DADO
// PUT => ALTERAR UM DADO
// DELETE => DELETAR UM DADO

// BODY => SEMPRE QUE QUISER ENVIAR DADOS PARA APLICAÇÃO
 

app.post("/products", (request, response) => {
    //nome e preço => name and price

    const {name , price } = request.body;

    const product = {
        name,
        price,
        id: randomUUID(),
    }

    products.push(product);

    productFile ()

    return response.json(product);
});

app.get("/products", (request , response) => {
    return response.json(products)
});

app.get("/products/:id", (request , response) => {
    const { id } = request.params;
    const product = products.find(product => product.id === id);
    return response.json(product)
})

app.put("/products/:id", (request , response) => {
    const { id } = request.params;
    const {name , price } = request.body;


    const productIndex = products.findIndex(product => product.id === id);
    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    }

    productFile ();

    return response.json({message: "Produto alterado com sucesso"})
});

app.delete("/products/:id", (request , response) => {
    const { id } = request.params;

    const productIndex = products.findIndex(product => product.id === id);

    products.splice(productIndex, 1);

    productFile ();

    return response.json({message: "Produto removido com sucesso"})

});

function productFile() {
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
if(err) {
    console.log(err);
}
else{
    console.log("Produto inserido");
}
});
}


app.listen(4002, () => console.log ("Servidor está rodando na porta 4002"));