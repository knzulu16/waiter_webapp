module.exports = function(models) {
        const waiters = function(req, res, next) {
                res.render('waiters')
        }

        const waiterAccess = function(req, res, next) {
                var daysObject = {};
                var firstLetter = req.params.username.substring(0, 1);
                var uppercase = req.params.username.substring(0, 1).toUpperCase()
                var username = req.params.username.replace(firstLetter, uppercase);

                var days = req.body.day;

                if (!Array.isArray(days)) {
                        days = [days]
                }

                days.forEach(function(day) {
                        daysObject[day] = true

                });
                // console.log(username);
                models.waiterInfo.findOne({
                        waiterName: username
                }, function(err, results) {
                        if (err) {
                                return next(err)
                        }

                        console.log(results);
                        if (results !== null) {

                                console.log('results exits');

                                var amanda = {
                                        waiterName: results.waiterName,
                                        days: results.daysToWork
                                }
                                res.render('days', amanda)
                        }
                         if (results == null) {
                                 console.log('creating');
                                models.waiterInfo.create({
                                        waiterName: username,
                                        daysToWork: daysObject
                                }, function(err, results) {
                                        if (err) {
                                                return next(err)
                                        }
                                        var amanda = {
                                                waiterName: results.waiterName,
                                                days: results.daysToWork
                                        }
                                        res.render('days', amanda)

                                })

                }
                })

        }

        const days = function(req, res, next) {

                var daysObject = {};
                var firstLetter = req.params.username.substring(0, 1);
                var uppercase = req.params.username.substring(0, 1).toUpperCase()
                var username = req.params.username.replace(firstLetter, uppercase);

                var days = req.body.day;
                if (!Array.isArray(days)) {
                        days = [days]
                }

                days.forEach(function(day) {
                        daysObject[day] = true

                });



                models.waiterInfo.findOneAndUpdate({
                        waiterName: username
                }, {
                        daysToWork: daysObject
                }, function(err, result) {
                        if (err) {
                                console.log(err);
                        } else if (!result) {
                                models.waiterInfo.create({
                                        waiterName: username,
                                        daysToWork: daysObject
                                });
                        }
                });


                req.flash('error', "Thank you, shift updated.")
                res.redirect('/waiters/' + username);


        }


        // const admin = function(req, res, next) {
        //         var firstLetter = req.params.username.substring(0, 1);
        //         var uppercase = req.params.username.substring(0, 1).toUpperCase()
        //         var username = req.params.username.replace(firstLetter, uppercase);
        //         var days = req.body.day;
        //
        //         models.waiterInfo.find({
        //                 waiterName: username,
        //                 daysToWork: days
        //         }, function(err, adminResults) {
        //                 if (err) {
        //                         return next(err)
        //                 }
        //                 res.render('admin', {
        //                         adminResults
        //                 })
        //         })
        //
        //
        // }


        return {
                waiters,
                waiterAccess,
                days
                // admin
        }
}
