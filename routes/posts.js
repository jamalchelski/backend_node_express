var express = require('express');
var router = express.Router();

var conn = require('../library/database')

//INDEX POSTS

router.get('/',function(req,res,next){
    conn.query('SELECT * FROM tbl_post ORDER BY id desc',function(err,rows){
        if(err){
            req.flash('error',err);
            req.render('post',{
                data:''
            });
        }else{
            res.render('posts/index',{
                data:rows
            });
        }
    });
});

// CREATE POSTS
router.get('/create', function (req,res,next){
    res.render('posts/create', {
        id_station:'',
        suhu:'',
        hum:''
    })
})

// STORE POST

router.post('/store',function(req,res,next){
    let id_station = req.body.id_station;
    let suhu = req.body.suhu;
    let hum = req.body.hum;
    let errors = false;

    if (id_station.length === 0){
        errors = true;

        req.flash('error', "silahkan masukan id_station");
        res.render('posts/create', {
            id_station:id_station,
            suhu:suhu,
            hum:hum
        })
    }
    if(suhu.length === 0){
        errors = true;

        req.flash('error', "silahkan masukan Suhu");
        res.render('posts/create', {
            id_station:id_station,
            suhu:suhu,
            hum:hum
        })
    }

    if(hum.length === 0){
        errors = true;

        req.flash('error', "silahkan masukan Humidity");
        res.render('posts/create', {
            id_station:id_station,
            suhu:suhu,
            hum:hum
        })
    }

    // if no error
    if(!errors) {

        let formData = {
            id_station:id_station,
            suhu:suhu,
            hum:hum
        }
        
        // insert query
        conn.query('INSERT INTO tbl_post SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('posts/create', {
                    id_station: formData.id_station,
                    suhu: formData.suhu, 
                    hum: formData.hum                    
                })
            } else {                
                req.flash('success', 'Data Berhasil Disimpan!');
                res.redirect('/posts');
            }
        })
    }

})

//EDIT POST
router.get('/edit/(:id)', function(req,res,next){
    let id = req.params.id;
    conn.query('SELECT * FROM tbl_post WHERE id = ' + id,function(err,rows,fields){
        if(err) throw err

        if(rows.length <= 0){
            req.flash('error','Data Post dengan id '+id+' tidak ditemukan')
            res.redirect('/posts')
        }
        else {
            res.render('posts/edit',{
                id:rows[0].id,
                id_station:rows[0].id_station,
                suhu:rows[0].suhu,
                hum:rows[0].hum
            })
        }
    })
})

//UPDATE POST

router.post('/update/:id', function(req, res, next) {

    let id      = req.params.id;
    let id_station = req.body.id_station;
    let suhu = req.body.suhu;
    let hum = req.body.hum;
    let errors  = false;

    if (id_station.length === 0){
        errors = true;

        req.flash('error', "silahkan masukan id_station");
        res.render('posts/create', {
            id_station:id_station,
            suhu:suhu,
            hum:hum
        })
    }
    if(suhu.length === 0){
        errors = true;

        req.flash('error', "silahkan masukan Suhu");
        res.render('posts/create', {
            id_station:id_station,
            suhu:suhu,
            hum:hum
        })
    }

    if(hum.length === 0){
        errors = true;

        req.flash('error', "silahkan masukan Humidity");
        res.render('posts/create', {
            id_station:id_station,
            suhu:suhu,
            hum:hum
        })
    }

    // if no error
    if( !errors ) {   
 
        let formData = {
            id_station:id_station,
            suhu:suhu,
            hum:hum
        }

        // update query
        conn.query('UPDATE tbl_post SET ? WHERE id = ' + id, formData, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('posts/edit', {
                    id:     req.params.id,
                    id_station: formData.id_station,
                    suhu: formData.suhu, 
                    hum: formData.hum 
                })
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                res.redirect('/posts');
            }
        })
    }
})

//DELETE POST
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    conn.query('DELETE FROM tbl_post WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to posts page
            res.redirect('/posts')
        } else {
            // set flash message
            req.flash('success', 'Data Berhasil Dihapus!')
            // redirect to posts page
            res.redirect('/posts')
        }
    })
})

module.exports = router;