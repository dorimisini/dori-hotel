//moduler 
var mysql = require('mysql');
// var formidable = require('formidable');
// const path = require('path');



//authentication check
exports.authentication = (req, res, next) => {

   if (req.session.mail != undefined) {
      next();
   }
   else {
      res.render('user/home', { user: "" });
   }
}

// show the home page
exports.getHome = (req, res, next) => {

   if (req.session.mail != undefined) {
      return res.render('user/home', { user: req.session.mail });
   }
   else {
      return res.render('user/home', { user: "" });
   }
}

//show the login page
exports.getLogin = (req, res, next) => {
   res.render('user/loginAccount', { user: "", msg: [], err: [] });
}

//post page of login
exports.postLogin = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });

   data = "SELECT * " +
      "FROM  user " +
      "WHERE email = " + mysql.escape(req.body.mail) +
      " AND password = " + mysql.escape(req.body.pass);


   connectDB.query(data, (err, result) => {
      if (err) throw err; // show if any error have
      else {
         if (result.length) {
            req.session.mail = result[0].email;
            res.render('user/home', {user: result[0].email});
         }
         else {
            res.render('user/loginAccount', { user: "", msg: [], err: ["Please Check Your information again"] });
         }

      }
   })
}


// show create account page
exports.getCreateAccount = (req, res, next) => {
   res.render('user/createAccount', { user: "", msg: [], err: [] })
}

//get data from user for create account
exports.postCreateAccount = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });

   var p1 = req.body.pass;
   var p2 = req.body.con_pass;

   if (p1 != p2) { // if password doesn't match 
      return res.render("user/createAccount", { user: "", msg: [], err: ["Password Doesn't Match"] })
   }

   var data = "INSERT INTO user " +
      " VALUES ( '" + req.body.name + "' ,'" + req.body.mail + "','" + req.body.phone + "','" + p1 + "')";

   connectDB.query(data, (err, result) => {
      if (err) throw err;// if db has error, show that 
      else {
         res.render('user/loginAccount', { user: "", msg: ["Account Create Successfuly"], err: [] }); //show login page
      }
   })
}

//get request for category
exports.getCategory = (req, res, next) => {

   res.render('user/category', { user: req.session.mail });
}

//post request of category
exports.postCategory = (req, res, next) => {
   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });

   data = "SELECT * " +
      " FROM  category " +
      " WHERE name = " + mysql.escape(req.body.cat) +
      " AND type = " + mysql.escape(req.body.type) +
      " AND available > 0";

   connectDB.query(data, (err, result) => {
      if (err) throw err; //show if error found
      else {
         //console.log(result);
         return res.render('user/showCategory', { user: req.session.mail, rooms: result })
      }
   })

}

// get booking data 
exports.postBooking = (req, res, next) => {
   // console.log(req.body);

   res.render('user/bookingConfirm.ejs', { user: req.session.mail, name: req.body.name, type: req.body.type, cost: req.body.cost });
}

//post status request

exports.postStatus = (req, res, next) => {

   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });
   var date = req.body.date;
   //console.log(date)
   data = "INSERT INTO bookingstatus " +
      " VALUES ('" + req.session.mail + "','" + req.body.name + "','" + req.body.type + "','" + req.body.roomWant + "','" + 0 + "','" + date + "')"

   data1 = "SELECT * " +
      " FROM  bookingstatus " +
      " WHERE email = " + mysql.escape(req.session.mail);
      
   connectDB.query(data, (err, reslt) => {
      if (err) throw err;
      else {
         connectDB.query(data1, (err1, result) => {
            for (i in result) {
               var a = result[i].date
               a = a.toString()
               result[i].date = a.slice(0, 15);
            }
            res.render('user/statusShow', { user: req.session.mail, msg: "Your booking is placed", err: "", data: result });
         })
      }
   })
}


//get status
exports.getShowStatus = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });

   data = "SELECT * " +
      " FROM  bookingstatus " +
      " WHERE email = " + mysql.escape(req.session.mail);

   connectDB.query(data, (err, result) => {

      if (err) throw err;
      else {
         for (i in result) {
            var a = result[i].date
            a = a.toString()
            result[i].date = a.slice(0, 15);
         }
         if (result.length < 1) {
            res.render('user/statusShow', { user: req.session.mail, msg: "", err: "You dont have any data", data: result });
         }
         else {
            res.render('user/statusShow', { user: req.session.mail, msg: "", err: "", data: result });
         }
      }
   })
}


//delete booking request
exports.deleteBooking =(req,res,next)=>{
   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });

   data = "DELETE FROM bookingstatus " +
   " WHERE email = " + mysql.escape(req.body.mail) +
   " AND type = " + mysql.escape(req.body.type) +
   " AND category = " + mysql.escape(req.body.cat)+
   " AND roomWant = "+mysql.escape(req.body.want)
  
   connectDB.query(data,(err,result)=>{
      if(err) throw err;
      else{
         next();
      }
   })

}


//show contact page
exports.getContact =(req,res,next)=>{
   if(req.session.mail== undefined){
      res.render('user/contact', { user: "" });
   }
   else{
      res.render('user/contact', { user: req.session.mail });
   }
   
}

//logout
exports.logout = (req, res, next) => {
   req.session.destroy();
   res.render('user/home', { user: "" });

}



////admin here////




//login get request
// exports.getLogin = (req, res, next) => {
//    if (req.session.admin == undefined) {
//        res.render('user/loginAccount', { msg: "", err: "" });
//    }
//    else {
//        var connectDB = mysql.createConnection({
//            host: "localhost",
//            user: "root",
//            password: "",
//            database: "hotel"
//        });
//        data1 = "SELECT * " +
//            "FROM  bookingstatus " +
//            "WHERE status = 0 ";
//        connectDB.query(data1, (err1, result1) => {
//            if (err1) throw err1;
//            else {
//                for (i in result1) {
//                    var a = result1[i].date;
//                    result1[i].date = a.toString().slice(0, 15);
//                }
//               return res.render('admin/index', { msg: "", err: "", data: result1 });
//            }
//        })
//    }

// }

// //login post request
// exports.postLogin = (req, res, next) => {

//    var connectDB = mysql.createConnection({
//        host: "localhost",
//        user: "root",
//        password: "",
//        database: "hotel"
//    });

//    data = "SELECT * " +
//        "FROM admin " +
//        "WHERE name = " + mysql.escape(req.body.name) +
//        "AND pass = " + mysql.escape(req.body.pass);

//    data1 = "SELECT * " +
//        "FROM  bookingstatus " +
//        "WHERE status = 0 ";

//    connectDB.query(data, (err, result) => {
//        if (err) throw err;
//        else {
//            if (result.length) {
//                req.session.admin = result[0].name;
//                connectDB.query(data1, (err1, result1) => {
//                    if (err1) throw err1;
//                    else {
//                        for (i in result1) {
//                            var a = result1[i].date;
//                            result1[i].date = a.toString().slice(0, 15);
//                        }
//                        return res.render('admin/index', { msg: "", err: "", data: result1 });
//                    }
//                })

//            }
//            else {
//                return res.render('admin/login', { msg: "", err: "Please Check Your Information Again" });
//            }
//        }
//    })
// }

// //change booking status
// exports.postChnageStatus = (req, res, next) => {
//    //console.log(req.body);

//    var connectDB = mysql.createConnection({
//        host: "localhost",
//        user: "root",
//        password: "",
//        database: "hotel"
//    });

//    var value = 0;

//    if (req.body.click == "Approve") {
//        value = 1;
//        data = "UPDATE bookingstatus " +
//        " SET  status = " + mysql.escape(value) +
//        " WHERE email = " + mysql.escape(req.body.mail) +
//        " AND type = " + mysql.escape(req.body.type) +
//        " AND category = " + mysql.escape(req.body.cat) +
//        " AND roomWant = " + mysql.escape(req.body.want)

//    } else {
//        data = "DELETE FROM bookingstatus " +
//        " WHERE email = " + mysql.escape(req.body.mail) +
//        " AND type = " + mysql.escape(req.body.type) +
//        " AND category = " + mysql.escape(req.body.cat) +
//        " AND roomWant = " + mysql.escape(req.body.want)
//    }
   
//    data1 = "SELECT * " +
//        "FROM  bookingstatus " +
//        "WHERE status = 0 ";

//    connectDB.query(data, (err, result) => {
//        if (err) throw err;
//        else {
//            connectDB.query(data1, (err1, result1) => {
//                if (err1) throw err1;
//                else {
//                    for (i in result1) {
//                        var a = result1[i].date; 
//                        result1[i].date = a.toString().slice(0, 15);
//                    }
//                    return res.render('admin/index', { msg: "", err: "", data: result1 });
//                }
//            })
//        }
//    })

// }

// //get add hotel page

// exports.getAddHotel = (req, res, next) => {
//    res.render('admin/addhotel', { msg: "", err: "" });
// }

// //add new hotel info
// exports.postAddHotel = (req, res, next) => {
  
//    var connectDB = mysql.createConnection({
//        host: "localhost",
//        user: "root",
//        password: "",
//        database: "hotel"
//    });

//    //var
//    var cat = "", type = "", cost = 0, avlvl = 0, des = ""
//   var imgPath=""
//    var wrong = 0;

//    new formidable.IncomingForm().parse(req)
//        .on('field', (name, field) => {
//            if (name === "cat") {
//                cat = field;
//            }
//            else if (name === "type") {
//                type = field;
//            }
//            else if (name === "cost") {
//                cost = parseInt(field);
//            }
//            else if (name === "avlvl") {
//                avlvl = parseInt(field);
//            }
//            else if (name === "des") {
//                des = field
//            }

//        })
//        .on('file', (name, file) => {
//            // console.log('Uploaded file', name)
//            //   fs.rename(file.path,__dirname+"a")
//        })
//        .on('fileBegin', function (name, file) {
//            //console.log(mail);

//            var fileType = file.type.split('/').pop();
//            if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {

//                a = path.join(__dirname, '../')
//                ///  console.log(__dirname)
//                //  console.log(a)
//                if (name === "img") {
//                    imgPath = (cat + type + cost + "." + fileType);
//                }
//                imgPath ='/assets/img/rooms/' + (cat + type + cost + "." + fileType)
//                file.path = a + '/public/assets/img/rooms/' + (cat + type + cost + "." + fileType); // __dirname
//            } else {
//                console.log("Wrong File type")
//                wrong = 1;
//                res.render('admin/addhotel', { msg: "", err: "Wrong File type" });
//            }
//        })
//        .on('aborted', () => {
//            console.error('Request aborted by the user')
//        })
//        .on('error', (err) => {
//            console.error('Error', err)
//            throw err
//        })
//        .on('end', () => {

//            if (wrong == 1) {
//                console.log("Error")
//            }
//            else {

//                //saveDir = __dirname + '/uploads/';
               
//                data = "INSERT INTO `category`(`name`, `type`, `cost`, `available`, `img`, `dec`) "+
//                         "VALUES('" +cat + "','" + type + "', '" + cost + "','" +avlvl + "' ,'" + imgPath + "' ,'" + des + "' )"
//                connectDB.query(data, (err, result) => {

//                    if (err) {
//                        throw err;
//                    }
//                    else {
//                        res.render('admin/addhotel', { msg: "Data Insert Successfuly", err: "" });
//                    }
//                });
//            }
//        })
// }

// //get update page
// exports.getSearch = (req, res, next) => {
//    res.render('admin/search', { msg: "", err: "" })
// }

// //post request
// exports.postSearch = (req, res, next) => {
//    //console.log(req.body);

//    var connectDB = mysql.createConnection({
//        host: "localhost",
//        user: "root",
//        password: "",
//        database: "hotel"
//    });

//    data = "SELECT * " +
//        "FROM category " +
//        "WHERE name = " + mysql.escape(req.body.cat);

//    connectDB.query(data, (err, result) => {
//        if (err) throw err;
//        else {
//            return res.render('admin/update', { msg: "", err: "", data: result });
//        }
//    })

// }

// //get update page 

// exports.getUpdate = (req, res, next) => {
//    // console.log(req.body);
//    var connectDB = mysql.createConnection({
//        host: "localhost",
//        user: "root",
//        password: "",
//        database: "hotel"
//    });

//    data = "SELECT * " +
//        "FROM category " +
//        "WHERE name = " + mysql.escape(req.body.cat) +
//        " AND type = " + mysql.escape(req.body.type) +
//        " AND cost = " + mysql.escape(req.body.cost);

//    connectDB.query(data, (err, result) => {
//        if (err) throw err;
//        else {
//            req.session.info = result[0];
//            res.render('admin/updatePage', { data: result[0] });
//        }
//    })
// }

// //update previous data

// exports.updatePrevData = (req, res, next) => {

//    var connectDB = mysql.createConnection({
//        host: "localhost",
//        user: "root",
//        password: "",
//        database: "hotel"
//    });

//    data = "UPDATE category " +
//        "SET type = " + mysql.escape(req.body.type) +
//        ", cost = " + mysql.escape(parseInt(req.body.cost)) +
//        ", available = " + mysql.escape(parseInt(req.body.avlvl)) +
//        ", `dec` = " + mysql.escape(req.body.des) +
//        " WHERE name = " + mysql.escape(req.session.info.name) +
//        " AND type = " + mysql.escape(req.session.info.type) +
//        " AND cost = " + mysql.escape(parseInt(req.session.info.cost))

//    //  console.log(req.session.info);    
//    //  console.log(req.body); 
//    //  console.log(data);        

//    connectDB.query(data, (err, result) => {
//        if (err) throw err;
//        else {
//            res.render('admin/search', { msg: "Update Done Successfuly", err: "" })
//        }
//    })

// }

// //logout
// exports.logout = (req, res, next) => {
//    req.session.destroy();
//    res.render('admin/login', { msg: "", err: "" });
// }

