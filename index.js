const express = require('express');
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/test', ['inventory'])
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// use templates
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => res.send('Hello World!'));




app.get('/inventory', (req, res) => {
    db.inventory.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('inventory', {elements: docs})
        }
    })
})

app.get('/inventory/:id', (req, res) => {

    let id= req.params.id
    db.collection('inventory').remove({_id: mongojs.ObjectId(id)})
    res.redirect('/inventory')
})
app.get('/edit/:id', (req, res) =>{
    db.collection('inventory').findOne({_id: mongojs.ObjectID(req.params.id)}, (err,doc)=>{
        if (err) throw err
        res.render('edit',{element:doc})
    })
})


app.post('/edit/:id', (req, res) => {

    let sartzeko= {
        'item': req.body.nombre,
        'qty': req.body.qty,
        'size':JSON.parse(req.body.size),
        'status': req.body.status
    }

    db.collection('inventory').findAndModify({
        query: { _id: mongojs.ObjectID(req.params.id) },
        update: { $set: sartzeko },
        new: true
    }, function (err, doc, lastErrorObject) {
        if(err) throw err
        res.redirect('/inventory')
    })


})

app.get("/crear", (req,res)=>{
    res.render('crear')
    }
)

app.post('/crear', (req, res) => {
    console.log(req.body.size)
    let sartzeko= {
        'item': req.body.nombre,
        'qty': req.body.qty,
        'size':JSON.parse(req.body.size),
        'status': req.body.status
    }
    db.collection('inventory').insert(sartzeko)
    res.redirect('inventory')
})



//
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
