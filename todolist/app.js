const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const date = require(__dirname + '/date.js')

const app = express();

mongoose.connect("mongodb+srv://ahmadazzhari:Mongozari12@cluster0.wnybplq.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema ({
  name: String
})

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist"
})
const item2 = new Item({
  name: "Hit the + button to add a new item"
})
const item3 = new Item({
  name: "<-- hit this to delete an item"
})

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

const defaultItems = [item1, item2, item3];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {

    Item.find({}, (error, foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Successfully saved default items to DB")
          }
        })
        res.redirect("/");
      } else {
        res.render('list', {listTitles: "Today", newLists: foundItems});
      }

      
    })

});

app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  
  List.findOne({name: customListName}, (error, foundList) => {
    if (!error) {
      if (!foundList) {
        //Create a list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();

        res.redirect('/'+ customListName);
      } else {
        //Show list
        res.render('list', {listTitles: foundList.name, newLists: foundList.items});
      }
    }
  })

  

})

app.post('/', (req, res) => {
  const itemName = req.body.newLists;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  })

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (error, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect('/' + listName);
    })
  }
})

app.post('/delete', (req, res) => {
  const checkItemId = req.body.checkBox;
  const listName = req.body.listName;

  if (listName === "Today") {
      Item.findByIdAndRemove(checkItemId, (error) => {
        if (!error) {
          console.log("Successfully deleted checked item");
          res.redirect("/");
        }
      })
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkItemId}}}, (error) => {
      if (!error) {
        console.log("Successfully deleted checked item");
        res.redirect('/' + listName);
      }
    })
  }
 
})

app.get('/work', (req, res) => {
  res.render('list', {listTitles: 'Work List', newLists: workLists})
})

app.get('/about', (req, res) => {
  res.render('about');
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
  console.log(`Server started successfully on port`);
});
