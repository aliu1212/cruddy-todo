const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((error, fileId) => {
    let todoPath = path.join(exports.dataDir, `${fileId}.txt`);
    fs.writeFile(todoPath, text, (err) => {
      if (err) {
        console.log('error creating todo list item ', err);
      } else {
        callback(null, { id: fileId, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {
  let todoList = [];
  fs.readdir(exports.dataDir, (error, files) => {
    if (error) {
      console.log('error getting files from dir', error);
    } else {
      if (files.length === 0) {
        callback(null, []);
      }
      files.forEach((fileId)=>{
        let todoPath = path.join(exports.dataDir, `${fileId}`);
        fs.readFile(todoPath, (error, todoText) => {
          if (error) {
            callback(error);
          } else {
            todoList.push({ id: fileId.slice(0, -4), text: todoText + '' });
            if (todoList.length === files.length) {
              callback(null, todoList);
            }
          }
        });
      });
    }
  });
};

exports.readOne = (id, callback) => {
  let todoPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(todoPath, (error, todoText) => {
    if (error) {
      callback(error);
    } else {
      callback(null, {id: id, text: todoText + '',});
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  let todoPath = path.join(exports.dataDir, `${id}.txt`);
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  fs.readFile(todoPath, (error, todoText) => {
    if (error) {
      callback(error);
    } else {
      fs.writeFile(todoPath, text, (error, todoText) => {
        if (error) {
          callback(error);
        } else {
          callback(null, todoText);
        }
      })
    }
  });

  // fs.writeFile(todoPath, text, (error, todoText) => {
  //   if (error) {
  //     callback(error);
  //   } else {
  //     callback(null, todoText);
  //   }
  // })

};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
