const fs=require('fs');
const http=require('http');
const url=require('url');

//File
const jsonData= fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(jsonData);

//Template
const tempOverview = fs.readFileSync(`${__dirname}/templates/template_overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template_card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template_product.html`,'utf-8');

const replaceTemplate = (temp, product) => {
    let output=temp.replace=(/{%PRODUCT_NAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NURIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic)
        output = output.replace(/{%NOT_ORGANIC%}/g, `not-organic`);
    
    return output;
}

//Server

const server= http.createServer((req,res)=>{
    
    const {query,pathname} = url.parse(req.url,true);

    //Home
    if(pathname === '/'){
        const cardHTML = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        tempOverview.replace('{%PRODUCT_CARD%}',cardHTML);
        res.writeHead(200,{
            'Content-type' : 'text/html'
        });
        res.end(tempOverview);
        
    }
    
    else if(pathname === '/overview'){
        //Overview
        res.writeHead(200,{
            'Content-type' : 'text/html'
        });
        res.end(jsonData);
    }else if(pathname === '/product'){
        //product
        const product = dataObj[query.id];
        const output= replaceTemplate(tempProduct,product);
        res.writeHead(300,{
            'Content-type' : 'text/html'
        });
        res.end(output);
        
        
    }else if(pathname == '/api'){
        //api
        res.writeHead(200,{
            'Content-Type' : 'application/json'
        });
        res.end(jsonData);
    }else{
        res.writeHead(404,{
            'Content-Type' : 'text/html'
        });
        res.end('<h1>Not Page Found</h1>');
    }
})

server.listen(8000,'127.0.0.1',()=>{
    console.log("Server Listening in port 8000...");
})